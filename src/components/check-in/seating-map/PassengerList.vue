<script setup lang="ts">
import { store } from '@/stores/check-in'
import { state, useSeatingMap } from '@/features/seating-map'

const { selectPassengerDocNumber } = useSeatingMap()
</script>

<template>
    <div class="flex gap-x-4 overflow-x-auto list max-w-full px-4">
        <button
            v-for="passenger in store.selectedPassengers"
            :key="passenger.doc_number"
            class="rounded-md text-[15px] leading-[28px] uppercase px-2 whitespace-nowrap"
            :class="
                state.selectedPassengerDocNumber === passenger.doc_number
                    ? 'bg-blue text-white pointer-events-none'
                    : 'bg-white border border-blue-20 text-blue'
            "
            @click="selectPassengerDocNumber(passenger.doc_number!)"
        >
            {{ passenger.first_name }} {{ passenger.last_name }}
        </button>
    </div>
</template>

<style scoped>
.list {
    scrollbar-width: none;
}
</style>
