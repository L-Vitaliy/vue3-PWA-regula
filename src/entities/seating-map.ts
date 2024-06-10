export type SeatType = 'BUSINESS' | 'SPACE+' | 'RECOMMENDED' | 'STANDARD' | 'FREE' | 'BUSY'
export type SeatModifiers = 'WITHOUT_WINDOW' | 'WITHOUT_BACK' | 'SELECTED'
export type ServiceClass = 'business' | 'economy'
// Я не понял почему, но "c", в ответе от бека, русская
export type SeatLocation = 'Maindeсk'

export namespace SeatingMap {
    export interface GroupPrices {
        amount: string
        currency: string
        group_number: number
        hit: boolean
        price_approximate: boolean
        regular_paid: boolean
        space_plus: boolean
        space_plus_restricted: boolean
    }

    export interface PassengerGroupPrices extends GroupPrices {
        passenger_id: number
    }

    export interface Legend {
        exit: boolean
        free_seat: boolean
        hit: boolean
        no_window: boolean
        paid_seat: boolean
        recline: boolean
        space_plus: boolean
        space_plus_recline: boolean
    }

    export interface SeatPrice {
        amount: string
        currency: string
        original_amount: string
        ref_number: string
        seat_key: string
    }

    export interface Seat {
        aisle: boolean
        available: boolean
        center: boolean
        class_of_service: ServiceClass
        description: string
        exists: boolean
        hit: boolean
        prices: SeatPrice[]
        recline: boolean
        seat_number: string
        space_plus: boolean
        window: boolean
    }

    export interface Row {
        exists: boolean
        exit: boolean
        row_number: number
        seats: Seat[]
        wing: boolean
    }

    export interface Location {
        cabin: ServiceClass
        column_names: string[]
        location: SeatLocation
        rows: Row[]
        passenger_group_prices: PassengerGroupPrices[]
    }

    export interface Map {
        aircraft_type: string
        group_prices: GroupPrices[]
        layout_name: string
        legend: Legend
        locations: Location[]
    }
    export interface Response {
        data: Map
        error: object
        success: boolean
    }
}
