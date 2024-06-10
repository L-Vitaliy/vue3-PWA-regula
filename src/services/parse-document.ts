import { Response } from '@regulaforensics/document-reader-webclient'
import { TextFieldType } from '@regulaforensics/document-reader-webclient'
import { ExpirationTypes, Passenger } from '@/entities/passenger'
import type { UserProfileDocument, UserProfileDTO } from '@/entities/user'
import type { FellowTravelerDTO } from '@/entities/fellow-traveler'

export function getDocument(document: UserProfileDocument) {
    return {
        documentNumber: document.documentNumber,
        citizenshipCountryISO: document.citizenshipCountryISO,
        expiryDate: document.expiryDate === '9999-12-31' ? null : new Date(document.expiryDate),
        expirationType:
            document.expiryDate === '9999-12-31'
                ? ExpirationTypes.INDEFINITELY
                : ExpirationTypes.EXPIRATION,
        issueCountryISO: document.issueCountryISO,
        documentType: document.documentType,
        documentId: document.id,
    }
}

export function getPassengerInfo(
    response: Response | UserProfileDTO | { contact: FellowTravelerDTO },
): (Partial<Passenger> & Partial<Pick<FellowTravelerDTO, 'id'>>) | undefined {
    if ('text' in response && response.text) {
        const fields = response.text

        const documentNumber = fields.getField(TextFieldType.DOCUMENT_NUMBER)?.value || ''
        const birthDate = fields.getField(TextFieldType.DATE_OF_BIRTH)?.value
        const gender = fields.getField(TextFieldType.SEX)?.value === 'M' ? 'M' : 'F'
        const firstName = fields.getField(TextFieldType.GIVEN_NAMES)?.value || ''
        const lastName = fields.getField(TextFieldType.SURNAME)?.value || ''
        const middleName = fields.getField(TextFieldType.FATHERS_NAME)?.value || ''
        const citizenshipCountryISO = fields.getField(TextFieldType.NATIONALITY_CODE)?.value || ''
        const expiryDate = fields.getField(TextFieldType.DATE_OF_EXPIRY)?.value
        const issueCountryISO = fields.getField(TextFieldType.ISSUING_STATE_CODE)?.value || ''
        const documentType = fields.getField(TextFieldType.DOCUMENT_CLASS_CODE)?.value

        return {
            firstName,
            lastName,
            middleName,
            documentNumber,
            birthDate: birthDate ? new Date(birthDate) : null,
            gender,
            citizenshipCountryISO: citizenshipCountryISO.slice(0, 2),
            expiryDate: expiryDate ? new Date(expiryDate) : null,
            expirationType: expiryDate ? ExpirationTypes.INDEFINITELY : ExpirationTypes.EXPIRATION,
            issueCountryISO: issueCountryISO.slice(0, 2),
            // TODO: Переделать список документов и разобраться с кодами от сервиса
            documentType: documentType === 'PN' ? 'P' : 'FP',
        }
    }

    if ('contact' in response) {
        const contact: UserProfileDTO['contact'] | FellowTravelerDTO = response.contact
        const document =
            contact.documents.find((document) => document.isPrimary) || contact.documents[0]

        const birthDate = new Date(contact.birthDate) || null
        const gender = contact.gender || 'M'
        const firstName = contact.firstName
        const lastName = contact.lastName
        const middleName = contact.middleName || ''
        const id = 'id' in contact ? contact.id : ''

        const parsedDocument = document && getDocument(document)

        return {
            birthDate,
            gender,
            firstName,
            lastName,
            middleName,
            id,
            ...parsedDocument,
        }
    }
}
