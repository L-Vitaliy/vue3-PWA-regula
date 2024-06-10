import { reactive } from 'vue'

import { Passenger, PassengerContacts } from '@/entities/passenger'
import { RouteReturning, RouteGeneral, RouteComplex, RouteTypeEnum } from '@/entities/route'
import { BookingSearchSettings } from '@/entities/booking-search-settings'
import { type SearchResultsSelected } from '@/entities/route-itineraries'
import { type BookingTicketLegs } from '@/entities/booking-ticket'
import { type BookingResultsResponseDTO } from '@/entities/booking-result'
import db from '@/shared/db'

export class BookingStore {
    routeType: RouteTypeEnum = db.fetchBookingActiveRouteType()
    generalRoute: RouteGeneral = db.fetchBookingGeneralRoute()
    returningRoute: RouteReturning = db.fetchBookingReturningRoute()
    complexRoutes: RouteComplex = db.fetchBookingComplexRoutes()
    settings: BookingSearchSettings = db.fetchBookingSettings()
    passengers: Passenger[] = db.fetchBookingPassengers()
    passengerContacts: PassengerContacts = PassengerContacts.create()
    ticketLegs: BookingTicketLegs = db.fetchBookingTicketsLegs()
    bookingResults: BookingResultsResponseDTO | null = db.fetchBookingResults()
    searchResultsSelected: SearchResultsSelected[] = db.fetchBookingSearchResultsSelected()
}

export const store = reactive(new BookingStore())
