/*
 * @Author: ykx
 * @Date: 2022-11-10 19:15:40
 * @LastEditTime: 2022-11-25 11:04:52
 * @LastEditors: your name
 * @Description: 对齐设置
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\align.vue
 */

import { type Editor } from '@tiptap/core'
import {
  CaretDownOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  AlignCenterOutlined,
} from '@ant-design/icons-vue'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
import { type VNode, PropType, computed, inject, ref, type Ref, defineComponent } from 'vue'
import { Popover, Tooltip, Button, Space } from 'ant-design-vue'
import { getShortcutTipByKey } from '@/helpers/registKeyMap'
import { KeyMapTip } from 'speed-components-ui/components'
type AlignType = 'left' | 'center' | 'right'


interface AlignButton {
  key: AlignType
  tip: string
  keyMap: string
  iconRender?: (opt?: any) => VNode
  action?: (editor: Editor) => void
}

export default defineComponent({
  name: 'AlignMenu',
  components: {
    Popover,
    Tooltip,
    Button,
    Space
  },
  props: {
    editor: {
      type: Object as PropType<Editor>,
      default: () => ({}),
    },
  },
  setup(props) {
    const open = ref(false)
    const isTitleActive = useActive(props.editor, Title.name)
    const isLeftActive = useActive(props.editor, { textAlign: 'left' })
    const isCenterActive = useActive(props.editor, { textAlign: 'center' })
    const isRightActive = useActive(props.editor, { textAlign: 'right' })
    const editableCpt = inject('editableCpt', ref(true)) as Ref<boolean>

    const disableMenu = computed(() => {
      return isTitleActive.value || !editableCpt.value
    })

    const current = computed(() => {
      if (isLeftActive.value) {
        return 'left'
      } else if (isCenterActive.value) {
        return 'center'
      } else if (isRightActive.value) {
        return 'right'
      } else {
        return 'left'
      }
    })

    // 选中的项
    const selectButton = computed(() => {
      return alignButtons.value.find((item: AlignButton) => item.key === current.value) as AlignButton
    })

    const alignButtons = ref<AlignButton[]>([
      {
        key: 'left',
        tip: '左对齐',

        iconRender: () => <AlignLeftOutlined />,
        keyMap: getShortcutTipByKey('alignLeft'),
        action: () => {
          props?.editor.chain().focus().setTextAlign('left').run();
          open.value = false;
        },
      },

      {
        key: 'center',
        tip: '居中',
        iconRender: () => <AlignCenterOutlined />,
        keyMap: getShortcutTipByKey('alignCenter'),
        action: () => {
          props?.editor.chain().focus().setTextAlign('center').run();
          open.value = false;
        },
      },
      {
        key: 'right',
        tip: '右对齐',
        keyMap: getShortcutTipByKey('alignRight'),
        iconRender: () => <AlignRightOutlined />,
        action: () => {
          props?.editor.chain().focus().setTextAlign('right').run();
          open.value = false;
        },
      },
    ])

    return () => (
      <Popover 
        v-model:open={open.value}
        overlayClassName="align-popover-wrapper" 
        trigger="click" 
        placement="bottom"
        content={!disableMenu.value ? (
          <Space class="align-list-wrapper">
            {alignButtons.value.map(item => (
              <KeyMapTip keyMap={item.keyMap} key={item.key} title={item.tip}>
                <Button 
                  type="text" 
                  class={`shadow-btn-wrapper ${selectButton.value.key === item.key ? 'is-active' : ''}`}
                  onClick={() => item.action?.(props.editor)}
                >
                  {item.iconRender && <s-icon-font iconRender={item.iconRender} />}
                </Button>
              </KeyMapTip>
            ))}
          </Space>
        ) : undefined}
      >
        <Tooltip title={disableMenu.value ? null : '对齐方式'}>
          <Button disabled={disableMenu.value} type="text" class="shadow-btn-wrapper">
            {selectButton.value.iconRender && <s-icon-font iconRender={selectButton.value.iconRender} />}
            <CaretDownOutlined class="dropdown-trigger" />
          </Button>
        </Tooltip>
      </Popover>
    )
  }
})
