<template>
    <template v-if="element && suggestion">
        <teleport :to="element.element">
            <span :key="element.element" ref="reference" />
        </teleport>
        <div v-if="isOpen" class="suggestion-tooltip-parent" ref="floating" :style="floatingStyles">
            <div class="suggestion-tooltip">
                <div class="p-4">
                    <a-alert class="mb-4 py-1!" :message="suggestion.message" :type="suggestion.severity === 'error' ? 'error' : suggestion.severity === 'warning' ? 'warning' : 'info'" />
                    <a-space>
                        <a-button size="small" type="primary" class="text-[12px]!"
                            @click="applySuggestion(suggestion.id)">修复</a-button>
                        <a-button size="small" danger class="text-[12px]!"
                            @click="rejectSuggestion(suggestion.id)">拒绝</a-button>
                    </a-space>
                </div>
                <div class="p-2 px-4 bg-[rgba(61,_37,_20,_0.05)]">
                    <p class="text-xs text-[rgba(28,_25,_23,_0.6)]">{{ element.ruleTitle }}</p>
                </div>
            </div>
        </div>
    </template>
</template>

<script setup lang="ts">
import { offset, shift, useFloating } from '@floating-ui/vue'
import { computed, ref } from 'vue'

const props = defineProps({
    element: {
        type: Object,
        default: null,
    },
    editor: {
        type: Object,
        required: true,
    },
})
const reference = ref(null)
const floating = ref(null)
const suggestion = computed(() => props.element?.suggestion)
const isOpen = computed(() =>
    Boolean(props.element && props.element.suggestion && suggestion?.value?.id)
)
const { floatingStyles } = useFloating(reference, floating, {
    placement: 'bottom',
    middleware: [offset(8), shift({ padding: 8 })],
})

// const { previousWord } = getPreviousWord(props.editor, suggestion.value?.deleteRange.from)
// const { nextWord, punctuationMark } = getNextWord(props.editor, suggestion.value?.deleteRange.to)

const applySuggestion = (suggestionId: string) => {
    props.editor
        .chain()
        .applySuggestion(suggestionId)
        .focus()
        .run()
}

const rejectSuggestion = (suggestionId: string) => {
    props.editor.chain().rejectSuggestion(suggestionId).focus().run()
}


</script>
<style scoped lang="less">
.suggestion-tooltip {
    width: 326px;
    background-color: #fff;
    box-shadow: 0 .54px 1.49px #00000005, 0 1.5px 4.13px #00000008, 0 3.62px 9.95px #0000000a, 0 12px 20px #0000000f;
    border-radius: .5rem;
    overflow: hidden
}
</style>