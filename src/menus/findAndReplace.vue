<!--
 * @Author: ykx
 * @Date: 2022-11-15 16:17:06
 * @LastEditTime: 2022-12-15 15:18:59
 * @LastEditors: your name
 * @Description: 查找和替换
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\bold.vue
-->
<template>
  <a-tooltip title="查找替换">
    <a-button type="text" class="shadow-btn-wrapper"
      :class="[isTitleActive && 'disabled']"
      v-on="buttonEvents"
      :disabled="isTitleActive">
      <FileSearchOutlined />
    </a-button>
  </a-tooltip>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Editor } from '@tiptap/core'
import { FileSearchOutlined } from '@ant-design/icons-vue'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
import { useMenuButtonEvents } from '@/hooks/useMenuButtonEvents'
import { UPDATE_SEARCH_REPLACE_VISIBLE_FUNC_KEY, SEARCH_REPLACE_VISIBLE_KEY } from '@/keys'
import { inject } from 'vue'
const searchReplaceVisible = inject(SEARCH_REPLACE_VISIBLE_KEY, ref(false))
const updateSearchReplaceVisibleFunc = inject(UPDATE_SEARCH_REPLACE_VISIBLE_FUNC_KEY, (visible: boolean) => { })
const props = withDefaults(defineProps<{
  editor: Editor,
  triggerType?: 'menu' | 'bubble'
}>(), {
  editor: () => ({}) as Editor,
  triggerType: 'menu'
})
const isTitleActive = useActive(props.editor, Title.name)
const toggleSearchPanel = () => {
  updateSearchReplaceVisibleFunc(!searchReplaceVisible.value)
}
const buttonEvents = useMenuButtonEvents(toggleSearchPanel, props.triggerType)
</script>

<style scoped lang="less"></style>
