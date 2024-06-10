<script setup lang="ts">
import { ref } from 'vue'
import Select from './Select.vue'
import { state, useBookingPassengersInfo } from '@/features/booking-passengers-info'
import loyaltyPrograms from '@/mocks/loyalty-programs.json'

const { validatedPassenger, validateField } = useBookingPassengersInfo()

const item = ref('')
</script>

<template>
    <div class="card text-dark text-body/15-medium">
        <div class="card-title h-11 rounded-t px-4">Программа лояльности</div>
        <div class="divide-y divide-gray-40 ml-4">
            <Select
                v-model="item"
                :title="item"
                modal-title="Программа лояльности"
                :options="loyaltyPrograms"
            />

            <AppFormField class="">
                <AppInputText
                    v-model="validatedPassenger.loyaltyId"
                    placeholder="цифры и латинские буквы"
                    class="placeholder:text-gray-40"
                    @blur="validateField('loyaltyId', validatedPassenger.loyaltyId)"
                >
                    Номер
                </AppInputText>
                <template #error>{{ state.errors.loyaltyId }}</template>
            </AppFormField>
        </div>
    </div>
</template>
