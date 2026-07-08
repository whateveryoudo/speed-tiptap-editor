<script setup lang="ts">
import { watch, ref, inject, type Ref, computed, type VNode, onUnmounted, type Component } from 'vue'
import { MenuBarShell, BubbleMenuBarShell } from '@speed-tiptap-editor/ui'
import {
  mergePluginRegistries,
  resolveToolbarKeys,
  resolveBubbleMenus,
  type EditorLayoutConfig,
  type SpeedEditorPlugin,
  type BubbleMenuKey,
} from '@speed-tiptap-editor/shared'
import { legacyToolbarButtons, legacyBubbleMenus } from './legacyRegistry'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { useSpeedEditorProvider } from '@speed-tiptap-editor/composables'
import { EditorPreviewImage } from './helpers/previews'
import { editorConfig } from '@speed-tiptap-editor/shared'
import { onKeyStroke } from '@vueuse/core'
import { message, theme } from 'ant-design-vue'
import { useAntdCssVars } from 'speed-components-ui/hooks'
import { debounce } from 'lodash-es'
import { type GlobalConfig } from './plugin'
import type { CSSProperties } from 'vue'
import type { Editor, Extensions } from '@tiptap/core'
import type { Transaction } from '@tiptap/pm/state'
import type { UserInfo, IUploadConfig, ToolBarConfig } from '@speed-tiptap-editor/shared'

const defaultLayout: EditorLayoutConfig = {
  name: 'custom',
  getExtensions: () => [],
  toolbar: [],
  bubbleMenus: [],
  features: {
    hasTitle: false,
    hasDragHandle: false,
    contentMode: 'html',
    showDocumentSuggest: false,
    showSearchReplace: false,
  },
}

const speedUseTiptapConfig = inject<Ref<GlobalConfig>>(
  'speedUseTiptapConfig',
  ref<GlobalConfig>({}),
)

onKeyStroke((e) => {
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 's') {
    e.preventDefault()
    message.info(`${editorConfig.TITLE}会实时保存你的数据，无需手动保存。`)
    return false
  }
})

defineOptions({
  name: 'SpeedEditor',
})

const props = withDefaults(defineProps<{
  /** 布局与扩展配置，由各 preset 包（lite/knowledge）传入；base 不内置场景 preset */
  layout?: EditorLayoutConfig
  /** 自定义插件（toolbar / bubble / insert 随插件注册） */
  plugins?: SpeedEditorPlugin[]
  /** 外部注入的 Tiptap 扩展（如协同壳注入 Collaboration 扩展），base 不感知 yjs */
  extraExtensions?: Extensions
  /** 协同模式：内容以 Yjs 为准，不走 v-model:content */
  collaborationMode?: boolean
  /** 协同壳注入：远端变更时跳过标题 emit */
  shouldSkipTitleEmit?: (transaction: Transaction) => boolean
  theme?: 'light' | 'dark'
  antdToken?: any
  editorStyle?: CSSProperties
  headerStyle?: CSSProperties
  mainStyle?: CSSProperties
  hideBorder?: boolean
  content?: string
  json?: string | null | Record<string, any>
  title?: string
  docId?: string
  docType?: 'document' | 'template'
  editable?: boolean
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
  content: '',
  docType: 'document',
  editable: true,
  menubar: true,
  collaborationMode: false,
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

const activeLayout = computed(() => props.layout ?? defaultLayout)

const resolvedToolbarKeys = computed(() =>
  resolveToolbarKeys(activeLayout.value, props.toolbarKeys, props.excludeKeys),
)

const resolvedBubbleMenus = computed(() =>
  resolveBubbleMenus(activeLayout.value, props.bubbleMenus),
)

const pluginRegistry = computed(() => mergePluginRegistries(props.plugins ?? []))

const resolvedToolbarButtons = computed(() => ({
  ...legacyToolbarButtons,
  ...(pluginRegistry.value.toolbar.buttons as Record<string, Component>),
}))

const resolvedInsertItems = computed(() => pluginRegistry.value.toolbar.insertItems)

const resolvedBubbleRegistry = computed(() => {
  const fromPlugins = pluginRegistry.value.bubble.menus
  const merged: Partial<Record<BubbleMenuKey, Component[]>> = {
    ...legacyBubbleMenus,
  }
  for (const [key, comps] of Object.entries(fromPlugins)) {
    const k = key as BubbleMenuKey
    merged[k] = [...(merged[k] ?? []), ...(comps as Component[])]
  }
  return merged
})

const resolvedOverlays = computed(() => pluginRegistry.value.overlays)

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

const resolvePluginExtensions = (): Extensions => {
  const result: Extensions = []
  for (const ext of pluginRegistry.value.extensions) {
    if (typeof ext === 'function') {
      result.push(...(ext(props as Record<string, unknown>) as Extensions))
    } else {
      result.push(...(ext as Extensions))
    }
  }
  return result
}

const buildExtensions = (): Extensions => {
  const shellProps = {
    ...(props as Record<string, unknown>),
    collaborationMode: props.collaborationMode,
  }
  const layoutExtensions = activeLayout.value.getExtensions(shellProps) as Extensions
  return [
    ...layoutExtensions,
    ...resolvePluginExtensions(),
    ...(props.extraExtensions ?? []),
  ]
}

const editor = useEditor({
  editable: props.editable,
  autofocus: 'end',
  content: props.collaborationMode ? undefined : (props.content || undefined),
  editorProps: {
    attributes: {
      class: activeLayout.value.features.hasDragHandle
        ? 'editor-content has-drag-handle'
        : 'editor-content',
    },
  },
  onUpdate({ editor, transaction }) {
    if (!props.collaborationMode) {
      emit('update:content', editor.getHTML())
    }

    if (activeLayout.value.features.hasTitle) {
      if (props.collaborationMode && props.shouldSkipTitleEmit?.(transaction)) {
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
    if (props.collaborationMode || !editor.value) {
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
    if (!editor.value || !newTitle || !activeLayout.value.features.hasTitle) {
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
    if (props.collaborationMode || !editor.value) {
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
console.log('进入了22');
watch(
  [() => props.extraExtensions, () => props.layout, () => props.plugins],
  () => {
    debugger;
    if (!editor.value) {
      return
    }
    editor.value.setOptions({
      extensions: buildExtensions(),
    })
  },
  { deep: true },
)

onUnmounted(() => {
  editor.value?.destroy()
})

</script>

<template>
  <a-config-provider :theme="cptTheme">
    <div :class="['wrap speed-tiptap-editor', activeLayout.name, hideBorder ? 'hide-border' : '']" :style="editorStyle">
      <MenuBarShell :style="headerStyle" :toolbar-keys="resolvedToolbarKeys" v-if="menubar && editor" class="header"
        :editor="editor" :buttons="resolvedToolbarButtons" :insert-items="resolvedInsertItems" />
      <BubbleMenuBarShell v-if="editor" :editor="editor" :bubble-menus="resolvedBubbleMenus"
        :registry="resolvedBubbleRegistry" :text-bubble-menu-enabled="textBubbleMenu?.enabled !== false" />
      <main :style="mainStyle"
        :class="['editor-content-wrap', activeLayout.name === 'knowledge' ? 'knowledge-content-wrap' : '']">
        <editor-content :editor="editor"
          :class="['h-full', (editor && editor?.storage?.formatPainter?.isFormatPainterActive) ? 'format-painter-active' : '']" />
        <template v-for="(Overlay, index) in resolvedOverlays" :key="index">
          <component :is="Overlay" v-if="editor" :editor="editor" />
        </template>
      </main>
    </div>
  </a-config-provider>
</template>

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
