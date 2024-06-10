<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { store } from '@/stores/booking'
import { store as userStore } from '@/stores/user'
import { state, useBookingPassengersInfo } from '@/features/booking-passengers-info'
import { Passenger, PassengerAutofillSourceEnum, PassengerTypeEnum } from '@/entities/passenger'
import AutoFill from './AutoFill.vue'
import PersonalInfo from './PersonalInfo.vue'
import Document from './Document.vue'
import Contacts from './Contacts.vue'
import Loyalty from './Loyalty.vue'
import { useRouter, useRoute } from 'vue-router'
import type { IPopup } from '@/components/ui/AppModals/AppPopup.vue'
import AppPopup from '@/components/ui/AppModals/AppPopup.vue'
import LoginButton from '@/components/shared/LoginButton.vue'
import EditDataModalCheckDocumentsUpdate from './EditDataModalCheckDocumentsUpdate.vue'
import EditDataModalCheckFullUpdate from './EditDataModalCheckFullUpdate.vue'

const route = useRoute()
const router = useRouter()

const {
    init,
    isInvalid,
    isInvalidContacts,
    validateForm,
    validatedPassenger,
    handleSubmit,
    isSinglePassenger,
    isModalUpdateTravelerDocumentsShown,
    isModalUpdateTravelerOnlyDataShown,
    initialAutoFilledPassengerData,
    autoFillSource,
} = useBookingPassengersInfo()

const popup = ref<{ show: boolean; props?: IPopup }>({
    show: false,
})

const passengerName = computed(() => {
    return state.activePassenger.type === PassengerTypeEnum.ADULT
        ? 'Взрослый пассажир'
        : state.activePassenger.type === PassengerTypeEnum.CHILD
          ? 'Ребенок'
          : 'Младенец'
})

const showAutoFillPopup = () => {
    popup.value = {
        show: true,
        props: {
            type: 'success',
            title: 'Успешно',
            message:
                'Пожалуйста, проверьте правильность введенных данных. При необходимости, данные можно скорректировать вручную.',
        },
    }
}

const showLoyaltySuccess = () => {
    popup.value = {
        show: true,
        props: {
            type: 'success',
            title: 'Пассажир зарегистрирован в программе',
            message:
                'Письмо с номером участника и инструкцией по активации личного кабинета будет\n отправлено на указанный электронный адрес после завершения бронирования',
        },
    }
}

const handleAutofill = (passenger: Passenger, source?: PassengerAutofillSourceEnum) => {
    const initialPassengerData = Object.assign(validatedPassenger.value, passenger)
    initialAutoFilledPassengerData.value = cloneDeep(initialPassengerData)

    if (source) {
        autoFillSource.value = source
    }

    nextTick(() => {
        showAutoFillPopup()
        validateForm()
    })
}

onMounted(async () => {
    // TODO: В рамках PWA, обновление невозможно. Чисто проверка для разработки
    if (store.passengers.length === 0) {
        init()
    }

    if (route.query?.autofill === 'true') {
        nextTick(() => {
            showAutoFillPopup()
            validateForm()
            router.replace({ query: { ...route.query, autofill: undefined } })
        })
    }
})
</script>

<template>
    <MainLayout>
        <!-- Header -->
        <AppHeader>
            <template #title>
                <div class="flex justify-between items-center w-full">
                    {{
                        `${passengerName}${isSinglePassenger ? '' : ` ${state.activePassenger.index}`} `
                    }}
                </div>
            </template>
            <template v-if="!userStore.isAuthenticated" #icon>
                <LoginButton />
            </template>
        </AppHeader>

        <!-- body -->
        <AppContent>
            <div class="mb-16 pt-2 px-2 pb-12 w-full flex flex-col gap-2">
                <AutoFill is-edit-page @complete="handleAutofill">
                    <template #header> Автозаполнение данных </template>
                </AutoFill>
                <PersonalInfo />
                <Document />
                <Contacts v-if="isSinglePassenger" />
                <Loyalty />
                <AppButton
                    class="w-full my-2"
                    theme="white"
                    outline="true"
                    size="l"
                    @click="showLoyaltySuccess"
                >
                    Получить номер участника
                </AppButton>

                <div class="py-2 -mx-2 px-2 text-body/13 text-white border-l-4 border-l-orange">
                    Выбирая “Получить номер участника” вы соглашаетесь с
                    <span class="text-primary underline">Правилами программы</span>
                    и принимаете
                    <span class="text-primary underline">
                        Соглашение на передачу персональных данных
                    </span>
                </div>
            </div>
        </AppContent>

        <!-- Footer -->
        <AppFooter class="px-4 pb-5 fixed bottom-0 bg-blue-10 w-full z-30">
            <AppButton
                class="w-full my-2"
                theme="blue"
                size="xl"
                :disabled="isInvalid || (isSinglePassenger && isInvalidContacts)"
                @click="handleSubmit"
            >
                Готово
            </AppButton>
        </AppFooter>

        <AppPopup v-model="popup.show" v-bind="popup.props" />

        <EditDataModalCheckDocumentsUpdate v-model="isModalUpdateTravelerDocumentsShown" />

        <EditDataModalCheckFullUpdate v-model="isModalUpdateTravelerOnlyDataShown" />
    </MainLayout>
</template>
