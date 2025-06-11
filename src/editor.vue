<!--
 * @Author: ykx
 * @Date: 2022-11-10 18:44:07
 * @LastEditTime: 2023-01-06 15:50:02
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\editor\collaboration\editor.vue
-->
<template>
  <div class="wrap">
    <!-- 工具栏 -->
    <menu-bar v-if="menubar && editor && !isPreview" class="header" :editor="editor" />
    <!-- 扩展modal显示-mind -->
    <!-- <extend-mind-modal
      v-if="editor"
      :editor="editor"
      :data="mindState.data"
      :visible="mindState.visible"
      @triggerData="(data: any) => handleUpdateMindState('data', data)"
      @update:visible="(val: boolean) => handleUpdateMindState('visible', val)"></extend-mind-modal> -->
    <main>
      <div :class="['content-wrap', 'is-standard-width']">
        <editor-content :editor="editor" class="pb-20" />
      </div>
    </main>

    <!-- <ShortcutGuideModal v-if="editor?.isEditable && !isPreview" /> -->
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import MenuBar from './menus/menuBar.vue'
import { CollaborationKit } from './extensions/kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import ShortcutGuideModal from '@/components/shortcutGuideModal/index.vue'

// import Collaboration from '@tiptap/extension-collaboration'
// import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { collaborationEditorProps } from './type'
import baseConfig from './config'
import { onKeyStroke } from '@vueuse/core'
import { message } from 'ant-design-vue'
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
const props = defineProps(collaborationEditorProps)
const emit = defineEmits(['onTitleUpdate'])

watch(
  () => props.hocuspocusProvider,
  val => {
    console.log(val)
  },
)
console.log(props?.hocuspocusProvider)
const editor = useEditor({
  editable: props.editable,
  autofocus: 'end',
  editorProps: {
    attributes: {
      class: 'is-withauthor is-editable',
    },
  },
  onUpdate({ transaction }) {
    try {
      const title = transaction?.doc?.content?.firstChild?.content.firstChild?.textContent
      emit(
        'onTitleUpdate',
        title ||
          (props.docType === 'document' ? baseConfig.EMPTY_DOC_TITLE : baseConfig.EMPTY_TPL_TITLE),
      )
    } catch (e) {
      //
    }
  },
  extensions: [
    StarterKit.configure({ document: false, paragraph: false, codeBlock: false }),
    ...CollaborationKit,
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
})
console.log(editor.value)
</script>

<style scoped lang="less">
.wrap {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 240px;
  overflow: hidden;
  flex-direction: column;

  > header {
    z-index: 110;
    display: flex;
    justify-content: center;
    padding: 0 24px;
    overflow: hidden;
    background-color: var(--ant-color-nav-bg);
    align-items: center;
    border-bottom: 1px solid var(--ant-border-color);
    user-select: none;
  }

  > main {
    position: relative;
    display: flex;
    overflow: auto;
    /* stylelint-disable-next-line */
    overflow: overlay;
    flex: 1;
    justify-content: center;
    flex-wrap: nowrap;
    scroll-behavior: smooth;

    .content-wrap {
      width: 100%;

      & > div {
        position: relative; // 无结构的style??
      }

      &.is-standard-width {
        max-width: 750px;
      }

      &.isFullWidth {
        max-width: 100%;
      }

      .commentWrap {
        padding: 16px 0 64px;
        border-top: 1px solid var(--ant-border-color);
      }
    }

    .tocsWrap {
      position: relative;
    }
  }
}
</style>
