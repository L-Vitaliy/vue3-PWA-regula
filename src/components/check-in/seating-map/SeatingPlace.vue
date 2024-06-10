<script setup lang="ts">
import Seat from './Seat.vue'
import type { SeatingMap } from '@/entities/seating-map'

defineProps<{
    rows: SeatingMap.Row[]
    columnNames: SeatingMap.Location['column_names']
}>()
</script>

<template>
    <table>
        <thead>
            <th
                v-for="column in columnNames"
                :key="column"
                class="text-center text-[11px] text-gray-600"
            >
                {{ column }}
            </th>
        </thead>
        <tbody>
            <tr v-for="row in rows" :key="row.row_number">
                <td v-for="(column, columnIndex) in columnNames" :key="column">
                    <Seat
                        v-if="column"
                        :seat="
                            row.seats.find(
                                (item) => item.seat_number === `${row.row_number}${column}`,
                            )
                        "
                        :is-side="columnIndex === 0 || columnIndex === columnNames.length - 1"
                    />
                    <div v-else class="text-center text-[11px] text-gray-600">
                        {{ row.row_number }}
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>
