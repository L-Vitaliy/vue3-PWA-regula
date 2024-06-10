<script setup lang="ts">
import { computed, onMounted } from 'vue'

import Contacts from './Contacts.vue'
import AutoFill from './AutoFill.vue'
import { Passenger, PassengerTypeEnum } from '@/entities/passenger'
import { useBookingPassengersInfo } from '@/features/booking-passengers-info'
import { store } from '@/stores/booking'
import { store as userStore } from '@/stores/user'
import type AppContent from '@/components/layouts/new/AppContent.vue'
import LoginButton from '@/components/shared/LoginButton.vue'

const { init, onPassengerEdit, onNextStep, validateContactForm, isInvalidContacts } =
    useBookingPassengersInfo()

const passengersList = computed(() => {
    return store.passengers.map((p: Passenger) => ({
        isEmpty: !(p.firstName || p.lastName),
        type: `${
            p.type === PassengerTypeEnum.ADULT
                ? 'Взрослый пассажир'
                : p.type === PassengerTypeEnum.CHILD
                  ? 'Ребенок'
                  : 'Младенец'
        } ${p.index}`,
        title: p.suffix
            ? `${p.suffix}, ${p.firstName} ${p.lastName}`
            : `${p.firstName} ${p.lastName}`,
        document: p.documentNumber,
        bonus: p.bonus,
        origin: p,
    }))
})

const handleAutofillPassenger = ({ passenger, index }: { passenger: Passenger; index: number }) => {
    onPassengerEdit({
        index,
        passenger,
        query: {
            autofill: 'true',
        },
    })
}

const onSubmit = () => {
    validateContactForm()

    if (!isInvalidContacts.value) {
        onNextStep()
    }
}

onMounted(() => {
    init()

    if (store.passengers.length === 1) {
        onPassengerEdit({
            index: 0,
            withoutHistory: true,
        })
    }
})
</script>

<template>
    <MainLayout>
        <!-- Header -->
        <AppHeader>
            <template #title>
                <div class="flex justify-between items-center w-full">
                    Пассажиры
                    <!-- <AppIcon name="profile" /> -->
                </div>
            </template>
            <template v-if="!userStore.isAuthenticated" #icon>
                <LoginButton />
            </template>
        </AppHeader>

        <AppContent>
            <div class="pt-2 px-2 pb-12 w-full flex flex-col gap-2 text-dark text-body/15-medium">
                <template v-for="(passengerCard, index) in passengersList" :key="index">
                    <AutoFill
                        v-if="passengerCard.isEmpty"
                        @edit-click="onPassengerEdit({ index })"
                        @complete="(passenger) => handleAutofillPassenger({ passenger, index })"
                    >
                        <template #header>{{ passengerCard.type }}</template>
                    </AutoFill>
                    <div v-else class="card">
                        <div class="card-title h-11 px-4 justify-between rounded-t">
                            {{ passengerCard.type }}
                            <button @click="onPassengerEdit({ index })">
                                <AppIcon name="edit" />
                            </button>
                        </div>
                        <div class="divide-y divide-gray-40">
                            <AppFormField class="ml-4 pr-4">
                                <div class="field-row">
                                    <div class="">{{ passengerCard.title }}</div>
                                </div>
                            </AppFormField>
                            <AppFormField class="ml-4 pr-4">
                                <div class="field-row">
                                    <div class="">Документ</div>
                                    <div>{{ passengerCard.document }}</div>
                                </div>
                            </AppFormField>
                            <AppFormField v-if="passengerCard.bonus.type" class="ml-4 pr-4">
                                <div class="field-row">
                                    <div class="">{{ passengerCard.bonus.type }}</div>
                                    <div>{{ passengerCard.bonus.number }}</div>
                                </div>
                            </AppFormField>
                        </div>
                    </div>
                </template>
                <Contacts />
            </div>
        </AppContent>
        <!-- footer -->
        <AppFooter class="px-4 py-2 pb-5 bottom-0 bg-blue-10 w-full z-30">
            <AppButton
                class="w-full"
                theme="blue"
                size="xl"
                @click="onSubmit">
                Продолжить
            </AppButton>
        </AppFooter>
    </MainLayout>
</template>
