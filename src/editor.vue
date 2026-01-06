<!--
 * @Author: ykx
 * @Date: 2022-11-10 18:44:07
 * @LastEditTime: 2023-01-06 15:50:02
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\editor\collaboration\editor.vue
-->
<template>
  <a-config-provider :theme="cptTheme">
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
        <editor-content :editor="editor"
          :class="['h-full', (editor && editor?.storage?.formatPainter?.isFormatPainterActive) ? 'format-painter-active' : '']" />
      </main>
      <!-- 搜索替换弹框 -->
      <SearchReplaceModal :editor="editor" v-if="editor" />
      <!-- <ShortcutGuideModal v-if="editor?.isEditable && !isPreview" /> -->
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { watch, ref, inject, PropType, provide, computed, VNode, onMounted, onUnmounted } from 'vue'
import MenuBar from './menus'
import { getKnowledgeKit, getDefaultKit } from './extensions/kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import TableMenu from '@/bubbleMenus/tableMenu/index.vue'
import TableBubbleMenu from '@/bubbleMenus/tableMenu/Bubble.vue'
import ShortcutGuideModal from '@/components/shortcutGuideModal/index.vue'
import { TextMenu, ImageMenu, AttachmentMenu, TagMenu, CalloutMenu, DragNodeMenu } from '@/bubbleMenus'
import { useSpeedEditorProvider } from '@/hooks/useSpeedEditorContext'
import Collaboration from '@tiptap/extension-collaboration'
// import { TiptapCollabProvider } from '@tiptap-pro/provider'
// 采用自身ws服务
import { HocuspocusProvider } from "@hocuspocus/provider";
import CollaborationCaret from '@tiptap/extension-collaboration-caret'
import { type CollaborationEditorProps } from './type'
import { EditorPreviewImage } from '@/helpers/previews'
import baseConfig from './config'
import { onKeyStroke } from '@vueuse/core'
import { message, theme } from 'ant-design-vue'
import { useAntdCssVars } from 'speed-components-ui/hooks'
import SearchReplaceModal from '@/components/searchReplaceModal/index.vue'
import * as Y from 'yjs'
import { debounce } from 'lodash-es'
import { getRandomColor } from '@/helpers/color'
// 初始化注入的对象
const speedUseTiptapConfig = inject(
  "speedUseTiptapConfig",
  ref(null)
);
onKeyStroke(e => {
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 's') {
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
  antdToken: () => ({}),
  hideComment: true,
  placeholder: "输入 / 唤起更多",
  theme: 'light',
  textBubbleMenu: () => ({
    enabled: true
  })
})
// 组合后的antd主题(这里需要处理)
const cptTheme = computed(() => {
  return props.theme === 'dark' ? {
    algorithm: theme.darkAlgorithm,
    token: { ...props.antdToken }
  } : {
    token: { ...props.antdToken }
  }
})
// 初始化编辑器的一些上下文
const { previewInstance } = useSpeedEditorProvider(props)

let provider = null;
let doc = null;
if (props.collaboration) {
  doc = new Y.Doc() // Initialize Y.Doc for shared editing
}

const emit = defineEmits(['update:title', 'update:content', 'update:collaborators'])

// 使用 Ant Design Vue CSS 变量
const { cleanup, updateTheme } = useAntdCssVars();
onUnmounted(() => {
  cleanup?.();
});
// 防抖处理 title 更新
const debouncedEmitTitle = debounce((titleText: string) => {
  // 对比当前 title 和 props.title，如果相同则不 emit
  if (titleText !== props.title) {
    emit('update:title', titleText)
  }
}, 500) // 500ms 防抖
// 开启了协同编辑
if (props.collaboration && doc) {
  console.log(props.collaboration.token);
  provider = new HocuspocusProvider({
    name: props.collaboration.documentId, // Unique document identifier for syncing. This is your document name.
    // appId: '8mze223m', // Your Cloud Dashboard AppID or `baseURL` for on-premises
    url: props.collaboration.url,
    token: props.collaboration.token,
    document: doc,
    // onSynced: () => {
    //   if (!doc.getMap('config').get('initialContentLoaded') && editor.value) {
    //     doc.getMap('config').set('initialContentLoaded', true)

    //     editor.value.commands.setContent(`
    //     <h1>ykx测试文档1</h1>
    //     <p>This is a radically reduced version of Tiptap. It has support for a document, with paragraphs and text. That’s it. It’s probably too much for real minimalists though.</p>
    //     <p>The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.</p>
    //     `)
    //   }
    // },
  })
  // 监听协同人员变化
  if (provider?.awareness) {
    const awareness = provider.awareness
    const notifyCollaborators = () => {
      // awareness.getStates() 返回 Map<clientId, { user: {...}, ... }>
      const states = Array.from(awareness.getStates().values())
      const users = states
        .map((s: any) => s.user)
        .filter((u) => !!u) // 只保留有 user 信息的
      // 抛给外层
      emit('update:collaborators', users)
    }
    provider.awareness.on('update', notifyCollaborators)
  }
}

const editor = useEditor({
  editable: props.editable,
  autofocus: 'end',
  content: props.content || undefined,
  editorProps: {
    // 追加class，用于设定样式
    attributes: {
      class: props.scene === 'knowledge' ? 'editor-content has-drag-handle' : 'editor-content',
    },
  },
  onUpdate({ editor, transaction }) {
    console.log(transaction.getMeta?.('isRemote'))
    // 编辑器内容变化时，同步到外部
    const html = editor.getHTML()
    console.log(html);
    emit('update:content', html)

    // 原有的标题更新逻辑
    try {
      if (props.scene === 'knowledge') {
        // 判断是否存在标题节点
        const titleNode = editor.state.doc?.content?.firstChild?.content.firstChild
        debouncedEmitTitle(titleNode?.textContent ?? '')
      }
    } catch (e) {
      //
    }
  },
  extensions: props.collaboration ? [
    ...(props.scene === 'knowledge' ? getKnowledgeKit(props) : getDefaultKit(props)),
    Collaboration.configure({
      document: doc,
    }),
    ...(props.collaboration && provider ? [
      CollaborationCaret.configure({
        provider,
        user: {
          id: props.collaboration.user.id,
          avatar: props.collaboration.user.avatar,
          name: props.collaboration.user.nickname || props.collaboration.user.username,
          color: props.collaboration.user.color ?? getRandomColor(),
        },
      }),
    ] : []),
  ] : [
    ...(props.scene === 'knowledge' ? getKnowledgeKit(props) : getDefaultKit(props)),
  ],
  onCreate({ editor }) {
    // 初始化图片预览
    previewInstance.value = new EditorPreviewImage(editor);
    // 查找是否是use使用
    if (!speedUseTiptapConfig.value) {
      throw new Error('请先调用app.use(SpeedTiptapEditor)进行初始化一些配置，否则可能会初始化一些图标显示问题！')
    }

  }
})

// 监听 content 变化，同步到编辑器
watch(
  () => props.content,
  (newContent) => {
    if (editor.value && newContent !== editor.value.getHTML()) {
      editor.value.commands.setContent(newContent)
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

// 监听 editable 变化，动态更新编辑器的可编辑状态
watch(
  () => props.editable,
  (newEditable) => {
    if (editor.value) {
      editor.value.setEditable(newEditable)

    }
  }
)
// 监听外部antdToken变化，重新生成当前editor 的antd变量(用于同步一些主题变量)
watch(
  () => props.antdToken,
  (newAntdToken: Record<string, any>) => {
    updateTheme?.({ token: newAntdToken });
  },
  { immediate: true }
)

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
