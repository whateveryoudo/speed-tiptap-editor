import { defineComponent, computed } from 'vue'
import { Editor } from '@tiptap/core'
import { Space, Divider } from 'ant-design-vue'
import InsertPopover from './insert/popover'
import Undo from './undo.vue'
import Redo from './redo.vue'
import FormatPainter from './formatPainter.vue'
import ClearNodeAndMarks from './clearNodeAndMarks.vue'
import Bold from './bold.vue'
import Italic from './italic.vue'
import Underline from './underline.vue'
import Strike from './strike.vue'
import Link from './link/index.vue'
import Heading from './heading.vue'
import FontSize from './fontSize.vue'
import TextColor from './textColor.vue'
import BackgroundColor from './backgroundColor.vue'
import Align from './align'
import MoreText from './moreText.vue'
import BulletList from './bulletList.vue'
import OrderedList from './orderedList.vue'
import TaskList from './taskList.vue'
import BlockQuote from './blockQuote.vue'
import HorizontalRule from './horizontalRule.vue'
import Emoji from './emoji.vue'
import Indent from './indent.vue'
import FindAndReplace from './findAndReplace.vue'
import Table from './insert/table'
import Image from './insert/image.vue'
import File from './insert/file.vue'
import Import from './import/index.vue'
import Export from './export/index.vue'

const componentMap = {
  insert: InsertPopover,
  undo: Undo,
  redo: Redo,
  'format-painter': FormatPainter,
  clearNodeAndMarks: ClearNodeAndMarks,
  heading: Heading,
  fontSize: FontSize,
  bold: Bold,
  italic: Italic,
  underline: Underline,
  strike: Strike,
  moreText: MoreText,
  textColor: TextColor,
  backgroundColor: BackgroundColor,
  link: Link,
  align: Align,
  bulletList: BulletList,
  orderedList: OrderedList,
  taskList: TaskList,
  indent: Indent,
  emoji: Emoji,
  blockquote: BlockQuote,
  horizontalRule: HorizontalRule,
  findAndReplace: FindAndReplace,
  table: Table,
  image: Image,
  file: File,
  import: Import,
  export: Export,
}

export default defineComponent({
  name: 'MenuBar',
  props: {
    toolbarKeys: {
      type: Array as () => import('../type').ToolBarConfig[],
      default: () => [],
    },
    insertMenuConfig: {
      type: Object as () => Record<string, any>,
      default: undefined,
    },
    editor: {
      type: Object as () => Editor,
      required: true,
    },
  },
  setup(props) {
    const processedToolbarKeys = computed(() => {
      const keys = props.toolbarKeys
      const result: Array<{ key: string; showDivider: boolean }> = []

      for (let i = 0; i < keys.length; i++) {
        const currentKey = keys[i]
        const nextKey = keys[i + 1]
        const currentKeyValue = typeof currentKey === 'string' ? currentKey : currentKey.key

        if (currentKeyValue === '|') {
          continue
        }

        const nextKeyValue =
          nextKey === undefined
            ? undefined
            : typeof nextKey === 'string'
              ? nextKey
              : nextKey.key

        const showDivider = nextKeyValue === '|' && i + 1 < keys.length
        const keyValue = typeof currentKey === 'string' ? currentKey : currentKey.key

        result.push({
          key: keyValue,
          showDivider,
        })
      }

      return result
    })

    return () => (
      <header class="menu-header-wrapper">
        <Space size={8}>
          {processedToolbarKeys.value.map(({ key, showDivider }) => {
            const Component = componentMap[key as keyof typeof componentMap]
            return (
              <>
                {Component &&
                  (key === 'insert' ? (
                    <Component
                      editor={props.editor}
                      insertMenuConfig={(props as any).insertMenuConfig}
                    />
                  ) : (
                    <Component editor={props.editor} />
                  ))}
                {showDivider && <Divider type="vertical" class="menu-divider" />}
              </>
            )
          })}
        </Space>
      </header>
    )
  },
})
