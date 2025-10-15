<template>
    <s-full-modal  :width="currentView==='select' ? 450 : 500" :footer="false" :visible="visible" @cancel="emit('update:visible', false)" height="auto" title="文件导入">
        <!-- 返回按钮 -->
        <a-flex v-if="currentView === 'progress'">
            <a-space class="cursor-pointer text-[var(--ant-color-text-secondary)]"  @click="currentView = 'select'">
                <ArrowLeftOutlined />
                重新选择
            </a-space>
        </a-flex>

        <!-- 文件选择界面 -->
        <div v-show="currentView === 'select'" class="p-4 flex gap-4 justify-around">
            <div @click="handleImport(item.value)" v-for="item in importItems" :key="item.value"
            class="w-[140px] py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors" 
            >
            <a-flex 
                vertical
                :key="item.value" 
                align="center"
                justify="center"
            >
                <img class="w-[70px] h-[70px]" :src="item.icon" />
                <a-tooltip :title="item.label">
                    <span class="text-sm truncate">{{ item.label }}</span>
                </a-tooltip>
                <span class="text-xs text-gray-500">{{ item.desc }}</span>
            </a-flex>
        </div>

        </div>

        <!-- 进度界面 -->
        <div v-show="currentView === 'progress' && importTasks.length > 0" class="space-y-4">
            <!-- 导入任务列表 -->
            <div v-for="task in importTasks" :key="task.id" class="flex items-center justify-between p-3 border rounded-lg">
                <div class="flex items-center gap-3">
                    <img class="w-8 h-8" :src="task.icon" />
                    <div>
                        <div class="text-sm font-medium">{{ task.fileName }}</div>
                        <div class="text-xs text-gray-500">{{ task.type }}</div>
                    </div>
                </div>
                
                <div class="flex items-center gap-2">
                    <!-- 进度圆圈 -->
                    <a-progress
                        v-if="task.status === 'processing'"
                        type="circle"
                        trail-color="#e6f4ff"
                        :percent="task.progress"
                        :stroke-width="20"
                        :size="20"
                    />
                    
                    <!-- 错误状态 -->
                    <CloseCircleOutlined 
                        v-if="task.status === 'error'" 
                        class="text-red-500 text-xl" 
                    />
                    
                    <!-- 成功状态 -->
                    <CheckCircleOutlined 
                        v-if="task.status === 'success'" 
                        class="text-green-500 text-xl" 
                    />
                </div>
            </div>
        </div>

        <!-- 底部任务提示 -->
        <div v-if="importingLen > 0 && currentView === 'select'" class="mt-4 p-2 bg-blue-50 rounded-lg">
            <a-button type="link" @click="currentView = 'progress'" class="p-0 h-auto">
                当前 {{ importingLen }} 个导入任务
            </a-button>
        </div>
    </s-full-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { type Editor } from '@tiptap/core'
import { ArrowLeftOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
import WordIcon from '@/assets/image/menus/word.svg'
import MarkdownIcon from '@/assets/image/menus/markdown.svg'
import { handleWordFileSelect } from '@/helpers/wordImport'
import { handleMarkdownFileSelect } from '@/helpers/markdownImport'
const props = withDefaults(defineProps<{
    visible: boolean
    editor: Editor
}>(), {
    visible: false
})
const emit = defineEmits(['update:visible'])
// 界面状态
const currentView = ref<'select' | 'progress'>('select')

// 导入任务管理
interface ImportTask {
    id: string
    fileName: string
    type: string
    icon: string
    status: 'processing' | 'success' | 'error'
    progress: number
}

const importTasks = ref<ImportTask[]>([])
/**
 * 计算正在进行的导入任务数量
 * 用于显示底部任务提示
 */
const importingLen = computed(() => {
    return importTasks.value.filter(task => task.status === 'processing').length
})
const importItems = ref([
    {
        label: 'Word',
        value: 'word',
        icon: WordIcon,
        desc: '.docx, .doc'
    },
    {
        label: 'Markdown',
        value: 'markdown',
        icon: MarkdownIcon,
        desc: '.md,.mark,.markdown'
    },
])

/**
 * 处理导入类型选择
 * 根据用户选择的文件类型调用相应的导入处理函数
 * @param value 导入类型值（'word' | 'markdown'）
 */
const handleImport = (value: string) => {
    switch (value) {
        case 'word':
            handleWordImport()
            break
        case 'markdown':
            handleMarkdownImport()
            break
    }
}

/**
 * 创建导入任务对象
 * @param type 文件类型（如 'Word', 'Markdown'）
 * @param fileName 文件名
 * @param icon 图标组件
 * @returns 导入任务对象
 */
const createImportTask = (type: string, fileName: string, icon: string): ImportTask => {
    const taskId = `${type.toLowerCase()}_${Date.now()}`
    return {
        id: taskId,
        fileName,
        type,
        icon,
        status: 'processing',
        progress: 0
    }
}

/**
 * 更新当前正在进行的导入任务
 * @param updates 要更新的任务属性
 */
const updateCurrentTask = (updates: Partial<ImportTask>) => {
    const currentTask = importTasks.value[importTasks.value.length - 1];// 目前仅允许选择1个
    if (currentTask) {
        Object.assign(currentTask, updates)
    }
}

/**
 * 通用的导入处理逻辑
 * 处理文件选择、任务创建、进度更新、状态管理等通用流程
 * @param fileSelectHandler 文件选择处理函数（如 handleWordFileSelect）
 * @param type 文件类型名称
 * @param icon 文件类型图标
 */
const handleImportWithTask = (
    fileSelectHandler: any,
    type: string,
    icon: string
) => {
    if (!props.editor) {
        return
    }

    fileSelectHandler(
        props.editor,
        (file: File) => {
            const newTask = createImportTask(type, file.name, icon)
            importTasks.value.push(newTask)
            currentView.value = 'progress'
        },
        (progress: number) => updateCurrentTask({ progress }),
        (json: any) => updateCurrentTask({ status: 'success', progress: 100 }),
        (error: any) => updateCurrentTask({ status: 'error' })
    )
}

/**
 * 处理 Word 文档导入
 * 创建 Word 导入任务并启动文件选择流程
 */
const handleWordImport = () => {
    handleImportWithTask(handleWordFileSelect, 'Word', WordIcon)
}

/**
 * 处理 Markdown 文档导入
 * 创建 Markdown 导入任务并启动文件选择流程
 */
const handleMarkdownImport = () => {
    handleImportWithTask(handleMarkdownFileSelect, 'Markdown', MarkdownIcon)
}
</script>

<style scoped lang="less">

</style>