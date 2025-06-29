/*
 * @Author: ykx
 * @Date: 2022-11-14 10:53:02
 * @LastEditTime: 2022-11-14 10:53:04
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\focus.ts
 */
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export interface FocusOptions {
  className: string;
  mode: 'all' | 'deepest' | 'shallowest';
}

export const Focus = Extension.create<FocusOptions>({
  name: 'focus',

  addOptions() {
    return {
      className: 'has-focus',
      mode: 'all',
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('focus'),
        props: {
          decorations: ({ doc, selection }) => {
            const { isEditable, isFocused } = this.editor;
            const { anchor } = selection;
            const decorations: Decoration[] = [];

            if (!isEditable || !isFocused) {
              return DecorationSet.create(doc, []);
            }

            // Maximum Levels
            let maxLevels = 0;

            if (this.options.mode === 'deepest') {
              doc.descendants((node, pos) => {
                if (node.isText) {
                  return;
                }

                const isCurrent = anchor >= pos && anchor <= pos + node.nodeSize - 1;

                if (!isCurrent) {
                  return false;
                }

                maxLevels += 1;
              });
            }

            // Loop through current
            let currentLevel = 0;

            doc.descendants((node, pos) => {
              if (node.isText) {
                return false;
              }

              const isCurrent = anchor >= pos && anchor <= pos + node.nodeSize - 1;

              if (!isCurrent) {
                return false;
              }

              currentLevel += 1;

              const outOfScope =
                (this.options.mode === 'deepest' && maxLevels - currentLevel > 0) ||
                (this.options.mode === 'shallowest' && currentLevel > 1);

              if (outOfScope) {
                return this.options.mode === 'deepest';
              }

              decorations.push(
                Decoration.node(pos, pos + node.nodeSize, {
                  class: this.options.className,
                })
              );
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
