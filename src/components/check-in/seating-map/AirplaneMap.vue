<script setup lang="ts">
import SeatingPlace from './SeatingPlace.vue'
import { onMounted } from 'vue'
import { state, useSeatingMap } from '@/features/seating-map'

const { fetchMap } = useSeatingMap()

onMounted(async () => {
    await fetchMap()
})
</script>

<template>
    <div class="relative border-x-4 border-[#9aaeca] rounded-md mx-4">
        <div class="airplane-plan flex flex-col bg-white gap-y-3 py-2 px-1 text-black">
            <div
                v-for="(location, locationIndex) in state.seatingMap?.locations"
                :key="locationIndex"
            >
                <div class="flex gap-4 justify-between items-center pt-2 pb-4">
                    <div class="text-center flex-1">
                        {{ location.cabin === 'business' ? 'Бизнес' : 'Эконом' }}
                    </div>
                </div>
                <SeatingPlace :rows="location.rows" :column-names="location.column_names" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.airplane-plan > div {
    display: flex;
    flex-direction: column;
    margin: 0 -4px;
    padding: 0 4px;
}
.wing {
    position: relative;
}
.wing::before,
.wing::after {
    content: '';
    position: absolute;
    top: 0;
    height: 100%;
    border-top: 50px solid transparent;
}

.wing::before {
    right: 100%;
    border-right: 40px solid #9aaeca;
}

.wing::after {
    left: 100%;
    border-left: 40px solid #9aaeca;
}
</style>
