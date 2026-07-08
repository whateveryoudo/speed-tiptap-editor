import { defineLibConfig } from '../../tools/tsup.lib'

export default defineLibConfig({
  external: ['vue', 'ant-design-vue', '@speed-tiptap-editor/shared', '@speed-tiptap-editor/composables'],
})
