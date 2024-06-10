import type { Sex } from './checkin-search-pnrs-request'
import type { DocumentType } from './user'

export const docTypes: Array<{
    id: DocumentType
    title: string
}> = [
    { id: 'P', title: 'Внутренний паспорт' },
    { id: 'FP', title: 'Заграничный паспорт' },
    { id: 'BC', title: 'Свидетельство о рождении' },
]

export const suffixes = ['JR', 'SR', 'II', 'III', 'IV']

export const genders: Array<{
    id: Sex
    title: string
}> = [
    { id: 'M', title: 'М' },
    { id: 'F', title: 'Ж' },
]

export enum ExpirationTypes {
    EXPIRATION = 'expiration',
    INDEFINITELY = 'indefinitely',
}

export const expirationTypes = [
    { id: ExpirationTypes.EXPIRATION, title: 'Со сроком' },
    { id: ExpirationTypes.INDEFINITELY, title: 'Бессрочно' },
]

export enum PassengerTypeEnum {
    ADULT = 'ADULT',
    CHILD = 'CHILD',
    INFANT = 'INFANT',
}

export enum PassengerAutofillSourceEnum {
    SCAN = 'SCAN',
    FELLOW_TRAVELER = 'FELLOW_TRAVELER',
    USER_PROFILE = 'USER_PROFILE',
}

export class Bonus {
    type = ''
    number = ''
}

export class Passenger {
    type: PassengerTypeEnum
    index: number
    firstName: string = ''
    lastName: string = ''
    middleName: string = ''
    withoutMiddleName: boolean = false
    suffix: string = ''
    gender: Sex = 'M'
    documentType: DocumentType | '' = ''
    documentId: string | null = ''
    birthDate: Date | null = null
    citizenshipCountryISO: string = 'RU'
    issueCountryISO: string = 'RU'
    documentNumber: string = ''
    expirationType: ExpirationTypes = ExpirationTypes.INDEFINITELY
    expiryDate: Date | null = null
    bonus: Bonus = new Bonus()
    loyaltyId?: string | null = null

    public static create(
        type: PassengerTypeEnum = PassengerTypeEnum.ADULT,
        index: number = 1,
    ): Passenger {
        return new Passenger(type, index)
    }

    constructor(type: PassengerTypeEnum, index: number) {
        this.type = type
        this.index = index
    }
}

export class PassengerContacts {
    phoneCode = 0
    phone = ''
    email = ''

    public static create(): PassengerContacts {
        return new PassengerContacts()
    }
}
