import { defineComponent, computed } from 'vue'
import { Editor } from '@tiptap/core'
import { Space, Divider } from 'ant-design-vue'
import InsertPopover from './insert/popover.vue'
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
import Align from './align.vue'
import MoreText from './moreText.vue'
import BulletList from './bulletList.vue'
import OrderedList from './orderedList.vue'
import TaskList from './taskList.vue'
import BlockQuote from './blockQuote.vue'
import HorizontalRule from './horizontalRule.vue'
import Emoji from './emoji.vue'
import Indent from './indent.vue'
import FindAndReplace from './findAndReplace.vue'
import Table from './insert/table.vue'
import Image from './insert/image.vue'
import File from './insert/file.vue'
import Import from './import/index.vue'
import Export from './export/index.vue'

// 定义场景配置
const sceneConfigs = {
  default: [
    'undo', 'redo', 'clearNodeAndMarks',
    '|',
    'heading', 'fontSize', 'bold', 'italic', 'underline', 'strike',
    '|',
    'textColor', 'backgroundColor',
    '|',
    'image',
    'file',
    'table',
    '|',
    'align',
    '|',
    'bulletList', 'orderedList', 'taskList',
    '|',
    'indent',
    '|',
    'emoji',
    '|',
    'blockquote', 'horizontalRule',
  ],
  knowledge: [
    'insert',
    '|',
    'undo', 'redo', 'format-painter','clearNodeAndMarks',
    '|',
    'heading', 'fontSize',
    '|',
    'bold', 'italic', 'underline', 'strike', 'moreText',
    '|',
    'textColor', 'backgroundColor',
    '|',
    'link',
    '|',
    'align',
    '|',
    'bulletList', 'orderedList', 'taskList',
    '|',
    'indent',
    '|',
    'emoji',
    '|',
    'blockquote', 'horizontalRule',
    '|',
    'findAndReplace',
    '|',
    'import',
    'export',
  ]
}

// 组件映射
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
    scene: {
      type: String as () => 'default' | 'knowledge',
      default: 'default'
    },
    toolbarKeys: {
      type: Array as () => string[],
      default: undefined
    },
    excludeKeys: {
      type: Array as () => string[],
      default: undefined
    },
    insertMenuConfig: {
      type: Object as () => Record<string, any>,
      default: undefined,
    },
    editor: {
      type: Object as () => Editor,
      required: true
    }
  },
  setup(props) {
    // 获取实际的工具栏按键
    const realToolbarKeys = computed(() => {
      // 检查冲突：同时传入 toolbarKeys 和 excludeKeys
      if (props.toolbarKeys && props.excludeKeys) {
        console.warn('同时传入了 toolbarKeys 和 excludeKeys，将只生效 toolbarKeys')
      }

      // 如果传入了 toolbarKeys，直接使用（覆盖场景配置）
      if (props.toolbarKeys) {
        return props.toolbarKeys
      }

      // 获取场景配置
      const sceneKeys = sceneConfigs[props.scene] || sceneConfigs.default

      // 如果有排除键，从场景配置中排除
      if (props.excludeKeys) {
        return sceneKeys.filter(key => !props.excludeKeys!.includes(key))
      }

      // 默认返回场景配置
      return sceneKeys
    })

    // 处理工具栏键，过滤掉分隔符并记录分隔符位置
    const processedToolbarKeys = computed(() => {
      const keys = realToolbarKeys.value
      const result: Array<{ key: string; showDivider: boolean }> = []

      for (let i = 0; i < keys.length; i++) {
        const currentKey = keys[i]
        const nextKey = keys[i + 1]

        // 如果当前是分隔符，跳过
        if (currentKey === '|') {
          continue
        }

        // 检查是否需要显示分隔符
        const showDivider = nextKey === '|' && i + 1 < keys.length

        result.push({
          key: currentKey,
          showDivider
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
                {Component && (
                  key === 'insert' ? (
                    <Component editor={props.editor} insertMenuConfig={(props as any).insertMenuConfig} />
                  ) : (
                    <Component editor={props.editor} />
                  )
                )}
                {showDivider && (
                  <Divider type="vertical" class="menu-divider" />
                )}
              </>
            )
          })}
        </Space>
      </header>
    )
  }
})
