// 此hook为顶部（这里的top会动态计算）固定气泡（默认会监听selectionUpdate初始化固定在上方,滚动,缩放会自动消失）
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
  // 是否滚动时关闭
  hideWhenScroll?: boolean;
  scrollElem?: HTMLElement;
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
    hideWhenScroll = false,
    scrollElem = document.querySelector('.editor-content-wrap') // 目前封装到组件内部这里直接指定就行
  } = options;
  let removeScrollEventListener: any = null;
  let rafId: number | null = null;
  let scrollStartTop = 0;
  let stopTimer: number | null = null;
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
        const pos = $from.before(depth); // 注意这里不要使用start start是找到内容起始
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
      middleware: [
        offset(8),
        flip({ boundary: scrollElem! }),
        shift({ boundary: scrollElem!, padding: 8 }),
      ],
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
    if (hideWhenScroll) {
      const threshold = 30; // 暂不支持配置
      // 初始化起点
      scrollStartTop = scrollElem!.scrollTop;

      const onScroll = () => {
        if (rafId !== null) return;
        if (stopTimer) {
          window.clearTimeout(stopTimer);
          stopTimer = null;
        }
        // 连续滚动开始时，起点应为滚动开始的那个位置
        rafId = requestAnimationFrame(() => {
          rafId = null;
          const current = scrollElem!.scrollTop;
          if (Math.abs(current - scrollStartTop) > threshold) {
            hideBubble();
            return;
          }
          // 滚动结束后重置起点
          stopTimer = window.setTimeout(() => {
            stopTimer = null;
            scrollStartTop = current;
          }, 120);
        });
      };

      scrollElem!.addEventListener("scroll", onScroll, { passive: true });
      removeScrollEventListener = () => {
        scrollElem!.removeEventListener("scroll", onScroll as any);
      };
    }
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
    removeScrollEventListener && removeScrollEventListener();
    window.removeEventListener("resize", hideBubble, true);
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (stopTimer) {
      window.clearTimeout(stopTimer);
      stopTimer = null;
    }
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
    handleSelectionUpdate,
    handleTransaction,
    getAnchorFromSelection,
  };
}

export default useNodeTopCenterBubble;
