<template>
    <a-flex class="w-[350px]" vertical :gap="10">
        <div v-if="session.status !== 'idle' && session.result" class="ai-result-wrapper">
            <VMdPreview :text="session.result" />
        </div>
        <!-- 顶部提示词输入 -->
        <div :class="['ai-input']">
            <img :src="AiPromptIcon" alt="ai-prompt-icon"
                :class="['w-[18px] h-[auto] prompt-icon', isProcessing ? 'loading-rotate' : '']" />
            <div class="input-wrapper">
                <textarea ref="textAreaRef" v-model="inputValue"
                    :placeholder="isProcessing ? pendingText : '向智能助手提问...'" :maxlength="1000" :rows="3"
                    @keydown.enter="inputSendSession" />
            </div>
            <a-button v-if="inputValue && !isProcessing" type="text"
                class="align-self-end text-[var(--ant-color-text-secondary)] px-[6px] py-[5px]"
                @click="handleSendClick">
                <template #icon>
                    <span
                        class="mr-2 border border-solid border-gray-300 w-[18px] h-[18px] leading-[18px] flex rounded-[4px]">
                        <EnterOutlined :style="{ color: 'rgba(0, 0, 0, 0.65)' }" />
                    </span>
                </template>
                发送
            </a-button>
            <a-button v-if="isProcessing" type="text"
                class="align-self-end text-[var(--ant-color-text-secondary)] px-[6px] py-[5px]"
                @click="cancelProcess">
                <template #icon>
                    <span
                        class="mr-2 border border-solid border-gray-300 w-[30px] h-[18px] leading-[18px] flex rounded-[4px]">
                        <span class="text-[var(--ant-color-text-secondary)]">ESC</span>
                    </span>
                </template>
                停止
            </a-button>
        </div>
        <a-menu class="w-[200px] ai-commands-menu" :items="finishedItems" v-if="session.status === 'success'" />
        <!-- 快捷指令菜单 -->
        <a-menu class="w-[200px] ai-commands-menu" :disabled="isProcessing" v-else>
            <template v-for="item in aiCommandsItems" :key="item.key">
                <a-menu-divider v-if="item.type === 'divider'"></a-menu-divider>
                <a-menu-item :key="item.key" v-else :disabled="isProcessing"
                    @click="handleAICommand(item.key as AIAction)">
                    <s-icon-font :size="16" :type="item.icon" class="mr-2" />
                    {{ item.label }}
                </a-menu-item>
            </template>
        </a-menu>
    </a-flex>
</template>

<script setup lang="tsx">
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import type { Editor } from '@tiptap/core'
import { useAiAssistant, type AIAction, type AIProcessOptions } from '@/hooks/useAiAssistant'
import AiPromptIcon from '@/assets/image/ai-prompt-icon.svg'
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import hljs from 'highlight.js';
import { getSelectedText } from '@/prose-utils/text'
import { CheckOutlined, SyncOutlined } from '@ant-design/icons-vue';

// Props 定义
const props = defineProps<{
    editor: Editor
}>()
VMdPreview.use(githubTheme, {
    Hljs: hljs,
});
// 使用 AI 助手 Hook
const {
    processTextStream,
    cancelProcess,
    session,
    resetSession,
    pendingText
} = useAiAssistant()
const isProcessing = computed(() => session.value.status === 'pending')

/**
 * 保存最后一次的 AI 操作参数，用于重新生成
 */
const lastAIOptions = ref<AIProcessOptions | null>(null)

// 状态管理
const inputValue = ref('')

// AI 指令菜单配置
const aiCommandsItems = [
    {
        label: '改进写作',
        key: 'refactor',
        icon: 'icon-kl-refactor'
    },
    {
        label: '检查拼写和语法',
        key: 'check',
        icon: 'icon-kl-check-write'
    },
    {
        label: '简化内容',
        key: 'simple',
        icon: 'icon-kl-simple-text'
    },
    {
        label: '丰富内容',
        key: 'rich',
        icon: 'icon-kl-rich-text'
    },
    { type: 'divider' as const },
    {
        label: '翻译',
        key: 'translate',
        icon: 'icon-kl-zh-en'
    },
    {
        label: '总结',
        key: 'summary',
        icon: 'icon-kl-summary'
    }
]

const finishedItems = [
    {
        label: '替换选中内容',
        key: 'replace',
        icon: () => <CheckOutlined />,
        onClick: () => handleResultAction('replace')
    },
    {
        label: '插入到选区下方',
        key: 'insert-below',
        icon: () => <CheckOutlined />,
        onClick: () => handleResultAction('insert-below')
    },
    { type: 'divider' as const },
    {
        label: '重新生成',
        key: 'regenerate',
        icon: () => <SyncOutlined />,
        onClick: () => handleResultAction('regenerate')
    },
]


