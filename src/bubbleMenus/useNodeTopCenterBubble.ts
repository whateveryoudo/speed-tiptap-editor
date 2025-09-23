import { ref, computed, onUnmounted, nextTick } from "vue";
import type { Editor } from "@tiptap/core";
import {
  computePosition,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/dom";

export interface UseNodeTopCenterBubbleOptions {
  // 指定节点名称（优先使用），从选区向上查找该节点
  nodeName?: string;
  // 自定义获取锚点 DOM（返回定位用的元素），若提供则优先使用
  getAnchorDom?: (editor: Editor) => HTMLElement | null;
  // 是否显示的附加判断（可选）
  extraShouldShow?: (editor: Editor) => boolean;
  // 是否要求空选区（默认 true）
  requireEmptySelection?: boolean;
}

export function useNodeTopCenterBubble(
  editor: Editor,
  options: UseNodeTopCenterBubbleOptions = {}
) {
  const {
    nodeName,
    getAnchorDom,
    extraShouldShow,
    requireEmptySelection = true,
  } = options;

  const isVisible = ref(false);
  const floatingElement = ref<HTMLElement | null>(null);
  let cleanup: (() => void) | null = null;

  const getAnchorFromSelection = (): HTMLElement | null => {
    if (!editor || !editor.state) return null;
    const { selection } = editor.state;
    const { $from } = selection;
    if (getAnchorDom) return getAnchorDom(editor);
    if (!nodeName) return null;
    for (let depth = $from.depth; depth >= 0; depth--) {
      const node = $from.node(depth);
      if (node.type.name === nodeName) {
        const pos = $from.start(depth);
        try {
          const dom = editor.view.nodeDOM(pos) as HTMLElement | null;
          return dom;
        } catch {
          return null;
        }
      }
    }
    return null;
  };

  const shouldShow = computed(() => {
    if (!editor || !editor.isEditable) return false;
    if (requireEmptySelection && !editor.state.selection.empty) return false;
    if (extraShouldShow && !extraShouldShow(editor)) return false;
    const anchor = getAnchorFromSelection();
    return !!anchor;
  });

  const updatePosition = async () => {
    if (!floatingElement.value) return;
    const anchor = getAnchorFromSelection();
    if (!anchor) return;
    const { x, y } = await computePosition(anchor, floatingElement.value, {
      placement: "top",
      middleware: [offset(8), flip(), shift({ padding: 8 })],
    });
    if (floatingElement.value) {
      Object.assign(floatingElement.value.style, {
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
      });
    }
  };

  const showBubble = async () => {
    if (!shouldShow.value) return hideBubble();
    isVisible.value = true;
    document.addEventListener("click", handleGlobalClick, true);
    window.addEventListener("scroll", hideBubble, true);
    window.addEventListener("resize", hideBubble, true);
    await nextTick();
    if (floatingElement.value) {
      const anchor = getAnchorFromSelection();
      if (anchor) {
        if (cleanup) cleanup();
        cleanup = autoUpdate(anchor, floatingElement.value, updatePosition, {
          animationFrame: true,
        });
      }
    }
  };

  const hideBubble = () => {
    isVisible.value = false;
    document.removeEventListener("click", handleGlobalClick, true);
    window.removeEventListener("scroll", hideBubble, true);
    window.removeEventListener("resize", hideBubble, true);
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
  };

  const isClickOutside = (event: MouseEvent): boolean => {
    if (!floatingElement.value) return true;
    const target = event.target as Node;
    if (floatingElement.value.contains(target)) return false;
    const anchor = getAnchorFromSelection();
    if (anchor && anchor.contains(target as Node)) return false;
    const antdPopover = (target as Element).closest(
      ".ant-popover, .ant-dropdown, .ant-tooltip, .ant-modal"
    );
    if (antdPopover) return false;
    return true;
  };

  const handleGlobalClick = (event: MouseEvent) => {
    if (isVisible.value && isClickOutside(event)) {
      setTimeout(() => {
        if (isVisible.value) hideBubble();
      }, 100);
    }
  };

  const handleEditorFocus = () => {
    if (shouldShow.value) showBubble();
    else hideBubble();
  };

  const handleSelectionUpdate = () => {
    if (shouldShow.value) showBubble();
    else hideBubble();
  };

  const handleTransaction = ({ transaction }: { transaction: any }) => {
    if (
      transaction?.docChanged &&
      !transaction.getMeta("keep" + nodeName + "Bubble")
    ) {
      hideBubble();
    }
  };

  onUnmounted(() => hideBubble());

  return {
    isVisible,
    floatingElement,
    shouldShow,
    showBubble,
    hideBubble,
    handleEditorFocus,
    handleSelectionUpdate,
    handleTransaction,
  };
}

export default useNodeTopCenterBubble;
