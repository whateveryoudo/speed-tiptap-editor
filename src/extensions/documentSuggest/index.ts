import { Extension, type Editor } from '@tiptap/core';
import { DecorationSet, Decoration } from '@tiptap/pm/view';
import { Plugin, PluginKey, type EditorState } from '@tiptap/pm/state';

export interface FixCommand {
    action: string;
    params?: Record<string, any>;
}
export interface Suggestion {
    id: string;
    /**
     * 块级节点的 nodeId（来自 attrs.nodeId）
     */
    node_id: string;
    /**
     * 文本节点索引（在该块级节点内部，仅统计 type === "text" 的节点，从 0 开始）
     * 如果为 null / undefined / 小于 0，表示整块节点（例如整段错误）
     */
    text_index?: number | null;
    message: string;
    rule_id: string;
    severity: 'error' | 'warning' | 'info';
    /**
     * 后端返回的修复命令定义
     */
    fixCommand?: FixCommand | null;
    meta?: Record<string, any>;
}

export interface DocumentSuggestOptions {
    backendUrl?: string;
    rules?: any[];
    fetchSuggestions?: (doc: any, rules: any[], editor: Editor) => Promise<Suggestion[]>;
    /**
     * 自定义高亮装饰（比如挂载 tooltip 容器）
     */
    getCustomSuggestionDecoration?: (params: {
        suggestion: Suggestion;
        /**
         * 当前建议在文档中的范围
         */
        range: { from: number; to: number };
        /**
         * 当前 selection 是否完全落在这条建议范围内
         */
        isSelected: boolean;
        getDefaultDecorations: () => Decoration[];
    }) => Decoration[];
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        documentSuggestions: {
            loadSuggestions: () => ReturnType;
            applySuggestion: (id: string) => ReturnType;
            applyAllSuggestions: () => ReturnType;
            setSuggestionRules: (rules: any[]) => ReturnType;
            rejectSuggestion: (id: string) => ReturnType;
        };
    }
}

/**
 * 根据 node_id 和 text_index 计算建议在文档中的 from/to 位置
 */
function getSuggestionRange(params: {
    doc: any;
    suggestion: Suggestion;
}): { from: number; to: number } | null {
    const { doc, suggestion } = params;

    let blockPos: number | null = null;
    let blockNode: any = null;

    // 先找到对应的块级节点
    doc.descendants((node: any, pos: number) => {
        if (node?.attrs?.nodeId === suggestion.node_id) {
            blockPos = pos;
            blockNode = node;
            return false; // 停止继续向下遍历
        }
        return true;
    });

    if (!blockNode || blockPos == null) {
        return null;
    }

    // text_index 为空 / 小于 0：视为整块节点
    if (suggestion.text_index == null || suggestion.text_index < 0) {
        const from = blockPos as number;
        const to = from + blockNode.nodeSize;
        return { from, to };
    }

    // 否则在块级节点内部，根据 text_index 找到对应的第 N 个 text 节点
    let currentTextIndex = -1;
    let foundFrom: number | null = null;
    let foundTo: number | null = null;

    blockNode.descendants((child: any, childPos: number) => {
        if (child.isText) {
            currentTextIndex += 1;
            if (currentTextIndex === suggestion.text_index) {
                // childPos 是相对于 blockNode 内容开始的位置，因此需要 + blockPos + 1
                const from = blockPos! + 1 + childPos;
                const to = from + child.nodeSize;
                foundFrom = from;
                foundTo = to;
                return false;
            }
        }
        return true;
    });

    if (foundFrom == null || foundTo == null) {
        return null;
    }

    return { from: foundFrom, to: foundTo };
}
const documentSuggestPluginKey = new PluginKey('documentSuggest');

