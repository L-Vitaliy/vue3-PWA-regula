<script setup lang="ts">
import { computed, ref } from 'vue'
import { store as userStore } from '@/stores/user'
import type { UserProfileDocument } from '@/entities/user'
import Document from './FellowTravelerDocument.vue'
import { useBookingPassengersInfo } from '@/features/booking-passengers-info'
import { PassengerAutofillSourceEnum } from '@/entities/passenger'

const profileDocuments = computed<UserProfileDocument[]>(() => {
    return userStore.userProfile?.contact.documents || []
})

const { autoFillSource } = useBookingPassengersInfo()

const emits = defineEmits(['select'])

const showPopup = ref(false)

const handleDocumentSelect = (document: UserProfileDocument) => {
    emits('select', document)
    showPopup.value = false
}
</script>

<template>
    <div>
        <button
            v-if="autoFillSource !== PassengerAutofillSourceEnum.FELLOW_TRAVELER"
            class="flex gap-1 items-center text-body/15 text-primary"
            @click="showPopup = true"
        >
            Из профиля
            <AppIcon name="arrow-right" />
        </button>

        <ActionModal :show="showPopup">
            <div class="card">
                <div class="card-title h-11 px-4">Выберите документ</div>
                <div class="ml-4">
                    <Document
                        v-for="document in profileDocuments"
                        :key="document.documentNumber"
                        :document="document"
                        @select="handleDocumentSelect"
                    />
                </div>
            </div>
            <template #controls>
                <AppButton class="flex-1" theme="white" size="xl" @click="showPopup = false">
                    Закрыть
                </AppButton>
            </template>
        </ActionModal>
    </div>
</template>
