<script setup lang="ts">
import type { SeatingMap } from '@/entities/seating-map'
import Seat from './Seat.vue'

const legendsList: {
    title: string
    seat: Partial<SeatingMap.Seat>
}[] = [
    {
        title: 'Доступно',
        seat: {
            available: true,
            recline: true,
            class_of_service: 'economy',
        },
    },
    {
        title: 'Недоступно',
        seat: {
            available: false,
        },
    },
    {
        title: 'Рекомендуемое',
        seat: {
            available: true,
            recline: true,
            hit: true,
        },
    },
    {
        title: 'Без регулируемой спинки',
        seat: {
            class_of_service: 'economy',
            available: true,
            recline: false,
        },
    },
    {
        title: 'Бизнес',
        seat: {
            class_of_service: 'business',
            available: true,
            recline: true,
        },
    },
    {
        title: 'Space +',
        seat: {
            space_plus: true,
            available: true,
            recline: true,
        },
    },
]
</script>

<template>
    <div class="flex gap-x-4 overflow-x-auto list max-w-full px-4">
        <div
            v-for="(legend, index) in legendsList"
            :key="index"
            class="flex items-center space-x-2 rounded-md bg-white border border-blue-20 text-blue text-[15px] leading-[28px] p-2 whitespace-nowrap"
        >
            <Seat :seat="legend.seat as SeatingMap.Seat" :is-side="false" />
            <span>
                {{ legend.title }}
            </span>
        </div>
    </div>
</template>

<style scoped>
.list {
    scrollbar-width: none;
}
</style>
