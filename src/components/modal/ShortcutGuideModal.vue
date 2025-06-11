<script lang="ts" setup>
import { ref } from 'vue'
import shortcut from '@/assets/image/shortcut.gif'
import keyboard from '@/assets/image/keyboard.svg'

const visible = ref(false)
const shortcutDataSource = [
  {
    label: '段落前输入',
    list: [
      { title: '大标题', shortcut: '# space' },
      { title: '中标题', shortcut: '## space' },
      { title: '小标题', shortcut: '### space' },
      { title: '引用', shortcut: '> space' },
      { title: '无序列表', shortcut: '* space' },
      { title: '有序列表', shortcut: '1. space' },
      { title: '检查列表', shortcut: '[] space' },
      { title: '代码块', shortcut: '``` enter' },
      { title: '分隔线', shortcut: '--- enter' },
    ],
  },
  {
    label: '行内输入',
    list: [
      { title: '加粗', shortcut: '**文本** space' },
      { title: '斜体', shortcut: '*文本* space' },
      { title: '删除线', shortcut: '~文本~ space' },
      { title: '行内代码', shortcut: '`代码` space' },
      { title: '公式', shortcut: '$$公式$$ enter' },
    ],
  },
]
</script>

<template>
  <div
    class="fixed bottom-10 right-10 border border-solid border-gray-300 rounded-md cursor-pointer h-10 p-2 flex items-center"
    @click="visible = true">
    <span class="mr-2"> Markdown 语法提示 </span>
    <span class="inline-flex w-7">
      <img :src="keyboard" alt="键盘" class="w-full" />
    </span>
  </div>

  <a-modal
    :visible="visible"
    :footer="null"
    title="快捷键"
    width="600px"
    keyboard
    closable
    maskClosable
    @cancel="visible = false">
    <div style="height: 50vh" class="overflow-y-auto pr-2">
      <img :src="shortcut" alt="快捷键动态图" class="w-full" />
      <h3 class="mt-5">尽情体验使用 Markdown 进行创作的快速与便捷。</h3>

      <div :key="index" v-for="(item, index) in shortcutDataSource">
        <p class="font-bold mb-3"># {{ item.label }}</p>
        <ul>
          <li :key="index" v-for="(node, index) in item.list" class="flex h-8 items-center mb-3">
            <span>
              {{ node.title }}
            </span>

            <span class="flex-1 inline-flex justify-end">
              <span
                :key="index"
                v-for="(short, index) in node.shortcut.split(' ')"
                class="text-white bg-gray-800 px-3 py-1 rounded-sm ml-2 text-sm">
                {{ short }}
              </span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </a-modal>
</template>
