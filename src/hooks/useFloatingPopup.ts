/*
 * @Author: ykx
 * @Date: 2024-01-09
 * @LastEditTime: 2024-01-09
 * @LastEditors: your name
 * @Description: Floating UI 弹出层管理 Hook，支持点击弹窗外部自动关闭
 * @FilePath: src/hooks/useFloatingPopup.ts
 */
import { ref, onUnmounted } from "vue";
import { computePosition, offset, flip, shift, size } from "@floating-ui/dom";
import type { VueRenderer } from "@tiptap/vue-3";

interface FloatingPopupOptions {
  placement?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "left-start"
    | "left-end"
    | "right-start"
    | "right-end";
  offset?: number;
  padding?: number;
  zIndex?: number;
  scrollElem?: HTMLElement;
}

interface PopupInstance {
  popup: HTMLElement;
  component: VueRenderer;
  updatePosition: (clientRect: () => DOMRect) => Promise<void>;
  destroy: () => void;
}

export function useFloatingPopup(options: FloatingPopupOptions = {}) {
  const {
    placement = "bottom-start",
    offset: offsetValue = 4,
    padding = 8,
    zIndex = 999,
    scrollElem = document.querySelector(".editor-content-wrap"), // 目前编辑器的滚动容器类
  } = options;

  const popupInstance = ref<PopupInstance | null>(null);

  // 用于存储外部点击监听的引用，避免重复绑定和内存泄漏
  let removeClickListener: (() => void) | null = null;

  /**
   * 创建弹出层实例
   */
  const createPopup = (component: VueRenderer): PopupInstance => {
    // 创建弹出层容器
    const popup = document.createElement("div");
    popup.style.position = "absolute";
    popup.style.zIndex = zIndex.toString();
    popup.style.pointerEvents = "auto";
    popup.style.overflowY = "auto";
    popup.style.backgroundColor = "#fff";
    popup.style.padding = "3px 10px";
    popup.style.boxShadow =
      "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)";
    popup.style.borderRadius = "4px";
    // 确保 component.element 存在
    if (component.element) {
      popup.appendChild(component.element);
    }

    scrollElem!.appendChild(popup); // 追加到主容器上

    // 更新位置的函数
    const updatePosition = async (clientRect: () => DOMRect) => {
      const rect = clientRect();
      const virtualElement = {
        getBoundingClientRect: () => rect,
      };

      const { x, y } = await computePosition(virtualElement, popup, {
        placement,
        middleware: [
          offset(offsetValue),
          flip({ boundary: scrollElem! }),
          shift({ padding, boundary: scrollElem! }),
          size({
            boundary: scrollElem!,
            padding,
            apply({ availableHeight, availableWidth }) {
              // 依据可用空间限制弹层尺寸，保证“尽可能多显示”
              popup.style.maxHeight = `${Math.max(availableHeight, 80)}px`;
              popup.style.maxWidth = `${Math.max(availableWidth, 160)}px`;
            },
          }),
        ],
      });

      popup.style.left = `${x}px`;
      popup.style.top = `${y}px`;
    };

    // 销毁函数
    const destroy = () => {
      if (popup && popup.parentNode) {
        popup.parentNode.removeChild(popup);
      }
      component.destroy();
    };

    return {
      popup,
      component,
      updatePosition,
      destroy,
    };
  };

  /**
   * 显示弹出层，并绑定点击外部关闭事件
   */
  const showPopup = (component: VueRenderer, clientRect: () => DOMRect) => {
    // 如果已有弹出层，先销毁
    if (popupInstance.value) {
      popupInstance.value.destroy();
    }

    // 创建新的弹出层
    const instance = createPopup(component);
    popupInstance.value = instance;
    // 计算初始位置
    instance.updatePosition(clientRect);

    // 绑定点击外部关闭事件
    if (removeClickListener) {
      removeClickListener();
      removeClickListener = null;
    }

    const onClickOutside = (e: MouseEvent) => {
      let isClickOutside = false;
      const popupEl = instance.popup;
      const antdPopover = (e.target as Element).closest(
        ".ant-popover, .ant-dropdown, .ant-tooltip, .ant-modal"
      );
      // 追加antd内部点击判断
      if (popupEl && !popupEl.contains(e.target as Node) && !antdPopover) {
        isClickOutside = true;
      }

      isClickOutside && hidePopup();
    };
    document.addEventListener("mousedown", onClickOutside);
    removeClickListener = () =>
      document.removeEventListener("mousedown", onClickOutside);
  };

  /**
   * 更新弹出层位置
   */
  const updatePopupPosition = async (clientRect: () => DOMRect) => {
    if (popupInstance.value) {
      await popupInstance.value.updatePosition(clientRect);
    }
  };

  /**
   * 隐藏弹出层，并移除点击外部关闭事件
   */
  const hidePopup = () => {
    if (popupInstance.value) {
      popupInstance.value.destroy();
      popupInstance.value = null;
    }
  };

  // 组件卸载时清理弹窗和事件监听
  onUnmounted(() => {
    hidePopup();
  });

  return {
    showPopup,
    updatePopupPosition,
    hidePopup,
    popupInstance,
  };
}
