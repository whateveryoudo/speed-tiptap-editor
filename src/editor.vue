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
    <div :class="['wrap speed-tiptap-editor', activePreset.name, hideBorder ? 'hide-border' : '']" :style="editorStyle">
      <menu-bar :style="headerStyle" :toolbarKeys="resolvedToolbarKeys" v-if="menubar && editor" class="header"
        :editor="editor" />
      <bubble-menu-bar v-if="editor" :editor="editor" :bubble-menus="resolvedBubbleMenus"
        :text-bubble-menu="textBubbleMenu" />
      <main :style="mainStyle"
        :class="['editor-content-wrap', activePreset.name === 'knowledge' ? 'knowledge-content-wrap' : '']">
        <editor-content :editor="editor"
          :class="['h-full', (editor && editor?.storage?.formatPainter?.isFormatPainterActive) ? 'format-painter-active' : '']" />
        <SuggestionToolTip v-if="editor && activePreset.features.showDocumentSuggest" :element="tooltipElement"
          :editor="editor" />
      </main>
      <SearchReplaceModal v-if="editor && activePreset.features.showSearchReplace" :editor="editor" />
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { watch, ref, inject, type Ref, computed, type VNode, onUnmounted } from 'vue'
import MenuBar from './menus'
import BubbleMenuBar from '@st/bubbleMenus/BubbleMenuBar'
import { tooltipElement } from './extensions/kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { useSpeedEditorProvider } from '@st/hooks/useSpeedEditorContext'
import SuggestionToolTip from './extensions/documentSuggest/SuggestionTooltip.vue'
import { EditorPreviewImage } from '@st/helpers/previews'
import baseConfig from './config'
import { onKeyStroke } from '@vueuse/core'
import { message, theme } from 'ant-design-vue'
import { useAntdCssVars } from 'speed-components-ui/hooks'
import SearchReplaceModal from '@st/components/searchReplaceModal/index.vue'
import { debounce } from 'lodash-es'
import { type GlobalConfig } from './index'
import type { CSSProperties } from 'vue'
import type { Editor, Extensions } from '@tiptap/core'
import { type UserInfo, type IUploadConfig, type ToolBarConfig } from './type'
import {
  resolveEditorPreset,
  resolveToolbarKeys,
  resolveBubbleMenus,
  type EditorPresetName,
  type BubbleMenuKey,
} from '@st/presets'
import {
  buildCollaborationExtensions,
  type CollaborationUser,
} from '@st/hooks/useCollaboration'
import { isChangeOrigin } from '@tiptap/extension-collaboration'
import type { HocuspocusProvider } from '@hocuspocus/provider'
import type * as Y from 'yjs'

const speedUseTiptapConfig = inject<Ref<GlobalConfig>>(
  'speedUseTiptapConfig',
  ref<GlobalConfig>({}),
)

onKeyStroke((e) => {
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 's') {
    e.preventDefault()
    message.info(`${baseConfig.TITLE}会实时保存你的数据，无需手动保存。`)
    return false
  }
})

defineOptions({
  name: 'SpeedTiptapEditor',
})

const props = withDefaults(defineProps<{
  /** 编辑器预设：lite 简易富文本，knowledge 完整知识库富文本 */
  preset?: EditorPresetName
  theme?: 'light' | 'dark'
  antdToken?: any
  editorStyle?: CSSProperties
  headerStyle?: CSSProperties
  mainStyle?: CSSProperties
  hideBorder?: boolean
  content?: string
  /** 协同模式下用于初始化，内容以 Yjs 为准，不走 v-model:content */
  json?: string | null | Record<string, any>
  title?: string
  docId?: string
  docType?: 'document' | 'template'
  editable?: boolean
  /** 外部协同 Y.Doc，配合 useCollaboration 使用 */
  ydoc?: Y.Doc | null
  /** 外部协同 Provider，配合 useCollaboration 使用 */
  provider?: HocuspocusProvider | null
  /** 协同光标用户信息，传入 provider 时建议同时传入 */
  collaborationUser?: CollaborationUser | null
  menubar?: boolean
  hideComment?: boolean
  placeholder?: string
  toolbarKeys?: ToolBarConfig[]
  excludeKeys?: string[]
  bubbleMenus?: BubbleMenuKey[]
  upload?: IUploadConfig
  image?: IUploadConfig
  file?: IUploadConfig
  fontSize?: {
    default?: string
    options?: { value: string; label: string }[]
  }
  textBubbleMenu?: {
    enabled?: boolean
    items?: (
      | { icon: string | VNode; title: string; action?: (editor: Editor) => void }
      | string
    )[]
  }
  ai?: {
    doubao?: {
      url: string
      header?: Record<string, any>
      bodyParams?: (
        action: string,
        content: string,
        customPrompt: string,
      ) => Record<string, any>
    }
  }
  mentionUserFetch?: (query: string) => Promise<UserInfo[]>
  documentSuggestConfig?: { rules?: any[] }
  sdComponentsConfig?: {
    apis?: { [key: string]: any }
    transformRequestRes?: (res: any) => ResponseType
  }
}>(), {
  preset: 'lite',
  content: '',
  docType: 'document',
  editable: true,
  menubar: true,
  antdToken: () => ({}),
  editorStyle: () => ({}),
  headerStyle: () => ({}),
  mainStyle: () => ({}),
  hideComment: true,
  placeholder: '输入 / 唤起更多',
  theme: 'light',
  textBubbleMenu: () => ({ enabled: true }),
  documentSuggestConfig: () => ({ rules: [] }),
})

