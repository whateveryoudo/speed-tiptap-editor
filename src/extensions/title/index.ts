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
import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { isInTitle, nodeAttrsToDataset } from '@st/prose-utils';

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
  defining: true,
  isolating: true,
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
      0, // 直接渲染内联内容，避免在 h1 内包裹 div（防止导出的时候出现无法识别的问题）
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer (Wrapper as any);
  },

  addProseMirrorPlugins() {
    const { editor } = this;

    return [
      new Plugin({
        key: TitlePluginKey,
        state: {
          init() {
            // 初始化时检查是否有重复的 title
            return true;
          },
          apply(_tr, _oldPluginState) {
            // 每次事务后检查是否有重复的 title
            return true;
          }
        },
        props: {
          decorations: (state) => {
            const { doc } = state;
            const decorations:any[] = [];
            doc.descendants((node, pos) => {
              if (node.type.name !== this.name) return;

              decorations.push(
                Decoration.node(pos, pos + node.nodeSize, {
                  class: editor.isEditable ? 'is-editable' : 'readonly',
                })
              );
            });
            return DecorationSet.create(doc, decorations);
          },
          handleKeyDown(view, evt) {
            // 这里还是有问题，如果存在多个p还是会跳转到第二个，不会在第一个（pos问题？）
            const { state, dispatch } = view;
            // 只在 title 节点中且按下 Enter 键时处理
            if (isInTitle(view.state) && evt.code === 'Enter') {
              evt.preventDefault();

              const paragraph = state.schema.nodes.paragraph;
              if (!paragraph) {
                return true;
              }

              const doc = state.doc;
              
              // 找到第一个 title 节点
              let titleNode = null;
              let titleNodePos = 0;
              let titleIndex = 0;
              
              for (let i = 0; i < doc.content.childCount; i++) {
                const node = doc.content.child(i);
                console.log(`Looking for title: i=${i}, node=${node.type.name}, nodeSize=${node.nodeSize}`);
                if (node.type.name === 'title') {
                  titleNode = node;
                  titleIndex = i;
                  // titleNodePos 保持为 0（从 doc 节点开始）
                  break;
                }
                titleNodePos += node.nodeSize;
              }
              
              if (!titleNode) {
                return true;
              }
              
              console.log(`titleNode found: index=${titleIndex}, pos=${titleNodePos}, nodeSize=${titleNode.nodeSize}`);
              console.log(`doc structure:`, Array.from({length: doc.content.childCount}).map((_, i) => ({
                index: i,
                type: doc.content.child(i).type.name,
                nodeSize: doc.content.child(i).nodeSize
              })));
              
              // 检查 title 后面是否已有段落
              const hasNextParagraph = titleIndex + 1 < doc.content.childCount && 
                                       doc.content.child(titleIndex + 1).type.name === 'paragraph';
              
              let tr = state.tr;
              if (hasNextParagraph) {
                // 如果有段落，移动光标到第一个段落
                // 直接获取下一个节点的位置
                const nextNodeIndex = titleIndex + 1;
                let paragraphPos = 1;
                // 计算到这个段落之前所有节点的总大小
                for (let i = 0; i < nextNodeIndex; i++) {
                  paragraphPos += doc.content.child(i).nodeSize;
                }
                // paragraphPos 现在指向段落的开始位置
                // +1 移动到段落的文本位置（可输入位置）
                tr = tr.setSelection(TextSelection.create(doc, paragraphPos + 1));
                dispatch(tr);
              } else {
                // 如果没有段落，创建一个
                const titleEndPos = titleNodePos + titleNode.nodeSize;
                const newParagraph = paragraph.createAndFill() || paragraph.create();
                tr = tr.insert(titleEndPos, newParagraph);
                // +1 是段落的文本起始位置
                tr = tr.setSelection(TextSelection.create(tr.doc, titleEndPos + 1));
                dispatch(tr);
              }

              return true;
            }
          },
        },
        // appendTransaction: (_transactions, _oldState, newState) => {
        //   if (!editor.isEditable) return;
        //   console.log('执行了');
        //   const tr = newState.tr;
        //   let hasChanges = false;

        //   // 检查并修复重复的 title 节点
        //   const content = newState.doc.content;
        //   const titleNodes: any[] = [];
        //   const otherNodes: any[] = [];
          
        //   content.forEach((node) => {
        //     if (node.type.name === this.name) {
        //       titleNodes.push(node);
        //     } else {
        //       otherNodes.push(node);
        //     }
        //   });

        //   // 如果有多个 title 节点，只保留第一个
        //   if (titleNodes.length > 1) {
        //     // 合并所有 title 的内容到第一个 title
        //     const firstTitle = titleNodes[0];
        //     const mergedTitleContent = titleNodes.slice(1).reduce((acc, titleNode) => {
        //       return acc.append(titleNode.content);
        //     }, firstTitle.content);
            
        //     const newFirstTitle = newState.schema.nodes['title'].create(firstTitle.attrs, mergedTitleContent);
            
        //     const newContent = [
        //       newFirstTitle,
        //       ...otherNodes
        //     ];
            
        //     tr.replaceWith(0, newState.doc.content.size, newState.schema.nodeFromJSON({
        //       type: newState.doc.type.name,
        //       attrs: newState.doc.attrs,
        //       content: newContent.map(node => node.toJSON())
        //     }).content);
        //     tr.setMeta('addToHistory', false);
        //     tr.setMeta('preventEvent', true); // 防止触发事件
        //     hasChanges = true;
        //   }

        //   return hasChanges ? tr : undefined;
        // },
      }),
    ];
  },
});
