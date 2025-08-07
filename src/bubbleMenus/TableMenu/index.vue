<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'
import Icon from './Icon.vue'
import Popover from './Popover.vue'
import useBubbleMenu from './useBubbleMenu'
import BubbleContainer from '../BubbleContainer.vue'
const props = defineProps<{
  editor: Editor
}>()

const { tableItems, isSelectedCell, shouldShow } = useBubbleMenu(props)
</script>

<template>
  <BubbleContainer :editor="editor" plugin-key="table-bubble-menu" :should-show="shouldShow">
    <div class="bubble-menu" :class="{ 'table-cell': isSelectedCell }">
      <span class="item" :class="item.class + ' ' + [editor?.isActive(item.name || 'xxx') ? 'active' : '']"
        :key="item.title" v-for="item in tableItems" @click="item.action" :title="item.title">
        <Popover :options="item.options" :editor="editor" :name="item.name" v-if="item.hasArrow && item.name">
          <Icon :type="item.iconType" />
          <Icon class="arrow" type="at-small-down" />
        </Popover>

        <Icon :type="item.iconType" v-else />
      </span>
    </div>
  </BubbleContainer>
</template>

<style lang="less" scoped>
.bubble-menu {
  background-color: #fff;
  box-shadow: 0 7px 21px 0 rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  width: 358px;
  display: flex;
  align-items: center;

  &.table-cell {
    width: 395px;
    padding: 0;
  }

  .item {
    flex-shrink: 0;
    padding: 8px 4px !important;
    overflow: hidden;
    cursor: pointer;
    color: #333;
    display: inline-flex;

    &:hover {
      background-color: #f7f7f7;
      transition: all 0.15s ease-out;
    }

    &.del {
      &:hover {
        color: red !important;
      }
    }

    &.active {
      background-color: #f7f7f7;
      color: #3a38b9;
    }

    &.right-border {
      border-right: 1px solid #f0f0f0;
    }

    &.left-border {
      border-left: 1px solid #f0f0f0;
      padding: 8px;
    }

    &.has-icon {
      // padding: 8px;
      padding: 8px 4px;

      &.narrow-padding {
        padding: 8px 4px;
      }

      .arrow {
        width: 10px;
        overflow: hidden;
      }
    }

    .icon {
      font-size: 20px;
    }
  }
}
</style>
