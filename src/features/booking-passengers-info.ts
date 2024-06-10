import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import isEqual from 'lodash/isEqual'
import pick from 'lodash/pick'
import OptionsWrapper from '@/services/options'
import { store as appStore } from '@/stores/app'
import { store as userStore } from '@/stores/user'
import api from '@/api'
import { store } from '@/stores/booking'
import {
    validateDocumentExpiryDate,
    validateEmail,
    validateName,
    validatePassengerBirthDate,
} from '@/services/validation-rules'
import {
    docTypes,
    expirationTypes,
    ExpirationTypes,
    genders,
    Passenger,
    PassengerAutofillSourceEnum,
    PassengerContacts,
    PassengerTypeEnum,
} from '@/entities/passenger'
import db from '@/shared/db'
import type { FellowTravelerDTO } from '@/entities/fellow-traveler'
import type { DocumentType, UserProfileDocument } from '@/entities/user'
import dayjs from 'dayjs'
import { useUser } from '@/features/user'
import { useLoader } from '@/features/loader'

export const state = reactive({
    activePassenger: db.fetchActivePassenger(),
    errors: {} as Record<keyof Passenger, string>,
    contactsErrors: {} as Record<keyof PassengerContacts, string>,
})

export function useBookingPassengersInfo() {
    const route = useRoute()
    const router = useRouter()
    const { updateUserFellowTraveler } = useUser()
    const { withLoader } = useLoader()

    const gendersOptions = new OptionsWrapper(genders)
    const docTypesOptions = new OptionsWrapper(docTypes)
    const citizenshipesOptions = new OptionsWrapper(appStore.citizenshipes, 'code')
    const countriesOptions = new OptionsWrapper(appStore.countries, 'code')
    const phoneCodesOptions = new OptionsWrapper(appStore.countries, 'phoneCode')
    const expirationTypesOptions = new OptionsWrapper(expirationTypes)

    const autoFillSource = ref<PassengerAutofillSourceEnum | null>(null)
    const initialAutoFilledPassengerData = ref<Passenger | null>(null)

    const isModalUpdateTravelerDocumentsShown = ref(false)
    const isModalUpdateTravelerOnlyDataShown = ref(false)

    const activePassengerIndex = computed(() => Number(route.params.index) || 0)

    const init = () => {
        if (store.passengers.length === 0) {
            for (let i = 0; i < store.settings.adults; i++) {
                store.passengers.push(Passenger.create(PassengerTypeEnum.ADULT, i + 1))
            }
            for (let i = 0; i < store.settings.children; i++) {
                store.passengers.push(Passenger.create(PassengerTypeEnum.CHILD, i + 1))
            }
            for (let i = 0; i < store.settings.babies; i++) {
                store.passengers.push(Passenger.create(PassengerTypeEnum.INFANT, i + 1))
            }
        }
    }

    const clearActivePassenger = () => {
        Object.assign(
            validatedPassenger.value,
            Passenger.create(validatedPassenger.value.type, validatedPassenger.value.index),
        )
    }

    const onPassengerEdit = ({
        index,
        passenger,
        withoutHistory,
        query,
        needValidate,
    }: {
        index: number
        passenger?: Passenger
        withoutHistory?: boolean
        query?: Record<string, string>
        needValidate?: boolean
    }) => {
        Object.assign(state.activePassenger, {
            ...store.passengers[index],
            ...passenger,
        })
        db.saveBookingPassenger(state.activePassenger)

        if (withoutHistory) {
            router.replace({ name: 'edit-data', params: { index }, query })
        } else {
            router.push({ name: 'edit-data', params: { index }, query })
        }

        if (needValidate) {
            nextTick(() => {
                validateForm()
            })
        }
    }

    const validateContactForm = () => {
        validateContactFormProp('phone', store.passengerContacts.phone)
        validateContactFormProp('email', store.passengerContacts.email)
    }

    const validateContactFormProp = (prop: keyof PassengerContacts, val: any) => {
        switch (prop) {
            case 'phone': {
                state.contactsErrors.phone = ''
                if (!val) {
                    state.contactsErrors.phone = 'Нужно указать телефон'
                }
                if (val.length < 6) {
                    state.contactsErrors.phone = 'Не менее 6 символов'
                } else if (val.length > 12) {
                    state.contactsErrors.phone = 'Не более 12 символов'
                } else if (!/^([0-9])*$/.test(val)) {
                    state.contactsErrors.phone = 'Некорректный номер телефона'
                }
                return
            }
            case 'email': {
                state.contactsErrors.email = ''
                if (!val) {
                    state.contactsErrors.email = 'Нужно указать адрес электронной почты'
                }
                if (!validateEmail(val)) {
                    state.contactsErrors.email = 'Некорректный адрес электронной почты'
                }
                if (val.length > 60) {
                    state.contactsErrors.email = 'Не более 60 символов'
                }
                return
            }
        }
    }

    const validatedContacts = computed(() => {
        const contactsProxy = new Proxy<PassengerContacts>(store.passengerContacts, {
            set: (obj: any, prop: keyof PassengerContacts, val) => {
                obj[prop] = val
                validateContactFormProp(prop, val)

                return true
            },
        })

        return contactsProxy
    })

    const validatedPassenger = computed(() => {
        const passengerProxy = new Proxy<Passenger>(state.activePassenger, {
            set: (obj: any, prop: keyof Passenger, val) => {
                state.errors[prop] = ''
                obj[prop] = val
                validateField(prop, val)

                return true
            },
        })

        return passengerProxy
    })

    const isPassengersHasSameNames = computed(() => {
        return !!store.passengers.find((passenger, passengerIndex) => {
            return (
                activePassengerIndex.value !== passengerIndex &&
                validatedPassenger.value.firstName &&
                validatedPassenger.value.lastName &&
                passenger.firstName === validatedPassenger.value.firstName.trim().toUpperCase() &&
                passenger.lastName === validatedPassenger.value.lastName.trim().toUpperCase() &&
                passenger.middleName === validatedPassenger.value.middleName.trim().toUpperCase()
            )
        })
    })

    watch(
        () => isPassengersHasSameNames.value,
        () => {
            if (!isPassengersHasSameNames.value) {
                validatedPassenger.value.suffix = ''
                state.errors.suffix = ''
            }
        },
    )

    const requiredProps = computed(() => {
        const startErrorText = 'Нужно указать'
        const requiredProps: Array<{ key: keyof Passenger; error: string }> = [
            {
                key: 'firstName',
                error: `${startErrorText} имя`,
            },
            {
                key: 'lastName',
                error: `${startErrorText} фамилию`,
            },
            {
                key: 'documentType',
                error: `${startErrorText} тип документа`,
            },
            {
                key: 'birthDate',
                error: `${startErrorText} дату рождения`,
            },
            {
                key: 'citizenshipCountryISO',
                error: `${startErrorText} гражданство`,
            },
            {
                key: 'issueCountryISO',
                error: `${startErrorText} страну выдачи`,
            },
            {
                key: 'documentNumber',
                error: `${startErrorText} серию и номер`,
            },
        ]

        if (!validatedPassenger.value.withoutMiddleName) {
            requiredProps.push({
                key: 'middleName',
                error: `${startErrorText} отчество`,
            })
        }

        if (validatedPassenger.value.expirationType === ExpirationTypes.EXPIRATION) {
            requiredProps.push({
                key: 'expiryDate',
                error: `${startErrorText} срок действия документа`,
            })
        }

        if (isPassengersHasSameNames.value) {
            requiredProps.push({
                key: 'suffix',
                error: `${startErrorText} суффикс`,
            })
        }

        return requiredProps
    })

    const isInvalid = computed((): boolean => {
        return !!Object.keys(state.errors).find(
            (key) => state.errors[key as keyof Passenger] !== '',
        )
    })

    const isInvalidContacts = computed(
        () => !!state.contactsErrors.phone || !!state.contactsErrors.email,
    )

    const validateField = (prop: keyof Passenger, val: any) => {
        const requiredField = requiredProps.value.find((item) => item.key === prop)

        if (!val && requiredField) {
            state.errors[prop] = requiredField.error
            return false
        }

        if (['firstName', 'lastName', 'middleName'].includes(prop)) {
            if (
                validatedPassenger.value.firstName.length +
                    validatedPassenger.value.lastName.length +
                    validatedPassenger.value.middleName.length >
                55
            ) {
                state.errors[prop] = 'ФИО не должно превышать 55 символов'
            }

            state.errors[prop] = validateName(val as string, prop === 'firstName' ? 25 : 30)
        }

        if (prop === 'withoutMiddleName' && val) {
            validatedPassenger.value.middleName = ''
            state.errors.middleName = ''
        }

        if (prop === 'loyaltyId') {
            if (val && val.length > 10) {
                state.errors[prop] = 'Номер не должен превышать 10 символов'
            }
            if (val && !/^([a-z]|[A-Z]|[0-9])*$/.test(val)) {
                state.errors[prop] = 'Только латинские буквы и цифры'
            }
        }

        if (prop === 'birthDate') {
            state.errors.birthDate = validatePassengerBirthDate(val, validatedPassenger.value.type)
        }

        if (prop === 'documentNumber') {
            if (!/^([a-z]|[A-Z]|[0-9])*$/.test(val)) {
                state.errors.documentNumber = 'Только латинские буквы и цифры'
            }

            if (val && val.length > 14) {
                state.errors[prop] = 'Не более 14 символов'
            }

            if (val && val.length < 6) {
                state.errors[prop] = 'Не менее 6 символов'
            }

            if (val) {
                store.passengers.forEach((passenger, passengerIndex) => {
                    if (
                        passengerIndex !== activePassengerIndex.value &&
                        passenger.documentNumber === val
                    ) {
                        state.errors.documentNumber =
                            'Номер документа должен быть уникален для каждого пассажира'
                    }
                })
            }
        }

        if (prop === 'expiryDate') {
            state.errors.expiryDate = validateDocumentExpiryDate(
                val,
                validatedPassenger.value.expirationType,
            )
        }

        if (prop === 'expirationType') {
            state.errors.expiryDate = ''
            if (val === ExpirationTypes.INDEFINITELY) {
                validatedPassenger.value.expiryDate = null
            }
        }
    }

    const validateForm = () => {
        Object.keys(validatedPassenger.value).forEach((key) => {
            validateField(key as keyof Passenger, validatedPassenger.value[key as keyof Passenger])
        })
    }

    const currentActivePassenger = computed(() => ({
        ...state.activePassenger,
        firstName: state.activePassenger.firstName.trim().toUpperCase(),
        lastName: state.activePassenger.lastName.trim().toUpperCase(),
        middleName: state.activePassenger.middleName.trim().toUpperCase(),
    }))

    const handleSubmit = () => {
        validateForm()
        validateContactForm()

        setTimeout(async () => {
            if (!isInvalid.value && !isInvalidContacts.value) {
                const isCurrentPassengerBeenAddedFromFellowTraveler =
                    autoFillSource.value === PassengerAutofillSourceEnum.FELLOW_TRAVELER
                const isCurrentPassengerBeenAddedFromUserProfile =
                    autoFillSource.value === PassengerAutofillSourceEnum.USER_PROFILE

                const initialPassenger = initialAutoFilledPassengerData.value
                const currentPassenger = currentActivePassenger.value

                /**
                 * Сохранение заполненного пассажира в локальной бд
                 */
                saveUpdatedPassengerData(currentPassenger)

                /**
                 * Проверка необходимости обновления попутчика в лк
                 */
                if (isCurrentPassengerBeenAddedFromFellowTraveler) {
                    const documentsFieldsKeys = ['documentType']

                    const isPassengerDocumentsBeenEdited = !isEqual(
                        pick(currentPassenger, documentsFieldsKeys),
                        pick(initialPassenger, documentsFieldsKeys),
                    )

                    const isPassengerOnlyDataBeenEdited =
                        !isPassengerDocumentsBeenEdited &&
                        !isEqual(initialPassenger, currentPassenger)

                    if (isPassengerDocumentsBeenEdited) {
                        isModalUpdateTravelerDocumentsShown.value = true
                        return /* prevent redirect */
                    } else if (isPassengerOnlyDataBeenEdited) {
                        isModalUpdateTravelerOnlyDataShown.value = true
                        return /* prevent redirect */
                    }
                }

                /**
                 * Проверка корректности введенного номера программы лояльности
                 */
                if (
                    !isCurrentPassengerBeenAddedFromUserProfile &&
                    currentPassenger.loyaltyId?.length
                ) {
                    await checkIsPassengerHasCorrectLoyaltyId(currentPassenger)
                    if (state.errors.loyaltyId) {
                        return /* prevent redirect */
                    }
                }

                /**
                 * При всех успешных проверках - редирект на страницу подтверждения введенных данных в билете
                 */
                redirectToTicketConfirmationPage()
            }
        })
    }

    const saveUpdatedPassengerData = (newPassenger: Passenger) => {
        store.passengers[activePassengerIndex.value] = newPassenger
        db.saveBookingPassengers(store.passengers)
    }

    const onNextStep = () => {
        const invalidPassengerIndex = store.passengers.findIndex((passenger) => {
            return Object.entries(passenger).find((val) => {
                return (
                    [
                        'firstName',
                        'lastName',
                        'documentType',
                        'birthDate',
                        'citizenshipCountryISO',
                        'issueCountryISO',
                        'documentNumber',
                    ].includes(val[0]) &&
                    (val[1] === null || val[1] === '')
                )
            })
        })

        if (invalidPassengerIndex === -1) {
            router.push({ name: 'check-flight-info' })
        } else {
            onPassengerEdit({
                index: invalidPassengerIndex,
                needValidate: true,
            })
        }
    }

    const isSinglePassenger = computed(() => {
        return store.passengers.length === 1
    })

    const redirectToTicketConfirmationPage = () => {
        router.push({ name: isSinglePassenger.value ? 'check-flight-info' : 'filling-data' })
        // TODO: Оставить до реализации программ лоялности
        // showLoyaltySuccess()
    }

    enum TravelerDataEditingMode {
        BY_REPLACING_DOCUMENT = 'BY_REPLACING_DOCUMENT',
        BY_ADDING_DOCUMENT = 'BY_ADDING_DOCUMENT',
    }

    const getTravelerDataToUpdate = (mode: TravelerDataEditingMode): FellowTravelerDTO => {
        const userStoredTraveler = userStore.fellowTravelers.find(
            (traveller) =>
                'id' in currentActivePassenger.value &&
                traveller.id === currentActivePassenger.value.id,
        )

        const passengerDataWithoutDocuments = pick(currentActivePassenger.value, [
            'birthDate',
            'firstName',
            'gender',
            'id',
            'lastName',
            'middleName',
            'mail',
            'loyaltyId',
        ]) as unknown as Omit<FellowTravelerDTO, 'documents'>

        const currentTravelerDocuments: UserProfileDocument[] = userStoredTraveler?.documents || []

        const editedDocument: UserProfileDocument = {
            documentNumber: currentActivePassenger.value.documentNumber,
            citizenshipCountryISO: currentActivePassenger.value.citizenshipCountryISO,
            issueCountryISO: currentActivePassenger.value.issueCountryISO,
            documentType: currentActivePassenger.value.documentType as DocumentType,
            expiryDate: dayjs(currentActivePassenger.value.expiryDate).format('YYYY-MM-DD'),
            id: currentActivePassenger.value.documentId || '',
            isPrimary: false,
        }

        let documents: UserProfileDocument[] = []

        switch (mode) {
            case TravelerDataEditingMode.BY_ADDING_DOCUMENT: {
                documents = [...currentTravelerDocuments, editedDocument]
                break
            }
            case TravelerDataEditingMode.BY_REPLACING_DOCUMENT: {
                documents = currentTravelerDocuments.map((documentItem) =>
                    documentItem.id === editedDocument.id ? editedDocument : documentItem,
                )
                break
            }
        }

        return { ...passengerDataWithoutDocuments, documents }
    }

    const checkIsPassengerHasCorrectLoyaltyId = async (passenger: Passenger) => {
        return await withLoader(async () => {
            const response = await api.booking.checkIsPassengerHasCorrectLoyaltyId(passenger)

            if (!response.isSuccess) {
                const errorObj = response.errors?.[0] as object | undefined

                state.errors.loyaltyId =
                    errorObj && 'userMessage' in errorObj
                        ? (errorObj?.userMessage as string)
                        : 'Введён неправильный номер участника программы'
            }
        })
    }

    const updateTravelerWithAddedDocuments = async () => {
        try {
            await withLoader(
                async () =>
                    await updateUserFellowTraveler(
                        getTravelerDataToUpdate(TravelerDataEditingMode.BY_ADDING_DOCUMENT),
                    ),
            )
        } catch (e) {
            console.error(e)
        } finally {
            redirectToTicketConfirmationPage()
        }
    }

    const updateTravelerFullData = async () => {
        try {
            await withLoader(
                async () =>
                    await updateUserFellowTraveler(
                        getTravelerDataToUpdate(TravelerDataEditingMode.BY_REPLACING_DOCUMENT),
                    ),
            )
        } catch (e) {
            console.error(e)
        } finally {
            redirectToTicketConfirmationPage()
        }
    }

    return {
        init,
        onPassengerEdit,
        validatedPassenger,
        isPassengersHasSameNames,
        gendersOptions,
        docTypesOptions,
        citizenshipesOptions,
        countriesOptions,
        phoneCodesOptions,
        expirationTypesOptions,
        clearActivePassenger,
        isInvalid,
        isInvalidContacts,
        validateField,
        validateForm,
        validateContactForm,
        validatedContacts,
        handleSubmit,
        onNextStep,
        isModalUpdateTravelerDocumentsShown,
        isModalUpdateTravelerOnlyDataShown,
        isSinglePassenger,
        autoFillSource,
        initialAutoFilledPassengerData,
        redirectToTicketConfirmationPage,
        updateTravelerFullData,
        updateTravelerWithAddedDocuments,
    }
}