const emit = defineEmits(['update:title', 'update:content', 'update:collaborators'])

const activePreset = computed(() => resolveEditorPreset(props.preset))

const resolvedToolbarKeys = computed(() =>
  resolveToolbarKeys(activePreset.value, props.toolbarKeys, props.excludeKeys),
)

const resolvedBubbleMenus = computed(() =>
  resolveBubbleMenus(activePreset.value, props.bubbleMenus),
)

const isCollaborationMode = computed(() => !!props.ydoc)

const cptTheme = computed(() => {
  const { antdToken: antdTokenFromConfig, theme: themeFromConfig } = speedUseTiptapConfig.value || {}
  return props.theme === 'dark' || themeFromConfig === 'dark'
    ? {
      algorithm: theme.darkAlgorithm,
      token: { ...(antdTokenFromConfig || props.antdToken) },
    }
    : {
      token: { ...(antdTokenFromConfig || props.antdToken) },
    }
})

const { previewInstance } = useSpeedEditorProvider(props)

const { updateTheme } = useAntdCssVars()

const debouncedEmitTitle = debounce((titleText: string) => {
  if (!titleText || titleText === props.title) {
    return
  }
  emit('update:title', titleText)
}, 500)

const buildExtensions = (): Extensions => {
  const baseExtensions = activePreset.value.getExtensions(props)
  const collabExtensions = buildCollaborationExtensions(
    props.ydoc,
    props.provider,
    props.collaborationUser,
  )
  return [...baseExtensions, ...collabExtensions]
}

const editor = useEditor({
  editable: props.editable,
  autofocus: 'end',
  content: isCollaborationMode.value ? undefined : (props.content || undefined),
  editorProps: {
    attributes: {
      class: activePreset.value.features.hasDragHandle
        ? 'editor-content has-drag-handle'
        : 'editor-content',
    },
  },
  onUpdate({ editor, transaction }) {
    if (!isCollaborationMode.value) {
      // 非协同下，支持双向绑定内容
      emit('update:content', editor.getHTML())
    }


    if (activePreset.value.features.hasTitle) {
      // 仅本机操作才更新标题
      if (isCollaborationMode.value && transaction && isChangeOrigin(transaction)) {
        return
      }
      try {
        const titleNode = editor.state.doc?.content?.firstChild?.content.firstChild
        debouncedEmitTitle(titleNode?.textContent ?? '')
      } catch {
        //
      }
    }
  },
  extensions: buildExtensions(),
  onCreate({ editor }) {
    previewInstance.value = new EditorPreviewImage(editor)
    if (!speedUseTiptapConfig.value) {
      throw new Error(
        '请先调用 app.use(SpeedTiptapEditor) 进行初始化一些配置，否则可能会初始化一些图标显示问题！',
      )
    }
  },
})

defineExpose({ editor })

watch(
  () => props.content,
  (newContent) => {
    if (isCollaborationMode.value || !editor.value) {
      return
    }
    if (newContent !== editor.value.getHTML()) {
      editor.value.commands.setContent(newContent)
    }
  },
)

watch(
  () => props.title,
  (newTitle) => {
    if (!editor.value || !newTitle || !activePreset.value.features.hasTitle) {
      return
    }

    const { doc } = editor.value.state
    const firstChild = doc.firstChild
    const currentTitle = firstChild?.type.name === 'title' ? firstChild.textContent : ''

    if (currentTitle === newTitle) {
      return
    }

    if (firstChild?.type.name === 'title') {
      editor.value.commands.insertContentAt({ from: 0, to: firstChild.nodeSize }, newTitle)
    }
  },
)

watch(
  () => props.editable,
  (newEditable: boolean) => {
    editor.value?.setEditable(newEditable)
  },
)

watch(
  () => props.json,
  (newJson: string | null | undefined | Record<string, any>) => {
    if (isCollaborationMode.value || !editor.value) {
      return
    }
    editor.value.commands.setContent(
      newJson ? (typeof newJson === 'string' ? JSON.parse(newJson) : newJson) : '',
    )
  },
  { immediate: true },
)

watch(
  () => props.antdToken,
  (newAntdToken: Record<string, any>) => {
    updateTheme?.({ token: newAntdToken })
  },
  { immediate: true },
)

watch(
  [() => props.ydoc, () => props.provider, () => props.collaborationUser, activePreset],
  () => {
    if (!editor.value) {
      return
    }
    editor.value.setOptions({
      extensions: buildExtensions(),
    })
  },
)

onUnmounted(() => {
  editor.value?.destroy()
})
</script>

<style scoped lang="less">
.wrap {
  width: 100%;
  height: 100%;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  position: relative;

  &.knowledge {
    &>header {
      justify-content: center;
      border: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    }

    &>main {
      &.knowledge-content-wrap {
        max-width: 1000px;
        margin: 0 auto;
      }

      border: none;
    }
  }

  &.hide-border {
    &>main {
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
    padding: 0 10px;
    padding-bottom: 10px;
    box-sizing: border-box;
    position: relative;

    :deep(.editor-content) {
      min-height: 100%;

      &.has-drag-handle {
        padding-left: 50px;
        padding-right: 50px;
      }
    }
  }
}
</style>