export const DocumentSuggest = Extension.create({
    name: 'documentSuggest',

    addOptions() {
        return {
            backendUrl: '',
            fetchSuggestions: undefined,
            getCustomSuggestionDecoration: undefined,
        };
    },

    addStorage() {
        return {
            isLoading: false,
            error: null as any,
            suggestions: [] as Suggestion[],
        };
    },
    addCommands() {
        return {
            loadSuggestions: () => ({ editor }) => {
                const storage = this.storage;
                storage.isLoading = true;
                storage.error = null;
                const docJson = editor.getJSON();
                console.log('docJson', docJson);
                const detectionNodeTypes = ['heading', 'paragraph', 'listItem', 'list', 'blockquote', 'table', 'tableRow', 'tableCell'];
                // 这里过滤第一层的自定义节点（仅保留一些特定节点）
                const rules = this.options.rules || [];
                docJson.content = docJson.content.filter((node: any) => detectionNodeTypes.includes(node.type) || node.content);
                (async () => {
                    try {
                        let suggestions: Suggestion[] = [];
                        if (this.options.fetchSuggestions) {
                            suggestions = await this.options.fetchSuggestions(docJson, rules, editor);

                        } else {
                            const resp = await fetch(this.options.backendUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    doc: docJson,
                                    rules: rules,
                                }),
                            });
                            if (!resp.ok) {
                                throw new Error('Failed to fetch suggestions');
                            }
                            const payload = await resp.json();
                            suggestions = (payload.data.suggestions || []) as Suggestion[];
                        }
                        storage.suggestions = suggestions;
                        editor.view.dispatch(editor.state.tr)

                    } catch (error) {
                        storage.error = error;
                    } finally {
                        storage.isLoading = false;
                    }
                })();
                // Test 数据：实际场景中请使用上面的异步调用后端逻辑
                // setTimeout(() => {
                //     const res = {
                //         "errCode": 0,
                //         "errMessage": "success",
                //         "success": true,
                //         "data": {
                //             "suggestions": [
                //                 {
                //                     "id": "78378cfc-f983-4968-86fa-724fe0d10bbf",
                //                     "node_id": "gdtW_Xn9",
                //                     "message": "文字里面不能出现红色",
                //                     "rule_id": "RULE_TEXT_STYLE",
                //                     "text_index": 1,
                //                     "severity": "warning",
                //                     "fixCommand": {
                //                         "action": "resetTextStyle",
                //                         "params": {}
                //                     },
                //                     "meta": {}
                //                 },
                //                 {
                //                     "id": "a114c816-32ad-4f69-b562-19cef5fdca42",
                //                     "node_id": "gdtW_Xn9",
                //                     "message": "文字块不能出现背景色",
                //                     "rule_id": "RULE_TEXT_STYLE",
                //                     "text_index": 3,
                //                     "severity": "warning",
                //                     "fixCommand": {
                //                         "action": "resetTextStyle",
                //                         "params": {}
                //                     },
                //                     "meta": {}
                //                 },
                //                 {
                //                     "id": "2bfbe273-8ae6-4a99-9b73-754bbb6aa31c",
                //                     "node_id": "s6cq-1JL",
                //                     "message": "语法性问题：句子中缺少问号。",
                //                     "rule_id": "RULE_GRAMMAR_PROBLEM",
                //                     "text_index": 0,
                //                     "severity": "warning",
                //                     "fixCommand": {
                //                         "action": "replaceText",
                //                         "params": {
                //                             "text": "我是不是写错了呢？"
                //                         }
                //                     },
                //                     "meta": {}
                //                 }
                //             ]
                //         }
                //     };
                //     const mockSuggestions = res.data.suggestions as Suggestion[];
                //     storage.suggestions = mockSuggestions;
                //     // 触发一次插件 state 重建 DecorationSet
                //     const tr = editor.state.tr.setMeta(documentSuggestPluginKey, {
                //         type: 'rebuildFromStorage',
                //     });
                //     editor.view.dispatch(tr);
                // }, 1000);

                return true;
            },
            applySuggestion: (id: string) => ({ editor }) => {
                const storage = this.storage;
                const target = storage.suggestions.find((s: Suggestion) => s.id === id);
                if (!target) {
                    return false;
                }

                const range = getSuggestionRange({ doc: editor.state.doc, suggestion: target });
                if (!range) {
                    return false;
                }

                const fix = target.fixCommand;
                const action = fix?.action;
                const params = fix?.params || {};

                // 没有可执行的修复命令，只高亮 & 标记为已处理
                if (!action) {
                    storage.suggestions = storage.suggestions.filter((s: Suggestion) => s.id !== id);
                    return true;
                }

                const chain = editor.chain().focus();

                switch (action) {
                    case 'setHeading': {
                        const level = (Number(params.level) || 1) as any;
                        chain.setTextSelection(range).setHeading({ level }).run();
                        break;
                    }
                    case 'resetTextStyle': {
                        // 清除颜色 / 背景色，后续可根据需要扩展
                        chain
                            .setTextSelection(range)
                            .unsetColor()
                            .unsetMark?.('backgroundColor')
                            .run();
                        break;
                    }
                    case 'replaceText': {
                        const text = params.text ?? '';
                        chain.insertContentAt(range, text).run();
                        break;
                    }
                    default: {
                        // 未知 action，暂不处理
                        return false;
                    }
                }

                storage.suggestions = storage.suggestions.filter((s: Suggestion) => s.id !== id);
                return true;
            },
            applyAllSuggestions: () => ({ editor }) => {
                const storage = this.storage;

                // 简单顺序执行，执行前实时根据 node_id + text_index 计算位置
                for (const s of [...storage.suggestions]) {
                    const range = getSuggestionRange({ doc: editor.state.doc, suggestion: s });
                    if (!range) continue;

                    const fix = s.fixCommand;
                    const action = fix?.action;
                    const params = fix?.params || {};
                    if (!action) continue;

                    const chain = editor.chain().focus();

                    switch (action) {
                        case 'setHeading': {
                            const level = (Number(params.level) || 1) as any;
                            chain.setTextSelection(range).setHeading({ level }).run();
                            break;
                        }
                        case 'resetTextStyle': {
                            chain
                                .setTextSelection(range)
                                .unsetColor()
                                .unsetMark?.('backgroundColor')
                                .run();
                            break;
                        }
                        case 'replaceText': {
                            const text = params.text ?? '';
                            chain.insertContentAt(range, text).run();
                            break;
                        }
                        default:
                            break;
                    }
                }

                // 清空所有建议
                storage.suggestions = [];
                return true;
            },
            setSuggestionRules: (rules: any[]) => () => {
                const storage = this.storage;
                storage.rules = rules;
                return true;
            },

            rejectSuggestion: (id: string) => () => {
                const storage = this.storage;
                storage.suggestions = storage.suggestions.filter((s: Suggestion) => s.id !== id);
                return true;
            }
        }
    },
    addProseMirrorPlugins() {
        const pluginKey = documentSuggestPluginKey;
        const buildDecorations = (state: EditorState, suggestions: Suggestion[]): DecorationSet => {
            const { doc, selection } = state as any;

            if (!suggestions || suggestions.length === 0) {
                return DecorationSet.empty;
            }

            const decorations: Decoration[] = [];
            const getRuleText = (ruleId: string) => {
                const rule = this.options.rules?.find((r: any) => r.id === ruleId);
                return rule?.name || '';
            }
            for (const s of suggestions) {
                const range = getSuggestionRange({
                    doc,
                    suggestion: s,
                });
                if (!range) {
                    continue;
                }

                const isSelected = selection.from >= range.from && selection.to <= range.to;

                const base: Decoration[] = [
                    Decoration.inline(range.from, range.to, {
                        class: `ai-suggestion ai-suggestion--${s.severity}`,
                        'data-suggestion-id': s.id,
                    }),
                ];

                if (this.options.getCustomSuggestionDecoration) {
                    const extra = this.options.getCustomSuggestionDecoration({
                        suggestion: s,
                        range,
                        isSelected,
                        ruleTitle: getRuleText(s.rule_id),
                        getDefaultDecorations: () => base,
                    });
                    if (Array.isArray(extra)) {
                        decorations.push(...extra);
                    } else {
                        decorations.push(...base);
                    }
                } else {
                    decorations.push(...base);
                }
            }

            return DecorationSet.create(doc, decorations);
        };

        return [
            new Plugin({
                key: pluginKey,
                state: {
                    init: (_config, state) => {
                        // 初始时根据当前 storage（一般为空）构建一次
                        return buildDecorations(state, this.storage.suggestions || []);
                    },
                    apply: (tr, old, oldState, newState) => {
                        const meta = tr.getMeta(pluginKey);
                        // 显式要求：根据 storage 重建一次 DecorationSet
                        if (meta?.type === 'rebuildFromStorage') {
                            return buildDecorations(newState, this.storage.suggestions || []);
                        }

                        // 文档或选区变化时，也根据当前 storage 重新计算一次
                        if (tr.docChanged || tr.selectionSet) {
                            return buildDecorations(newState, this.storage.suggestions || []);
                        }

                        // 否则沿用旧的 DecorationSet，并映射到新文档
                        return old.map(tr.mapping, tr.doc);
                    },
                },
                props: {
                    decorations: (state) => {
                        return pluginKey.getState(state);
                    }
                },
            })
        ]
    }
})
