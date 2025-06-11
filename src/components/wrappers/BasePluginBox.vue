<!--
 * @Author: ykx
 * @Date: 2022-12-08 16:22:20
 * @LastEditTime: 2022-12-28 18:24:57
 * @LastEditors: your name
 * @Description: 基础容器（画图 & 流程图 & 思维导图）
 * @FilePath: \we-knowledge-base\src\tiptap\core\wrappers\BasePluginBox.vue
-->
<template>
  <s-resizeable :isEditable="isEditable" :maxWidth="maxWidth" :width="width" :height="height"
    class="plugin-wrapper render-wrapper" @changeEnd="(values: any) => emit('triggerChangeEnd', values)">
    <span class="plugin-wrapper-title">
      <s-icon-font v-if="typeof iconRender === 'function'" :icon-render="iconRender" />
      <s-icon-font v-else-if="typeof iconRender === 'string'" :size="size" :type="iconRender" />
      {{ title }}
    </span>
    <div class="plugin-body-wrapper">
      <slot />
    </div>
    <ul class="action-wrapper">
      <li v-for="item in actionItems" :class="[
        'shadow-bg-wrapper',
        minZoomed && item.key === 'minus' && 'disabled',
        maxZoomed && item.key === 'plus' && 'disabled',
      ]" :key="item.key" @click="handleExec(item.key)">
        <a-dropdown v-if="item.type === 'rateCom'" trigger="click">
          <div class="shadow-bg-wrapper">{{ zoom }}%</div>
          <template #overlay>
            <a-menu :selectedKeys="[zoom]" @click="handleMenuClick">
              <a-menu-item :key="item.value" v-for="item in rangeZoomData">
                {{ item.label }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <!-- <a-select
          :dropdownMatchSelectWidth="70"
          :options="rangeZoomData"
          class="shadow-bg-wrapper zoom-select"
          v-if="item.type === 'rateCom'"
          v-model:value="zoom"
          :bordered="false"
          :showArrow="false"
          size="small">
        </a-select> -->
        <a-tooltip placement="bottom" v-else>
          <template #title>
            <s-keymap-tip :title="item.tip" :keyMap="pluginType === 'mind' && item.keyMap" />
          </template>
          <s-icon-font v-if="item.iconRender" :icon-render="item.iconRender" />
        </a-tooltip>
      </li>
    </ul>
  </s-resizeable>
</template>

<script setup lang="tsx">
import { AlignCenterOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { ref, PropType, watch, computed, onMounted } from 'vue'
import { ZOOM_DATA } from '@/enums/constants'

const props = defineProps({
  width: {
    type: [String, Number],
    default: '100%',
  },
  height: {
    type: Number,
    default: 240,
  },
  maxWidth: {
    type: Number
  },
  isEditable: {
    type: Boolean,
    default: true,
  },
  className: {
    type: String,
    default: '',
  },
  iconRender: {
    type: [String, Function],
  },
  size: {
    type: Number,
  },
  title: {
    type: String,
    default: '',
  },
  rangeZoomData: {
    type: Array as PropType<{ label: string; value: string }[]>,
    default: () => ZOOM_DATA,
  },
  mind: {
    type: Object,
  },
  pluginType: {
    type: String as PropType<'mind' | 'flow'>,
    default: 'mind'
  },
  // zoom没有做存储
  defaultZoom: {
    type: String,
    default: '100',
  },
})
const emit = defineEmits(['triggerChangeEnd'])
const zoom = ref(props.defaultZoom)
const maxZoom = computed(() => {
  return (
    props.rangeZoomData.length > 0 && props.rangeZoomData[props.rangeZoomData.length - 1]?.value
  )
})
const minZoom = computed(() => {
  return props.rangeZoomData.length > 0 && props.rangeZoomData[0]?.value
})
const tempIndex = props.rangeZoomData.findIndex((item: any) => {
  return item.value === props.defaultZoom
})
const curZoomIndex = ref(tempIndex || 0)
const maxZoomed = computed(() => {
  return maxZoom.value === zoom.value
})
const minZoomed = computed(() => {
  return minZoom.value === zoom.value
})
const actionItems = ref([
  {
    key: 'alignCenter',
    tip: '居中',
    iconRender: () => {
      return <AlignCenterOutlined />
    },
  },
  {
    key: 'minus',
    tip: '缩小',
    keyMap: 'Ctrl -',
    iconRender: () => {
      return <MinusOutlined />
    },
  },
  {
    type: 'rateCom',
    key: 'alignCenter',
  },
  {
    key: 'plus',
    tip: '放大',
    keyMap: 'Ctrl +',
    iconRender: () => {
      return <PlusOutlined />
    },
  },
])
const handleMenuClick = ({ key }: any) => {
  zoom.value = key
}
const handleExec = (key: string) => {
  if (key === 'rateCom' || !props.mind) {
    return
  }
  if (key === 'alignCenter') {
    if (props.pluginType === 'mind') {
      props.mind.execCommand('camera', props.mind.getRoot(), 600)
    } else {
      props.mind.fit();
      props.mind.center();
    }
  }
  if (key === 'plus') {
    if (!maxZoomed.value) {
      curZoomIndex.value++
      zoom.value = props.rangeZoomData.find(
        (_: any, index: number) => index === curZoomIndex.value,
      )?.value!
    }
  }
  if (key === 'minus') {
    if (!minZoomed.value) {
      curZoomIndex.value--
      zoom.value = props.rangeZoomData.find(
        (_: any, index: number) => index === curZoomIndex.value,
      )?.value!
    }
  }
}
// // 发生缩放事件时
props.pluginType === 'mind' && (setTimeout(() => {
  props?.mind &&
    props.mind?.on('zoom', function (e: any) {
      zoom.value = String(e.zoom);
    })
}, 1000))
watch(zoom, (val: string) => {
  const tempIndex = props.rangeZoomData.findIndex((item: any) => {
    return item.value === val
  })
  curZoomIndex.value = tempIndex
  // 区分不同类型
  if (props.pluginType === 'mind') {
    props?.mind?.execCommand('zoom', Number(val))
  } else {
    props?.mind?.zoomTo(Number(val) / 100);
  }
})
</script>

<style scoped lang="less">
.zoom-select {
  :deep(.ant-select-selector) {
    padding: 0 !important;
    position: relative;
    top: 2px;
  }
}

.plugin-wrapper {
  padding: 5px;
}

.plugin-wrapper-title {
  position: absolute;
  top: 0px;
  left: 10px;

  :deep(.anticon) {
    border-radius: 2px;
    margin-right: 5px;
    padding: 2px;
    background-color: var(--ant-color-primary);

    svg {
      color: #fff;
    }
  }
}

.plugin-body-wrapper {
  height: 100%;
}

.action-wrapper {
  position: absolute;
  bottom: 10px;
  z-index: 10;
  right: 10px;

  ul,
  li {
    list-style: none;
    margin: 0;
  }

  justify-content: space-around;
  display: flex;
  padding: 2px 4px;
  background-color: var(--semi-color-bg-2);
  border: 1px solid var(--node-border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}
</style>
