<script setup lang="ts">
import { ref } from 'vue'
import type { UserProfileDocument } from '@/entities/user'
import type { FellowTravelerDTO } from '@/entities/fellow-traveler'
import Document from './FellowTravelerDocument.vue'

const props = defineProps<{
    fellowTraveler: FellowTravelerDTO
}>()

const emits = defineEmits(['select'])

const isOpen = ref(false)

const handleDocumentSelect = (document: UserProfileDocument) => {
    emits('select', {
        ...props.fellowTraveler,
        documents: [
            {
                ...document,
                isPrimary: true,
            },
        ],
    })
}

const handleHeaderClick = () => {
    if (props.fellowTraveler.documents.length > 1) {
        isOpen.value = !isOpen.value
    } else {
        handleDocumentSelect(props.fellowTraveler.documents[0])
    }
}
</script>

<template>
    <div class="pl-4">
        <button
            class="flex w-full items-center justify-between pr-4 text-dark min-h-11 border-b border-gray-40"
            @click="handleHeaderClick"
        >
            <span class="grow text-left">
                <div>{{ fellowTraveler.firstName }} {{ fellowTraveler.lastName }}</div>
            </span>
            <AppIcon :name="fellowTraveler.documents.length > 1 ? 'arrow-down' : 'profile-blue'" />
        </button>
        <div v-if="isOpen" class="ml-4">
            <Document
                v-for="document in fellowTraveler.documents"
                :key="document.documentNumber"
                :document="document"
                @select="handleDocumentSelect"
            />
        </div>
    </div>
</template>
