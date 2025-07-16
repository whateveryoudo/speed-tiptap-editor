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
    <menu-bar v-if="menubar && editor" class="header" :editor="editor" />
    <!-- 扩展modal显示-mind -->
    <!-- <extend-mind-modal
      v-if="editor"
      :editor="editor"
      :data="mindState.data"
      :visible="mindState.visible"
      @triggerData="(data: any) => handleUpdateMindState('data', data)"
      @update:visible="(val: boolean) => handleUpdateMindState('visible', val)"></extend-mind-modal> -->
    <TextMenu v-if="editor" :editor="editor" />
    <main>
      <div :class="['content-wrap']" v-if="scene === 'knowledge'">
        <editor-content :editor="editor" />
      </div>
      <editor-content :editor="editor" v-else />
    </main>


    <!-- <ShortcutGuideModal v-if="editor?.isEditable && !isPreview" /> -->
  </div>
</template>

<script setup lang="ts">
import { watch, ref, PropType } from 'vue'
import MenuBar from './menus/menuBar.vue'
import { knowledgeKit, defauktKit } from './extensions/kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import ShortcutGuideModal from '@/components/shortcutGuideModal/index.vue'
import { TextMenu } from '@/bubbleMenus'

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
defineOptions({
  name: 'SpeedTiptapEditor',
})
const props = withDefaults(defineProps<{
  /**
   * 场景:支持富文本和知识库两种场景
   */
  scene?: 'default' | 'knowledge'
  /**
   * 内容
   */
  content?: string
  /**
   * 标题
   */
  title?: string
  /**
   * 文档 id
   */
  docId?: string
  /**
   * 类型
   */
  docType?: "document" | "template"
  /**
   * 是否可编辑
   */
  editable?: boolean
  /**
   * 是否需要菜单
   */
  menubar?: boolean
  /**
   * 是否隐藏评论功能
   */
  hideComment?: boolean
  /**
   * hocuspocusProvider
   */
  hocuspocusProvider?: Record<string, any>
}>(), {
  scene: "default",
  content: "",
  docType: "document",
  editable: true,
  menubar: true,
  hideComment: true,
})


const emit = defineEmits(['update:title', 'update:content'])

watch(
  () => props.hocuspocusProvider,
  val => {
    console.log(val)
  },
)
console.log(props?.hocuspocusProvider)
console.log(props.scene)
const editor = useEditor({
  editable: props.editable,
  autofocus: 'end',
  content: props.content, // 初始化时设置内容
  editorProps: {
    attributes: {
      class: 'is-withauthor is-editable',
    },
  },
  onUpdate({ editor }) {
    // 编辑器内容变化时，同步到外部
    const html = editor.getHTML()
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
    ...(props.scene === 'knowledge' ? knowledgeKit : defauktKit),
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

// 监听 content 变化，同步到编辑器
watch(
  () => props.content,
  (newContent) => {
    if (editor.value && newContent !== editor.value.getHTML()) {
      editor.value.commands.setContent(newContent, false)
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

  &.knowledge {
    &>header {
      justify-content: center;
      border: none;
      border-bottom: 1px solid var(--ant-color-border);
    }


    &>main {
      justify-content: center;
      display: flex;

      .content-wrap {
        max-width: 750px;

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

  >main {
    flex: 1;
    width: 100%;
    border: 1px solid var(--ant-color-border);
    border-top: none;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    overflow-y: auto;
    padding: 0 10px;
    box-sizing: border-box;
    position: relative; // 为 BubbleMenu 提供定位上下文

    .content-wrap {
      width: 100%;
      position: relative; // 确保内容区域也有定位上下文

      &>div {
        position: relative; // 无结构的style??
      }


      &.isFullWidth {
        max-width: 100%;
      }

      .commentWrap {
        padding: 16px 0 64px;
        border-top: 1px solid var(--ant-border-color);
      }
    }
  }

}
</style>
