/**
 * 类型声明：@kangc/v-md-editor
 * 为没有官方类型定义的 v-md-editor 包添加基本类型声明
 */

declare module '@kangc/v-md-editor/lib/preview' {
  import { DefineComponent } from 'vue'
  const VMdPreview: DefineComponent<any, any, any>
  export default VMdPreview
}

declare module '@kangc/v-md-editor/lib/theme/github.js' {
  const githubTheme: any
  export default githubTheme
}

