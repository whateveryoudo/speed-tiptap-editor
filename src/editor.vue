<!--
 * @Author: ykx
 * @Date: 2022-11-10 18:44:07
 * @LastEditTime: 2023-01-06 15:50:02
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\editor\collaboration\editor.vue
-->
<template>
  <div :class="['wrap', scene]">
    <!-- 工具栏 -->
    <menu-bar :scene="scene" :toolbarKeys="toolbarKeys" v-if="menubar && editor" class="header" :editor="editor" />
    <!-- 扩展modal显示-mind -->
    <!-- <extend-mind-modal
      v-if="editor"
      :editor="editor"
      :data="mindState.data"
      :visible="mindState.visible"
      @triggerData="(data: any) => handleUpdateMindState('data', data)"
      @update:visible="(val: boolean) => handleUpdateMindState('visible', val)"></extend-mind-modal> -->
    <TextMenu v-if="editor && textBubbleMenu?.enabled" :editor="editor" />
    <TagMenu v-if="editor" :editor="editor" />
    <ImageMenu v-if="editor" :editor="editor" />
    <AttachmentMenu v-if="editor" :editor="editor"></AttachmentMenu>
    <!-- table的点击提示框 -->
    <TableMenu v-if="editor" :editor="editor" />
    <!-- table的选择气泡提示框 -->
    <TableBubbleMenu v-if="editor" :editor="editor" />
    <CalloutMenu v-if="editor" :editor="editor" />
    <!-- 节点拖拽 -->
    <DragNodeMenu v-if="editor" :editor="editor" />
    <main :class="['editor-content-wrap', scene === 'knowledge' ? 'knowledge-content-wrap' : '']">
      <editor-content :editor="editor" class="h-full"/>
    </main>
    <!-- 搜索替换弹框 -->
    <SearchReplaceModal :editor="editor" v-if="editor" />
    <!-- <ShortcutGuideModal v-if="editor?.isEditable && !isPreview" /> -->
  </div>
</template>

<script setup lang="ts">
import { watch, ref, PropType, provide, computed, VNode } from 'vue'
import MenuBar from './menus'
import { getKnowledgeKit, getDefaultKit } from './extensions/kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import TableMenu from '@/bubbleMenus/tableMenu/index.vue'
import TableBubbleMenu from '@/bubbleMenus/tableMenu/Bubble.vue'
import ShortcutGuideModal from '@/components/shortcutGuideModal/index.vue'
import { TextMenu, ImageMenu, AttachmentMenu, TagMenu, CalloutMenu, DragNodeMenu } from '@/bubbleMenus'

// import Collaboration from '@tiptap/extension-collaboration'
// import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { type CollaborationEditorProps } from './type'
import { EditorPreviewImage } from '@/helpers/previews'
import baseConfig from './config'
import { onKeyStroke } from '@vueuse/core'
import { message } from 'ant-design-vue'
import SearchReplaceModal from '@/components/searchReplaceModal/index.vue'
import { SEARCH_REPLACE_VISIBLE_KEY, UPDATE_SEARCH_REPLACE_VISIBLE_FUNC_KEY } from './keys'
// import initContext from './context'
// import { useUserStore } from '@/store/modules/user/user'
// import { getRandomColor } from '@/helpers/color'
onKeyStroke(e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    message.info(`${baseConfig.TITLE}会实时保存你的数据，无需手动保存。`)
    return false
  }
})
defineOptions({
  name: 'SpeedTiptapEditor',
})

// TODO: theme
const props = withDefaults(defineProps<CollaborationEditorProps>(), {
  scene: "default",
  content: "",
  docType: "document",
  editable: true,
  menubar: true,
  hideComment: true,
  placeholder: "输入 / 唤起更多",
  textBubbleMenu: () => ({
    enabled: true
  })
})
const speedTiptapConfigCpt = computed(() => {
  return props;
})
provide('speedTiptapConfig', speedTiptapConfigCpt); // 向下传递配置
const emit = defineEmits(['update:title', 'update:content', 'update:json'])
const previewInstance = ref<EditorPreviewImage | null>(null);
provide('previewInstance', previewInstance);

