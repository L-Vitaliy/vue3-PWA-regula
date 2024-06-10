<script setup lang="ts">
import { computed, ref } from 'vue'
import config from '@/shared/config'

withDefaults(defineProps<{
  title: String,
  maxDate?: Date | null,
  minYear?: number
}>(), {
  maxDate: null,
  minYear: undefined,
})

const modelValue = defineModel<Date | null>()

const emits = defineEmits(['update:model-value'])

const datepickerShow = ref(false)

const getValueString = computed(() => {
    return modelValue.value
        ?.toLocaleDateString(config.LOCALE, { day: '2-digit', month: 'long', year: 'numeric' })
        ?.replace(/\s*г\./, '')
})

const handleApply = (value: Date) => {
    emits('update:model-value', value)
    datepickerShow.value = false
}
</script>

<template>
    <div class="pr-4 field-row" @click="datepickerShow = true">
        {{ title }}
        <button class="text-primary">
            {{ getValueString || 'Указать' }}
        </button>

        <AppIOSDatePickerModal
            :title="title"
            :initial-date="modelValue"
            :show="datepickerShow"
            :max-date="maxDate"
            :min-year="minYear"
            @close="datepickerShow = false"
            @apply="handleApply"
        />
    </div>
</template>
