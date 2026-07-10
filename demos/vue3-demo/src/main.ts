import { createApp } from 'vue'
import SpeedTiptapEditor from '@speed-tiptap-editor/base-editor/plugin'
import App from './App.vue'

const app = createApp(App)
app.use(SpeedTiptapEditor)
app.mount('#app')