const searchReplaceVisible = ref(false);
provide(SEARCH_REPLACE_VISIBLE_KEY, searchReplaceVisible);
provide(UPDATE_SEARCH_REPLACE_VISIBLE_FUNC_KEY, (visible: boolean) => {
  searchReplaceVisible.value = visible;
});
const globalTiptapStorage = ref<Record<string, any>>({}); // 模拟一个编辑器的全局存储，用于某些没有加入扩展的请求（如：drag-handle）
provide('globalTiptapStorage', globalTiptapStorage);
const updateGlobalTiptapStorageFunc = (key: string, value: any) => {
  globalTiptapStorage.value[key] = value;
};
provide('updateGlobalTiptapStorageFunc', updateGlobalTiptapStorageFunc);
watch(
  () => props.hocuspocusProvider,
  val => {
    console.log(val)
  },
)
// 向下传入ai文本扩展（注：这里不需要tite扩展）
provide('aiExtensions', getDefaultKit(props));
const editor = useEditor({
  editable: props.editable,
  autofocus: 'end',
  content: props.json, // 初始化时设置内容
  editorProps: {
    // 追加class，用于设定样式
    attributes: {
      class: props.scene === 'knowledge' ? 'editor-content has-drag-handle' : 'editor-content',
    },
  },
  onUpdate({ editor }) {
    // 编辑器内容变化时，同步到外部
    const html = editor.getHTML()
    const json = editor.getJSON()
    emit('update:json', json)
    emit('update:content', html)

    // 原有的标题更新逻辑
    try {
      const title = editor.state.doc?.content?.firstChild?.content.firstChild?.textContent
      emit(
        'update:title',
        title,
      )
    } catch (e) {
      //
    }
  },

  extensions: [
    ...(props.scene === 'knowledge' ? getKnowledgeKit(props) : getDefaultKit(props)),
    // Collaboration.configure({
    //   document: props?.hocuspocusProvider?.document ?? {},
    // }),
    // CollaborationCursor.configure({
    //   provider: props?.hocuspocusProvider,
    //   user: {
    //     name: useUser?.userInfo?.name ?? '访客',
    //     color: getRandomColor(),
    //   },
    // }),
  ],
  onCreate({ editor }) {
    // 初始化图片预览
    previewInstance.value = new EditorPreviewImage(editor);
  }
})
// 监听 content 变化，同步到编辑器
watch(
  () => props.content,
  (newContent) => {
    if (editor.value && newContent !== editor.value.getHTML()) {
      editor.value.commands.setContent(newContent, false)
    }
  }
)

// json
watch(
  () => props.json,
  (newJson) => {
    if (editor.value && newJson !== editor.value.getJSON()) {
      editor.value.commands.setContent(newJson, false)
    }
  }
)

// 监听 title 变化，同步到编辑器标题
watch(
  () => props.title,
  (newTitle) => {
    if (editor.value && newTitle) {
      const { state } = editor.value
      const { doc } = state
      const firstChild = doc.firstChild

      // 检查当前标题是否已经相同，避免循环
      const currentTitle = firstChild?.type.name === 'title' ? firstChild.textContent : ''
      if (currentTitle === newTitle) {
        return // 如果标题相同，不执行更新
      }

      if (firstChild && firstChild.type.name === 'title') {
        // 使用 insertContentAt 替换标题内容
        editor.value.commands.insertContentAt(
          { from: 0, to: firstChild.nodeSize },
          newTitle
        )
      }
    }
  }
)
console.log(editor.value)

</script>

<style scoped lang="less">
.wrap {
  width: 100%;
  height: 100%;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  &.knowledge {
    &>header {
      justify-content: center;
      border: none;
      border-bottom: 1px solid var(--ant-color-border);
    }

    &>main {

      // 知识库方式
      &.knowledge-content-wrap {
        max-width: 1000px;
        margin: 0 auto;
      }

      border: none;
    }
  }

  >header {
    z-index: 110;
    display: flex;
    padding: 0 10px;
    height: 40px;
    overflow: hidden;
    background-color: var(--ant-color-bg-base);
    align-items: center;
    border: 1px solid var(--ant-color-border);
    user-select: none;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  .editor-content-wrap {
    padding-top: 10px;
  }

  >main {
    flex: 1;
    width: 100%;
    border: 1px solid var(--ant-color-border);
    border-top: none;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    overflow-y: auto;
    padding: 0 10px;
    padding-bottom: 10px;
    box-sizing: border-box;
    position: relative; // 为 BubbleMenu 提供定位上下文

    :deep(.editor-content) {
      min-height: 100%;
      // 带有句柄的需要增加padding
      &.has-drag-handle {
        padding-left: 50px;
        padding-right: 50px;
      }
    }
  }

}
</style>
