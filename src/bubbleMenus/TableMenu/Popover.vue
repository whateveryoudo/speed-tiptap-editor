<script lang="ts" setup>
import { computed, ref, Teleport } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import Icon from './Icon.vue'
import type { OptionMenuItem } from '@/types/global'

export interface PopPosition {
  top: number
  left: number
}

const props = defineProps<{
  options?: OptionMenuItem[]
  editor: Editor
  name: string
}>()

const targetRef = ref<HTMLSpanElement>()

const show = ref(false)

// const select = ref('')

const position = ref<PopPosition>({
  top: -1000,
  left: -1000,
})

const dynamicStyle = computed(() => {
  return {
    top: position.value.top + 'px',
    left: position.value.left + 'px',
  }
})

const onSelect = (item: OptionMenuItem) => {
  // select.value = itemValue

  item.action?.()

  show.value = false

  props.editor.chain().focus().run()
}

const onFocus = () => {
  if (!targetRef.value) {
    return
  }
  const { top, left, height } = targetRef.value.getBoundingClientRect()

  position.value = {
    top: top + height + 15,
    left: left - 4,
  }

  show.value = true
}
</script>

<template>
  <span @focus="onFocus" ref="targetRef" tabindex="0">
    <slot></slot>
  </span>

  <Teleport to="body">
    <div class="popover-wrapper" @click="show = false" v-if="show">
      <div class="dialog" :style="dynamicStyle">
        <div
          class="item"
          :style="
            name === 'highlight' || (name === 'color' && item.value !== 'rgb(255, 255, 255)')
              ? { color: item.value }
              : {}
          "
          :key="item.value"
          v-for="item in options"
          @click="onSelect(item)">
          <span class="title">
            <Icon class="icon" :type="item.iconType" v-if="item.iconType" />
            <span>
              {{ item.label }}
            </span>
          </span>

          <span class="right">
            <span class="desc" v-if="item.desc">{{ item.desc }}</span>
            <Icon type="at-right-icon" v-show="editor.isActive({ [name]: item.value })" v-else />
          </span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="less" scoped>
.popover-wrapper {
  width: 100vw;
  user-select: none;
  height: 100vh;
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  color: #262626;
  cursor: pointer;
  * {
    box-sizing: border-box;
  }
  .dialog {
    position: relative;
    min-width: 200px;
    display: inline-block;
    background-color: #fff;
    padding: 15px;
    max-height: 50vh;
    box-shadow: 0 7px 21px 0 rgba(0, 0, 0, 0.2);
    overflow: visible;
    border-radius: 3px;
    padding: 4px 0;
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      height: 36px;
      color: #595959;
      cursor: pointer;
      transition: background-color 0.2s ease;
      &:hover {
        background-color: #f7f7f7;
      }
      .title {
        flex-shrink: 0;
        flex: 1;
        min-width: 120px;
        font-size: 14px;
        :deep(.icon) {
          font-size: 20px;
          margin-right: 8px;
        }
      }
      .right {
        font-size: 20px;
        display: inline-flex;
        align-items: center;
        margin-left: 16px;
        color: #8c8c8c;
        .desc {
          font-size: 14px;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue,
            PingFang SC, Noto Sans, Noto Sans CJK SC, Microsoft YaHei, \\5FAE\8F6F\96C5\9ED1,
            sans-serif;
        }
      }
    }
  }
}
</style>
