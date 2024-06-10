<script setup lang="ts">
import { computed } from 'vue'
import { store } from '@/stores/check-in'
import { state } from '@/features/seating-map'
import type { SeatingMap } from '@/entities/seating-map'
import AppIcon from '@/components/ui/AppIcon/AppIcon.vue'

const props = defineProps<{
    seat?: SeatingMap.Seat
    isSide: boolean
}>()

const selectedIndex = computed(() => {
    if (props.seat) {
        const selectedPassengerIndex = store.selectedPassengers.findIndex((passenger) =>
            passenger.seat_numbers?.includes(props.seat!.seat_number),
        )
        return selectedPassengerIndex + 1
    }
    return 0
})

const classList = computed(() => {
    const modifiers = []
    if (props.seat) {
        if (!props.seat.available) {
            modifiers.push(['!bg-[#e6e6e6]', 'pointer-events-none'])
        }

        if (selectedIndex.value) {
            modifiers.push(['!bg-orange', 'pointer-events-none'])
        }

        if (props.seat.space_plus) {
            modifiers.push(['bg-red', 'h-9'])
        }

        if (props.seat.hit) {
            modifiers.push(['bg-[#476dab]'])
        } else {
            switch (props.seat.class_of_service) {
                case 'business':
                    modifiers.push(['bg-[#06294e]'])
                    break
                case 'economy':
                    modifiers.push(['bg-[#97b9e5]'])
                    break
            }

            // case 'FREE':
            //     return ['border', 'border-blue-20']
        }
    }

    return modifiers
})

const select = () => {
    store.setSelectedSeat({
        docNumber: state.selectedPassengerDocNumber,
        seat: props.seat!,
    })
}
</script>

<template>
    <div
        class="relative flex justify-center w-full"
        tabindex="-1"
        :disabled="!seat || selectedIndex"
    >
        <button
            class="rounded-[3px] flex items-center justify-center w-6 h-6"
            :class="classList"
            name="seat-place"
            @click="select"
        >
            <template v-if="seat">
                <div v-if="selectedIndex" class="text-white text-[11px]">
                    {{ selectedIndex }}
                </div>
                <AppIcon
                    v-else-if="!seat.available"
                    class="absolute"
                    name="busy-seat" />
                <template v-else>
                    <AppIcon
                        v-if="isSide && !seat?.window"
                        class="absolute"
                        name="without-window"
                    />
                    <AppIcon
                        v-if="!seat?.recline"
                        class="absolute bottom-0.5 max-w-[20px]"
                        name="without-recline"
                    />
                    <AppIcon
                        v-if="seat?.space_plus"
                        class="absolute top-0.5 max-w-[20px]"
                        name="space+"
                    />
                </template>
            </template>
        </button>
    </div>
</template>
