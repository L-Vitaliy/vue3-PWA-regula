<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: '',
    },
    options: {
        type: Array,
        default: () => [],
    },
    selectedTitle: {
        type: String,
        default: '',
    },
    title: {
        type: String,
        required: true,
    },
    modalTitle: {
        type: String,
        default: '',
    },
})

const emits = defineEmits(['update:model-value'])

const actionModal = ref<{
    show: boolean
    value: string | number
}>({
    show: false,
    value: props.modelValue,
})

const handleShow = () => {
    actionModal.value.value = props.modelValue
    actionModal.value.show = true
}

const handleCancel = () => {
    actionModal.value.value = props.modelValue
    actionModal.value.show = false
}

const handleSubmit = () => {
    emits('update:model-value', actionModal.value.value)
    actionModal.value.show = false
}
</script>

<template>
    <div class="pr-4 field-row" @click="handleShow">
        {{ title }}
        <div class="text-primary">
            <div>
                {{ selectedTitle || 'Указать' }}
            </div>
        </div>

        <ActionModal :show="actionModal.show">
            <div class="card">
                <div class="card-title h-11 px-4">{{ modalTitle || title }}</div>
                <AppRadioTabs
                    v-model="actionModal.value"
                    :options="options"
                    item-container-classes="flex-1 field-row gap-4"
                    class="flex flex-col overflow-y-scroll max-h-96"
                >
                    <template #default="{ option, active }">
                        <div
                            class="flex flex-1 px-4 m-0 h-11 items-center gap-2 justify-start text-dark whitespace-nowrap"
                        >
                            <AppRadioButton :model-value="active" />
                            <div>{{ option }}</div>
                        </div>
                    </template>
                </AppRadioTabs>
            </div>
            <template #controls>
                <AppButton
                    class="flex-1"
                    theme="white"
                    size="xl"
                    @click="handleCancel">
                    Закрыть
                </AppButton>
                <AppButton
                    class="flex-1"
                    theme="blue"
                    size="xl"
                    :disabled="!actionModal.value"
                    @click="handleSubmit"
                >
                    Применить
                </AppButton>
            </template>
        </ActionModal>
    </div>
</template>
