import { store } from '@/stores/check-in'
import type { PassengerDTO } from '@/entities/checkin-search-pnrs-request'
import type { SeatingMap } from '@/entities/seating-map'
import { reactive } from 'vue'
import { useCheckIn } from './pnr-check-in'

export const state = reactive<{
    seatingMap: SeatingMap.Map | null
    selectedPassengerDocNumber: PassengerDTO['doc_number']
}>({
    seatingMap: null,
    selectedPassengerDocNumber: store.selectedPassengers[0]?.doc_number || '',
})

export function useSeatingMap() {
    const { fetchSeatingMap } = useCheckIn()

    const fetchMap = async () => {
        const { data, error } = await fetchSeatingMap()

        if (!error && data) {
            state.seatingMap = data
        }
    }

    const selectPassengerDocNumber = (passengerDocNumber: PassengerDTO['doc_number']) => {
        state.selectedPassengerDocNumber = passengerDocNumber
    }

    return {
        fetchMap,
        selectPassengerDocNumber,
    }
}
