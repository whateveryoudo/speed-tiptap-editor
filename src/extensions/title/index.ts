/*
 * @Author: ykx
 * @Date: 2022-11-11 15:30:15
 * @LastEditTime: 2023-01-06 11:33:21
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\title\index.ts
 */
import { mergeAttributes, Node } from '@tiptap/core';
import { VueNodeViewRenderer  } from '@tiptap/vue-3';
import { Plugin, PluginKey, TextSelection } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { getDatasetAttribute, getNodeAtPos, isInTitle, nodeAttrsToDataset } from '@/prose-utils';

import Wrapper from './Wrapper.vue';

export interface TitleOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    title: {
      setTitle: (attributes: any) => ReturnType;
      toggleTitle: (attributes: any) => ReturnType;
    };
  }
}

export const TitleExtensionName = 'title';

const TitlePluginKey = new PluginKey(TitleExtensionName);

export const Title = Node.create<TitleOptions>({
  name: TitleExtensionName,
  content: 'inline*',
  group: 'block',
  defining: true,
  isolating: true,
  showGapCursor: true,
  marks: '', // 禁用样式修改
  addOptions() {
    return {
      HTMLAttributes: {
        class: 'node-title',
      },
    };
  },

  // addAttributes() {
  //   return {
  //     cover: {
  //       default: '',
  //       parseHTML: getDatasetAttribute('cover'),
  //     },
  //   };
  // },

  parseHTML() {
    return [
      {
        tag: 'h1[class=node-title]',
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    // const { cover } = node.attrs;
    return [
      'h1',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, nodeAttrsToDataset(node)),
      ['div', 0],
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer (Wrapper);
  },

  // addProseMirrorPlugins() {
  //   const { editor } = this;
  //   let shouldSelectTitleNode = true;

  //   const closeSelectTitleNode = () => {
  //     shouldSelectTitleNode = false;
  //     return;
  //   };

  //   return [
  //     new Plugin({
  //       key: TitlePluginKey,
  //       props: {
  //         decorations: (state) => {
  //           const { doc } = state;
  //           const decorations:any[] = [];
  //           doc.descendants((node, pos) => {
  //             if (node.type.name !== this.name) return;

  //             decorations.push(
  //               Decoration.node(pos, pos + node.nodeSize, {
  //                 class: editor.isEditable ? 'is-editable' : '',
  //               })
  //             );
  //           });
  //           return DecorationSet.create(doc, decorations);
  //         },
  //         handleClick() {
  //           closeSelectTitleNode();
  //           return;
  //         },
  //         handleDOMEvents: {
  //           click: closeSelectTitleNode,
  //           mousedown: closeSelectTitleNode,
  //           pointerdown: closeSelectTitleNode,
  //           touchstart: closeSelectTitleNode,
  //         },
  //         handleKeyDown(view, evt) {
  //           const { state, dispatch } = view;

  //           closeSelectTitleNode();

  //           if (isInTitle(view.state) && evt.code === 'Enter') {
  //             evt.preventDefault();

  //             const paragraph = state.schema.nodes.paragraph;

  //             if (!paragraph) {
  //               return true;
  //             }

  //             const $head = state.selection.$head;
  //             const titleNode = $head.node($head.depth);
  //             const endPos = ((titleNode.firstChild && titleNode.firstChild.nodeSize) || 0) + 1;

  //             const nextNode = getNodeAtPos(state, endPos + 2);

  //             if (!nextNode) {
  //               dispatch(state.tr.insert(endPos, paragraph.create()));
  //             }

  //             const newState = view.state;
  //             const next = new TextSelection(newState.doc.resolve(endPos + 2));
  //             dispatch(newState.tr.setSelection(next));

  //             return true;
  //           }
  //         },
  //       },
  //       appendTransaction: (transactions, oldState, newState) => {
  //         if (!editor.isEditable) return;

  //         const tr = newState.tr;
  //         let shouldReturnTr = false;

  //         if (shouldSelectTitleNode) {
  //           const firstNode = newState?.doc?.content?.content?.[0];
  //           if (firstNode && firstNode.type.name === this.name && firstNode.nodeSize === 2) {
  //             const selection = new TextSelection(newState.tr.doc.resolve(firstNode?.attrs?.cover ? 1 : 0));
  //             tr.setSelection(selection).scrollIntoView();
  //             tr.setMeta('addToHistory', false);
  //             shouldReturnTr = true;
  //           }
  //         }

  //         const filterTitleNode = (nodes: any, equal = true) => {
  //           return (nodes || [])
  //             .filter(Boolean)
  //             .filter((item: any) => (equal ? item.type.name === this.name : item.type.name !== this.name));
  //         };

  //         const newTitleNodes = filterTitleNode(newState.tr.doc.content.content || []);

  //         if (newTitleNodes.length > 1) {
  //           const oldTitleNodes = filterTitleNode(oldState.tr.doc.content.content || []);
  //           const allTitleNodes = [...oldTitleNodes, ...newTitleNodes].filter(Boolean);
  //           const nextNewTitleNode = allTitleNodes.find((node) => node.nodeSize > 2) || allTitleNodes[0];

  //           const otherNewNodes = filterTitleNode(newState.tr.doc.content.content || [], false);

  //           const fixedDoc = {
  //             ...newState.tr.doc.toJSON(),
  //             content: [].concat(
  //               nextNewTitleNode.toJSON(),
  //               otherNewNodes.map((node: any) => node.toJSON())
  //             ),
  //           };

  //           tr.replaceWith(0, newState.doc.content.size, newState.schema.nodeFromJSON(fixedDoc));

  //           if (tr.docChanged) {
  //             shouldReturnTr = true;
  //             tr.setMeta('addToHistory', false);
  //           }
  //         }

  //         return shouldReturnTr ? tr : undefined;
  //       },
  //     }),
  //   ];
  // },
});
