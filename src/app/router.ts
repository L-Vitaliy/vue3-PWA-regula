import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '@/components/test-pages/Main.vue'
import NotFound from '@/components/global-pages/NotFound.vue'
import UIKit from '@/components/test-pages/UIKit.vue'
import IconList from '@/components/test-pages/IconList.vue'
import WebAuthn from '@/components/test-pages/WebAuthn.vue'
import SearchFlight from '@/components/buying-tickets/search-flight/_Page.vue'
import SearchCity from '@/components/buying-tickets/search-city/_Page.vue'
import FillingData from '@/components/buying-tickets/filling-data/_Page.vue'
import EditData from '@/components/buying-tickets/filling-data/EditData.vue'
import SearchFlightResults from '@/components/buying-tickets/search-flight-results/_Page.vue'
import ChooseFlightClass from '@/components/buying-tickets/choose-flight-class/_Page.vue'
import ResultsGraph from '@/components/buying-tickets/search-flight-results-graph/_Page.vue'
import AddFavors from '@/components/buying-tickets/add-favors/_Page.vue'
import CheckFlightInfo from '@/components/buying-tickets/check-flight-info/_Page.vue'
import Baggage from '@/components/buying-tickets/add-favors-baggage/_Page.vue'
import MedInshuranse from '@/components/buying-tickets/add-favors-medInsurance/_Page.vue'
import FlightInshuranse from '@/components/buying-tickets/add-favors-flightInsurance/_Page.vue'
import Sport from '@/components/buying-tickets/add-favors-sport/_Page.vue'
import SportStatus from '@/components/buying-tickets/add-favors-sport-status/_Page.vue'
import Animals from '@/components/buying-tickets/add-favors-animals/_Page.vue'
import TicketSearch from '@/components/check-in/ticket-search/_Page.vue'
import PnrSearchResult from '@/components/check-in/pnr-searсh-results/_Page.vue'
import PassengersList from '@/components/check-in/passengers-list/_Page.vue'
import RegisteredPassengersList from '@/components/check-in/registered-passengers-list/_Page.vue'
import CheckInOtherPnrSearch from '@/components/check-in/other-pnr-passengers/_Page.vue'
import PassengerForm from '@/components/check-in/passenger-form/_Page.vue'
import PassengerDocumentForm from '@/components/check-in/passenger-document-form/_Page.vue'
import PassengerLoyaltyForm from '@/components/check-in/passenger-loyalty-form/_Page.vue'
import SelectingMap from '@/components/check-in/seating-map/_Page.vue'
import Payment from '@/components/buying-tickets/payment/_Page.vue'
import FlightStatus from '@/components/flight-status/_Page.vue'
import FlightStatusResult from '@/components/flight-status/search-result/_Page.vue'
import FlightStatusDetail from '@/components/flight-status/detail/_Page.vue'
import BoardingPasses from '@/components/boarding-passes/_Page.vue'
import Menu from '@/components/menu/_Page.vue'
import ProfilePage from '@/components/personal-account/_Page.vue'
import LoginPage from '@/components/auth/login/_Page.vue'
import TicketsExchangePassengers from '@/components/tickets-exchange/passengers/_Page.vue'
import TicketsExchangeFlights from '@/components/tickets-exchange/flights-list/_Page.vue'
import TicketsExchangeVariants from '@/components/tickets-exchange/variants-list/_Page.vue'
import TicketsExchangeTariffSelection from '@/components/tickets-exchange/tariff-selection/_Page.vue'
import WebView from '@/components/shared/WebView.vue'
import SearchBooking from '@/components/search-booking/_Page.vue'
import SearchBookingDetail from '@/components/search-booking/detail/_Page.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { name: 'login', path: '/login', component: LoginPage },
        { name: 'profile', path: '/profile', component: ProfilePage },
        { name: 'ticket-search', path: '/check-in/ticket-search', component: TicketSearch },
        {
            name: 'web-view',
            path: '/web-view/:link',
            component: WebView,
            props: true,
        },
        {
            name: 'pnr-search-result',
            path: '/check-in/pnr-search-result',
            component: PnrSearchResult,
        },
        {
            name: 'tickets-exchange-passengers',
            path: '/tickets-exchange/:pnrLocator/passengers',
            component: TicketsExchangePassengers,
            props: true,
        },
        {
            name: 'tickets-exchange-flights',
            path: '/tickets-exchange/:pnrLocator/flights',
            component: TicketsExchangeFlights,
            props: true,
        },
        {
            name: 'tickets-exchange-variants',
            path: '/tickets-exchange/:pnrLocator/variants-list',
            component: TicketsExchangeVariants,
            props: true,
        },
        {
            name: 'tickets-exchange-tariff-selection',
            path: '/tickets-exchange/:pnrLocator/tariff-selection',
            component: TicketsExchangeTariffSelection,
            props: true,
        },
        {
            name: 'passengers-list',
            path: '/check-in/passengers-list',
            component: PassengersList,
        },
        {
            name: 'registered-passengers-list',
            path: '/check-in/registered-passengers-list',
            component: RegisteredPassengersList,
        },
        {
            name: 'check-in-other-pnr-search',
            path: '/check-in/other-pnr-search',
            component: CheckInOtherPnrSearch,
        },
        {
            name: 'passenger-form',
            path: '/check-in/passengers-list/:registrationId/passengers/:passengerId?',
            component: PassengerForm,
            props: true,
        },
        {
            name: 'passenger-document-form',
            path: '/check-in/passengers-list/:registrationId/passengers/:passengerId/edit-document',
            component: PassengerDocumentForm,
            props: true,
        },
        {
            name: 'passenger-loyalty-form',
            path: '/check-in/passengers-list/:registrationId/passengers/:passengerId/edit-loyalty',
            component: PassengerLoyaltyForm,
            props: true,
        },
        {
            name: 'passenger-seating-map',
            path: '/check-in/seating-map',
            component: SelectingMap,
            props: true,
        },
        {
            name: 'boarding-passes',
            path: '/boarding-passes',
            component: BoardingPasses,
        },
        { name: 'test-page', path: '/test-page', component: MainPage },
        { name: 'ui', path: '/ui', component: UIKit },
        { name: 'icons', path: '/ui/icons', component: IconList },
        { name: 'auth', path: '/auth', component: WebAuthn },
        { name: 'search-flight', path: '/', component: SearchFlight },
        { name: 'search-city', path: '/search-city', component: SearchCity },
        { name: 'filling-data', path: '/filling-data', component: FillingData },
        { name: 'edit-data', path: '/edit-data/:index', component: EditData },
        {
            name: 'search-flight-results',
            path: '/search-flight-results',
            component: SearchFlightResults,
        },
        {
            name: 'flight-info',
            path: '/flight/info',
            component: FlightStatusDetail,
            props: true,
        },
        {
            name: 'choose-flight-class',
            path: '/choose-flight-class/:class',
            component: ChooseFlightClass,
        },
        { name: 'check-flight-info', path: '/check-flight-info', component: CheckFlightInfo },
        { name: 'search-flight-results-graph', path: '/results-graph', component: ResultsGraph },
        { name: 'add-favors', path: '/add-favors', component: AddFavors },
        { name: 'baggage', path: '/add-favors/baggage', component: Baggage },
        { name: 'med-inshuranse', path: '/add-favors/med-inshuranse', component: MedInshuranse },
        {
            name: 'flight-inshuranse',
            path: '/add-favors/flight-inshuranse',
            component: FlightInshuranse,
        },
        { name: 'sport', path: '/add-favors/sport', component: Sport },
        { name: 'sport-status', path: '/add-favors/sport-status', component: SportStatus },
        { name: 'animals', path: '/add-favors/animals', component: Animals },
        { name: 'payment', path: '/payment', component: Payment },
        { name: 'flight-status', path: '/flight-status', component: FlightStatus },
        {
            name: 'flight-status-results',
            path: '/flight-status/result',
            component: FlightStatusResult,
            props: true,
        },

        { path: '/menu', name: 'menu', component: Menu },
        { path: '/search-booking', name: 'search-booking', component: SearchBooking },
        {
            path: '/search-booking/detail',
            name: 'search-booking-detail',
            component: SearchBookingDetail,
        },
        { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
    ],
})

export default router
