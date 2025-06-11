/*
 * @Author: ykx
 * @Date: 2022-05-30 17:13:19
 * @LastEditTime: 2022-11-22 15:55:09
 * @LastEditors: your name
 * @Description:支持iconfont & antd图标组件
 * @FilePath: \we-knowledge-base\src\components\basic\icon-font\index.tsx
 */

import { type PropType, type VNode, isVNode, defineComponent, computed, unref, toRefs } from 'vue'
import { createFromIconfontCN } from '@ant-design/icons-vue'
import { baseConfig } from '@/config/globalSetting'
let scriptUrls:string[] = baseConfig.iconFontScriptUrl; // 调用线上地址

export default defineComponent({
  name: 'SIconFont',
  props: {
    // 支持组件传入
    iconRender: {
      type: Function,
      default: null,
    },
    type: {
      type: String as PropType<string>,
      default: '',
    },
    prefix: {
      type: String,
      default: 'icon-',
    },
    color: {
      type: String as PropType<string>,
      default: 'unset',
    },
    size: {
      type: [String, Number] as PropType<string | number>,
      default: 14,
    },
    scriptUrl: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  setup(props, { attrs }) {
    const wrapStyleObj = computed(() => {
      const { color, size } = props
      const fontSize = typeof size === 'string' ? parseInt(size) : size
      return {
        fontSize: fontSize + 'px',
        color,
      }
    })
    if (props.iconRender) {
      const IconRender = props.iconRender
      return () => {
        return <IconRender name={123}/>;
      }
    }
    // 实例化组件
    let MyIconfontComponent = createFromIconfontCN({
      scriptUrl: scriptUrls,
    })
    if (props.scriptUrl) {
      //整合外界传入的地址
      scriptUrls = [...new Set(scriptUrls.concat(props.scriptUrl))]
      MyIconfontComponent = createFromIconfontCN({
        scriptUrl: scriptUrls,
      })
    }

    return () => {
      const { type, prefix } = props
      return (
        <MyIconfontComponent
          type={type.startsWith(prefix) ? type : prefix + type}
          {...attrs}
          style={unref(wrapStyleObj)}
        />
      )
    }
  },
})
