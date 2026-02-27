import { Extension, type Editor } from '@tiptap/core';
import { DecorationSet, Decoration } from '@tiptap/pm/view';
import { Plugin, PluginKey } from '@tiptap/pm/state';
export interface Suggestion {
    id: string;
    from: number;
    to: number;
    message: string;
    ruleId: string;
    severity: 'error' | 'warning' | 'info';
    relacement?: string;
    meta?: Record<string, any>;
}

export interface DocumentSuggestOptions {
    backendUrl?: string;
    rules?: any[];
    fetchSuggestions?: (doc: any, rules: any[], editor: Editor) => Promise<Suggestion[]>;
    getCustomSuggestionDecision?: (params: {
        suggestion: Suggestion;
        isSelected: boolean;
        getDefaultDecorations: () => Decoration[];
    }) => Promise<boolean>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        documentSuggestions: {
            loadSuggestions: () => ReturnType;
            applySuggestion: (suggestion: Suggestion) => ReturnType;
            applyAllSuggestions: () => ReturnType;
            setSuggestionRules: (rules: any[]) => ReturnType;
            rejectSuggestion: (suggestion: Suggestion) => ReturnType;
        };
    }
}

export const DocumentSuggest = Extension.create({
    name: 'documentSuggest',

    addOptions() {
        return {
            backendUrl: '',
            rules: [],
            fetchSuggestions: undefined,
            getCustomSuggestionDecision: undefined,
        };
    },

    addStorage() {
        return {
            isLoading: false,
            error: null as any,
            suggestions: [] as Suggestion[],
            getSuggestions: () => this.suggestions,
        };
    },
    addCommands() {
        return {
            loadSuggestions: () => async ({ editor }) => {
                const storage = this.storage();
                storage.isLoading = true;
                storage.error = null;
                try {
                    const docJson = editor.getJSON();
                    const rules = this.options.rules || [];
                    let suggestions: Suggestion[] = [];
                    if (this.options.fetchSuggestions) {
                        suggestions = await this.options.fetchSuggestions(docJson, rules, editor);
                    } else {
                        const resp = await fetch(this.options.backendUrl, {
                            method: 'POST',
                            body: JSON.stringify({
                                doc: docJson,
                                rules: rules,
                            }),
                        });
                        if (!resp.ok) {
                            throw new Error('Failed to fetch suggestions');
                        }
                        const data = await resp.json();
                        suggestions = data.suggestions || [];
                    }
                    storage.suggestions = suggestions;
                } catch (error) {
                    storage.error = error;
                } finally {
                    storage.isLoading = false;
                }
                return true;
            },
            applySuggestion: (id: string) => ({ editor }) => {
                const storage = this.storage();
                const target = storage.suggestions.find((s: Suggestion) => s.id === id);
                if (!target || !target.relacement) {
                    return false;
                }
                editor.chain().focus().insertContentAt({
                    from: target.from,
                    to: target.to,
                }, target.relacement).run();
                storage.suggestions = storage.suggestions.filter((s: Suggestion) => s.id !== id);
                return true;
            },
            applyAllSuggestions: () => ({ editor }) => {
                const storage = this.storage();
                const applicable = storage.suggestions.filter((s: Suggestion) => s.relacement).sort((a: Suggestion, b: Suggestion) => a.from - b.from);
                editor.chain().focus();
                for (const suggestion of applicable) {
                    editor.chain().insertContentAt({
                        from: suggestion.from,
                        to: suggestion.to,
                    }, suggestion.relacement).run();
                }
                storage.suggestions = [];
                return true;
            },
            setSuggestionRules: (rules: any[]) => () => {
                const storage = this.storage();
                storage.rules = rules;
                return true;
            },
            rejectSuggestion: (id: string) => () => {
                const storage = this.storage();
                storage.suggestions = storage.suggestions.filter((s: Suggestion) => s.id !== id);
                return true;
            }
        }
    },
    addProseMirrorPlugins() {
        const pluginKey = new PluginKey("documentSuggest");
        return [
            new Plugin({
                key: pluginKey,
                state: {
                    init: () => {
                        return DecorationSet.empty;
                    },
                    apply: (tr, old) => {
                        const action = tr.getMeta(pluginKey)
                        if (action?.type === 'update') {
                            return action.decorations;
                        }
                        return old.map(tr.mapping, tr.doc);
                    }
                },
                props: {
                    decorations: (state) => {
                        return pluginKey.getState(state);
                    }
                },
                view: editorView => {
                    let lastSuggestionKey = '';  // 记录上一次 suggestions 的签名
                    const updateDecorations = () => {
                        const { suggestions } = this.storage;
                        // 用 id + 数量做一个简单签名，判断 suggestions 是否有变化
                        const key = suggestions.map((s: Suggestion) => s.id).join(',') + '|' + suggestions.length;
                        if (key === lastSuggestionKey) {
                            return;
                        }
                        lastSuggestionKey = key;
                        const decorations: Decoration[] = [];
                        const { state } = editorView;
                        const { selection } = state;
                        for (const s of suggestions) {
                            const isSelected = selection.from >= s.from && selection.to <= s.to;
                            const base: Decoration[] = [
                                Decoration.inline(s.from, s.to, {
                                    class: `ai-suggestion ai-suggestion--${s.severity}`,
                                    'data-suggestion-id': s.id,
                                })
                            ]

                            if (this.options.getCustomSuggestionDecision) {
                                const extra = this.options.getCustomSuggestionDecision({
                                    suggestion: s,
                                    isSelected: isSelected,
                                    getDefaultDecorations: () => base,
                                });
                                decorations.push(...extra);
                            } else {
                                decorations.push(...base);
                            }

                        }
                        const decoSet = DecorationSet.create(editorView.state.doc, decorations);
                        const tr = editorView.state.tr.setMeta(pluginKey, {
                            type: 'update',
                            decorations: decoSet,
                        });
                        editorView.dispatch(tr);
                    }
                    return {
                        update: updateDecorations,
                        destroy() { }
                    }
                }
            })
        ]
    }
})
