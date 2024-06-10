<script setup lang="ts">
import { computed } from 'vue'
import type { UserProfileDocument } from '@/entities/user'
import { docTypes } from '@/entities/passenger'
import { store as appStore } from '@/stores/app'

const props = defineProps<{ document: UserProfileDocument }>()
const emits = defineEmits(['select'])

const parsedDocument = computed(() => {
    return {
        ...props.document,
        documentType:
            docTypes.find((doc) => doc.id === props.document.documentType)?.title ||
            'Неизвестный тип документа',
        issueCountryISO: appStore.countries.find(
            (country) => country.code === props.document.issueCountryISO,
        )?.title,
    }
})
</script>

<template>
    <button
        class="flex w-full flex-1 pr-4 min-h-11 items-center gap-2 justify-between text-dark border-b border-gray-40"
        @click="emits('select', document)"
    >
        <div class="grow text-left">
            <div>{{ parsedDocument.documentType }}</div>
            <div class="text-gray-90 text-body/13">
                {{ parsedDocument.documentNumber }}, {{ parsedDocument.issueCountryISO }}
            </div>
        </div>
        <AppIcon name="passport" />
    </button>
</template>
