<script setup lang="ts" generic="T">
import { computed, ref, getCurrentInstance, toRefs } from 'vue'

interface IPropsRadio {
    options?: T[]
    modelValue: string
    itemContainerClasses: string
}

const props = defineProps<IPropsRadio>()

const { modelValue } = toRefs(props)

const emit = defineEmits(['update:modelValue'])

const model = computed({
    get: () => modelValue.value,
    set: (value) => {
        emit('update:modelValue', value)
    },
})

const instance = getCurrentInstance()

const uid = ref(instance?.uid)
</script>
<template>
    <div>
        <label
            v-for="(option, index) in options"
            :key="`key-${option}`"
            :class="itemContainerClasses"
            class="group"
            :for="`${uid}-${index}`"
        >
            <input
                :id="`${uid}-${index}`"
                v-model="model"
                class="sr-only peer"
                type="radio"
                :value="option"
            >
            <slot
                :option="option"
                :index="index"
                :active="option === modelValue" />
        </label>
    </div>
</template>

<!--       Использование в template
<AppRadioTabs :options="destinationSelectList" v-model="destinationSelected"
itemContainerClasses="flex-1 flex items-center"
class="mx-4 flex rounded overflow-hidden border border-blue-70" >
<template #default="{option, index}">
    <div class="flex flex-1 p-2 m-0 bg-white place-content-center peer-checked:bg-blue-70 text-primary peer-checked:text-white"
        :class="{ 'border-r border-blue-70 ': index < destinationSelectList.length - 1 }">
        {{ option }}
    </div>
</template>
</AppRadioTabs> -->
