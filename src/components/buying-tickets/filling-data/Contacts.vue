<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import Select from './Select.vue'
import { useBookingPassengersInfo } from '@/features/booking-passengers-info'
import { store as appStore } from '@/stores/app'
import { state } from '@/features/booking-passengers-info'
import { store as userStore } from '@/stores/user'
import config from '@/shared/config'
import mocks from '@/mocks'

const { validatedContacts } = useBookingPassengersInfo()

const countyCodesList = computed(() => {
    return appStore.getSortedCountries().map((item) => `+${item.phoneCode} ${item.title}`)
})

const selectedPhoneCode = ref('')

const handlePhoneCodeUpdate = (newValue: string) => {
    const titleSeparate = newValue.split(' ')
    const title = titleSeparate.slice(1, titleSeparate.length).join(' ')

    const found = appStore.countries.find((country) => country.title === title)

    if (found) {
        validatedContacts.value.phoneCode = found.phoneCode
        selectedPhoneCode.value = `+${found.phoneCode} ${found.title}`
    }
}

const initForm = async () => {
    if (validatedContacts.value.phone === '' && userStore.isAuthenticated) {
        const profile = await mocks.getUserProfile()

        validatedContacts.value.email = profile.data.contact.email

        const phone = profile.data.contact.phones.find((phone) => phone.isPrimary)
        if (phone) {
            const found = appStore.countries.find((country) => country.code === phone.countryISO)
            if (found) {
                validatedContacts.value.phoneCode = found.phoneCode
                validatedContacts.value.phone = phone.phoneNumber.slice(
                    found.phoneCode.toString().length,
                    phone.phoneNumber.length,
                )
                handlePhoneCodeUpdate(`+${found.phoneCode} ${found.title}`)
            }
        }
    } else if (validatedContacts.value.phoneCode) {
        const phoneCode = validatedContacts.value.phoneCode
        if (phoneCode) {
            const found = appStore.countries.find((country) => country.phoneCode === phoneCode)
            if (found) {
                handlePhoneCodeUpdate(`+${found.phoneCode} ${found.title}`)
            }
        }
    } else {
        const found = appStore.countries.find(
            (country) => country.code === config.LANG.toUpperCase(),
        )
        if (found) {
            validatedContacts.value.phoneCode = found.phoneCode
            handlePhoneCodeUpdate(`+${found.phoneCode} ${found.title}`)
        }
    }
}

watch(() => userStore.isAuthenticated, initForm)

onMounted(async () => {
    await initForm()
})
</script>

<template>
    <div class="card text-dark text-body/15-medium">
        <div class="card-title h-11 rounded-t px-4">Контактные данные для заказа</div>
        <div class="ml-4 divide-y divide-gray-40 [&>*]:pr-4">
            <Select
                :model-value="selectedPhoneCode"
                title="Код страны"
                :options="countyCodesList"
                :selected-title="selectedPhoneCode"
                @update:model-value="handlePhoneCodeUpdate"
            />
            <AppFormField>
                <template #default>
                    <AppInputText v-model="validatedContacts.phone" placeholder="без кода страны">
                        Телефон
                    </AppInputText>
                </template>
                <template #error>
                    {{ state.contactsErrors.phone }}
                </template>
            </AppFormField>

            <AppFormField class="pr-4">
                <template #default>
                    <AppInputText
                        v-model="validatedContacts.email"
                        placeholder="адрес электронной почты"
                    >
                        Почта
                    </AppInputText>
                </template>
                <template #error>
                    {{ state.contactsErrors.email }}
                </template>
            </AppFormField>
        </div>
    </div>
</template>
