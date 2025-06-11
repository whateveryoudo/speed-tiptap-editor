/*
 * @Author: ykx
 * @Date: 2022-11-11 09:53:06
 * @LastEditTime: 2022-12-16 17:36:02
 * @LastEditors: your name
 * @Description:
 * @FilePath: \we-knowledge-base\src\components\basic\index.ts
 */
import type { Component, App } from 'vue'
import IconFont from './icon-font'
import { DraggableModal } from './draggable-modal'
import { Resizeable } from './resizeable'
import CenterLoading from './centerLoading/index.vue'
import KeyMapTip from './keyMapTip/index.vue'
import Logo from '../Logo.vue'

const formFieldsComs: Component[] = [IconFont, CenterLoading, DraggableModal, Resizeable, KeyMapTip]

const install = (app: App) => {
  formFieldsComs.forEach(component => {
    app.component(component.name as string, component as any)
  })
  app.component('web-logo', Logo)
}

export default {
  install,
}
