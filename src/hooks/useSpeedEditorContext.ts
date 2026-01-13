
// editor 消费与提供（整合editor.vue的一些向下传递的属性和方法）

import { createInjectionState } from '@vueuse/core';
import { computed, ref, type ComputedRef, type Ref } from 'vue';
import { getDefaultKit } from '@/extensions/kit';
import { type CollaborationEditorProps } from '@/type';

// 定义返回的上下文类型
export interface SpeedEditorContext {
  speedTiptapConfig: ComputedRef<CollaborationEditorProps>;
  editableCpt: ComputedRef<boolean>;
  previewInstance: Ref<any>;
  searchReplaceVisible: Ref<boolean>;
  updateSearchReplaceVisible: (visible: boolean) => void;
  globalTiptapStorage: Ref<Record<string, any>>;
  updateGlobalTiptapStorageFunc: (key: string, value: any) => void;
  aiExtensions: any[];
}

function initStateFunc(props: CollaborationEditorProps): SpeedEditorContext {
  // props全量配置（主要包含对编辑器的配置）
  const speedTiptapConfig = computed(() => {
    return props;
  })
  // 是否可编辑
  const editableCpt = computed(() => {
    return props.editable ?? true;
  })
  // 图片预览实例
  const previewInstance = ref<any>(null);

  // 替换弹框可见性
  const searchReplaceVisible = ref(false);
  const updateSearchReplaceVisible = (visible: boolean) => {
    searchReplaceVisible.value = visible;
  }

  // 扩展请求的存储
  const globalTiptapStorage = ref<Record<string, any>>({}); // 模拟一个编辑器的全局存储，用于某些没有加入扩展的请求（如：drag-handle）
  const updateGlobalTiptapStorageFunc = (key: string, value: any) => {
    globalTiptapStorage.value[key] = value;
  }

  // 向下传入ai文本扩展（注：这里不需要tite扩展）
  const aiExtensions = getDefaultKit(props);

  return {
    speedTiptapConfig,
    editableCpt,
    previewInstance,
    searchReplaceVisible,
    updateSearchReplaceVisible,
    globalTiptapStorage,
    updateGlobalTiptapStorageFunc,
    aiExtensions,
  }
}



const [useSpeedEditorProvider, useSpeedEditorOriginal] = createInjectionState(initStateFunc);

// 包装 useSpeedEditor，确保总是返回非空（带类型守卫）
const useSpeedEditor = (): SpeedEditorContext => {
  const context = useSpeedEditorOriginal();
  if (!context) {
    throw new Error('useSpeedEditor must be used within SpeedEditorProvider');
  }
  return context;
}

export { useSpeedEditorProvider, useSpeedEditor };