/**
 * 处理 AI 指令
 */
const handleAICommand = async (action: AIAction) => {
    const options = { action, content: getSelectedText(props.editor) }
    lastAIOptions.value = options
    await processTextStream(options)
}

/**
 * 处理自定义提示词输入
 */
const inputSendSession = async (event: KeyboardEvent) => {
    // 如果按住 Shift + Enter，允许换行
    if (event.shiftKey) {
        return
    }

    // 阻止默认的换行行为
    event.preventDefault()
    if (!inputValue.value.trim()) {
        message.warning('请输入提示词')
        return
    }
    const options = {
        action: 'custom' as AIAction,
        content: getSelectedText(props.editor),
        customPrompt: inputValue.value
    }
    lastAIOptions.value = options
    const success = await processTextStream(options)

    if (success) {
        inputValue.value = '' // 清空输入框
    }
}

/**
 * 发送按钮点击处理
 */
const handleSendClick = () => {
    // 创建一个模拟的 Enter 事件
    inputSendSession(new KeyboardEvent('keydown', { key: 'Enter' }) as any)
}

/**
 * 替换选中的文本
 */
const replaceSelectedText = (text: string) => {
    const { from, to } = props.editor.state.selection
    props.editor.chain().focus().deleteRange({ from, to }).insertContent(text).run()
}

/**
 * 插入内容到选区下方
 */
const insertBelowSelection = (text: string) => {
    const { to } = props.editor.state.selection
    props.editor.chain().focus().insertContentAt(to, '\n\n' + text).run()
}

/**
 * 处理结果操作（替换、插入、重新生成）
 */
const handleResultAction = async (action: string) => {
    if (action === 'replace') {
        if (!session.value.result) {
            message.warning('没有可应用的结果')
            return
        }
        replaceSelectedText(session.value.result)
        message.success('已替换选中内容')
        resetSession()
    } else if (action === 'insert-below') {
        if (!session.value.result) {
            message.warning('没有可插入的结果')
            return
        }
        insertBelowSelection(session.value.result)
        message.success('已插入到选区下方')
        resetSession()
    } else if (action === 'regenerate') {
        if (!lastAIOptions.value) {
            message.warning('没有可重新生成的操作')
            return
        }
        resetSession()
        await processTextStream(lastAIOptions.value as AIProcessOptions)
    }
}
</script>
<style lang="less">
/* ✅ 平滑的逆时针圆形轨迹动画（小幅度） */
@keyframes orbit {
    0% {
        transform: translate(0, -2px);           /* 正上方 12点 */
    }
    12.5% {
        transform: translate(-1.4px, -1.4px);    /* 左上 10点半 */
    }
    25% {
        transform: translate(-2px, 0);           /* 正左 9点 */
    }
    37.5% {
        transform: translate(-1.4px, 1.4px);     /* 左下 7点半 */
    }
    50% {
        transform: translate(0, 2px);            /* 正下 6点 */
    }
    62.5% {
        transform: translate(1.4px, 1.4px);      /* 右下 4点半 */
    }
    75% {
        transform: translate(2px, 0);            /* 正右 3点 */
    }
    87.5% {
        transform: translate(1.4px, -1.4px);     /* 右上 1点半 */
    }
    100% {
        transform: translate(0, -2px);           /* 回到正上方 12点 */
    }
}
</style>
<style lang="less" scoped>
.ai-input {
    border: 1px solid rgba(126, 134, 142, 0.16);
    background: #fff;
    border-radius: 6px;
    padding: 8px;
    display: flex;
    gap: 5px;
    align-items: flex-start;

    .input-wrapper {
        flex: 1;

        textarea {
            display: flex;
            box-sizing: border-box;
            border-radius: 6px;
            outline: none;
            border: none;
            height: 100%;
            padding: 5px;
            width: 100%;
            resize: none;
            background-color: transparent;
        }
    }



}

.ai-commands-menu,
.ai-actions-menu,
.ai-result-wrapper {
    border: 1px solid rgba(126, 134, 142, 0.16);
    background: #fff;
    border-radius: 6px;
}

.ai-result-wrapper {
    max-height: 300px;
    overflow-y: auto;
    padding: 12px;

}

.prompt-icon {
    &.loading-rotate {
        animation: orbit 1.2s linear infinite;  /* 逆时针绕圈 */
    }
}
</style>