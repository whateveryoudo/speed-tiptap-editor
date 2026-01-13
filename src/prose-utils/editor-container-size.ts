import { Editor } from '@tiptap/core';

const cache = new Map();

export function getEditorContainerDOMSize(editor: Editor): { width: number } {
  const targetNode = editor.options.element as HTMLElement;
  const tiptapNode = targetNode.querySelector('.tiptap') as HTMLElement; // 下面的主元素有padding
  const styles = window.getComputedStyle(tiptapNode)
  const paddingLeft = parseFloat(styles.paddingLeft || '0')
  const paddingRight = parseFloat(styles.paddingRight || '0')
  const contentWidth = tiptapNode.clientWidth - paddingLeft - paddingRight
  if (!cache.has('width')) {
    cache.set('width', contentWidth);
  }

  if (cache.has('width') && cache.get('width') <= 0) {
    cache.set('width', contentWidth);
  }

  const config = { attributes: true, childList: true, subtree: true };
  const callback = function (mutationsList, observer) {
    cache.set('width', contentWidth);
  };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);

  editor.on('destroy', () => {
    observer.disconnect();
  });
  return { width: cache.get('width') };
}
