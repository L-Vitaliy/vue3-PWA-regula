<script setup lang="ts">
import { computed } from 'vue'
import { store as userStore } from '@/stores/user'
import { state, useBookingPassengersInfo } from '@/features/booking-passengers-info'
import { getDocument } from '@/services/parse-document'
import Select from './Select.vue'
import Datepicker from './Datepicker.vue'
import AppFormField from '@/components/ui/AppFormField.vue'
import UserDocuments from './UserDocuments.vue'
import type { UserProfileDocument } from '@/entities/user'
import { store as appStore } from '@/stores/app'
import { ExpirationTypes } from '@/entities/passenger'

const {
    validatedPassenger,
    docTypesOptions,
    citizenshipesOptions,
    countriesOptions,
    expirationTypesOptions,
} = useBookingPassengersInfo()

const docTypesOptionsList = computed(() => {
    return docTypesOptions.originOptions.map((docType) => docType.title)
})

const maxExpiryDate = computed(() => {
    const date = new Date()
    date.setFullYear(new Date().getFullYear() + 60)

    return date
})

const handleDocTypeUpdate = (newValue: string) => {
    const found = docTypesOptions.originOptions.find((docType) => docType.title === newValue)
    if (found) {
        validatedPassenger.value.documentType = found.id
    }
}

const handleCitizenshipUpdate = (newValue: string) => {
    const found = citizenshipesOptions.originOptions.find(
        (citizenship) => citizenship.title === newValue,
    )
    if (found) {
        validatedPassenger.value.citizenshipCountryISO = found.code
    }
}

const sortedCountriesList = computed(() => appStore.getSortedCountries().map((item) => item.title))
const handleCountryIssueUpdate = (newValue: string) => {
    const found = countriesOptions.originOptions.find((country) => country.title === newValue)
    if (found) {
        validatedPassenger.value.issueCountryISO = found.code
    }
}

const handleSelectDocument = (document: UserProfileDocument) => {
    const parsedDocument = getDocument(document)
    Object.assign(validatedPassenger.value, parsedDocument)
}
</script>

<template>
    <!-- Персональные данные -->
    <div v-if="validatedPassenger" class="card text-dark text-body/15-medium">
        <div class="card-title h-11 rounded-t px-4">
            Документ
            <UserDocuments
                v-if="
                    userStore.isAuthenticated &&
                        (userStore.userProfile?.contact.documents.length || 0) > 1
                "
                @select="handleSelectDocument"
            />
        </div>
        <div class="divide-y divide-gray-40 ml-4">
            <AppFormField>
                <Select
                    title="Тип документа"
                    :options="docTypesOptionsList"
                    :selected-title="docTypesOptions.title(validatedPassenger.documentType)"
                    :model-value="docTypesOptions.title(validatedPassenger.documentType)"
                    @update:model-value="handleDocTypeUpdate"
                />
                <template #error>
                    {{ state.errors.documentType }}
                </template>
            </AppFormField>
            <AppFormField>
                <Datepicker
                    v-model="validatedPassenger.birthDate"
                    title="Дата рождения"
                    :min-year="1911" />
                <template #error>
                    {{ state.errors.birthDate }}
                </template>
            </AppFormField>
            <AppFormField>
                <Select
                    title="Гражданство"
                    :options="sortedCountriesList"
                    :selected-title="
                        citizenshipesOptions.title(validatedPassenger.citizenshipCountryISO)
                    "
                    :model-value="
                        citizenshipesOptions.title(validatedPassenger.citizenshipCountryISO)
                    "
                    @update:model-value="handleCitizenshipUpdate"
                />
                <template #error>
                    {{ state.errors.citizenshipCountryISO }}
                </template>
            </AppFormField>
            <AppFormField>
                <Select
                    title="Страна выдачи"
                    :options="sortedCountriesList"
                    :selected-title="countriesOptions.title(validatedPassenger.issueCountryISO)"
                    :model-value="countriesOptions.title(validatedPassenger.issueCountryISO)"
                    @update:model-value="handleCountryIssueUpdate"
                />
                <template #error>
                    {{ state.errors.issueCountryISO }}
                </template>
            </AppFormField>

            <AppFormField>
                <AppInputText v-model="validatedPassenger.documentNumber" placeholder="без пробела">
                    Серия и номер
                </AppInputText>
                <template #error>
                    {{ state.errors.documentNumber }}
                </template>
            </AppFormField>

            <div class="h-12 pr-4 field-row">
                Срок действия
                <AppRadioTabs
                    v-model="validatedPassenger.expirationType"
                    :options="expirationTypesOptions.options()"
                    item-container-classes="flex items-center"
                    class="flex rounded overflow-hidden border border-blue-70"
                >
                    <template #default="{ option, index }">
                        <div
                            class="flex h-8 px-4 m-0 bg-white items-center place-content-center peer-checked:bg-blue-70 text-primary peer-checked:text-white whitespace-nowrap"
                            :class="{
                                'border-r border-blue-70 ':
                                    index < expirationTypesOptions.options().length - 1,
                            }"
                        >
                            {{ expirationTypesOptions.title(option) }}
                        </div>
                    </template>
                </AppRadioTabs>
            </div>
            <AppFormField v-if="validatedPassenger.expirationType === ExpirationTypes.EXPIRATION">
                <Datepicker
                    v-model="validatedPassenger.expiryDate"
                    title="Годен до"
                    :max-date="maxExpiryDate"
                />
                <template #error>
                    {{ state.errors.expiryDate }}
                </template>
            </AppFormField>
        </div>
    </div>
</template>
