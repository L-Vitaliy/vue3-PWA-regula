<script setup lang="ts">
// @ts-nocheck
import { defineEmits, ref } from 'vue'
import { useRegula } from '@/features/regula'
import { store as userStore } from '@/stores/user'
import { getPassengerInfo } from '@/services/parse-document'
import ScanCamera from '@/components/ui/AppModals/ScanCamera.vue'
import type { Passenger } from '@/entities/passenger'
import { PassengerAutofillSourceEnum } from '@/entities/passenger'
import AppPopup, { type IPopup } from '@/components/ui/AppModals/AppPopup.vue'
import FellowTravelerSelect from './FellowTravelerSelect.vue'
import type { FellowTravelerDTO } from '@/entities/fellow-traveler'

defineProps<{
    isEditPage?: boolean
}>()

const { parseImage } = useRegula()

const emits = defineEmits(['editClick', 'complete'])

// const showDocs = ref(false)

const showCamera = ref(false)
const fileInput = ref(null)
const isScanFileLoading = ref(false)

const popup = ref<{ show: boolean; props?: IPopup }>({
    show: false,
})

const handleComplete = (passenger: Partial<Passenger>, source?: PassengerAutofillSourceEnum) => {
    emits('complete', passenger, source)
}

const handleScanReject = () => {
    popup.value = {
        show: true,
        props: {
            type: 'error',
            title: 'Ошибка',
            message: 'Документ не распознан. Попробуйте еще раз или введите данные вручную',
        },
    }
}

const handleUploadFile = async ({ target }: { target: HTMLInputElement & EventTarget }) => {
    if (target.files.length) {
        isScanFileLoading.value = true
        const response = await parseImage(target.files)
        const passenger = getPassengerInfo(response)
        if (passenger) {
            handleComplete(passenger, PassengerAutofillSourceEnum.SCAN)
        } else {
            handleScanReject()
        }
        isScanFileLoading.value = false
    }
}

const handleCameraDenied = () => {
    popup.value = {
        show: true,
        props: {
            type: 'error',
            title: 'Ошибка',
            message: 'Включите разрешение на использование камеры и попробуйте снова',
        },
    }
}

const getProfileInfo = () => {
    const profile = userStore.userProfile
    const passenger: Passenger = {
        ...getPassengerInfo(profile),
        loyaltyId: userStore.userProfile?.loyaltyInfo?.loyaltyId || '',
    }
    if (passenger) {
        handleComplete(passenger, PassengerAutofillSourceEnum.USER_PROFILE)
    } else {
        popup.value = {
            show: true,
            props: {
                type: 'error',
                title: 'Ошибка',
                message: 'Возникли проблемы при загрузке профиля',
            },
        }
    }
}

const getFellowTraveler = (fellowTraveler: FellowTravelerDTO) => {
    const passenger = getPassengerInfo({ contact: fellowTraveler })
    if (passenger) {
        handleComplete(passenger, PassengerAutofillSourceEnum.FELLOW_TRAVELER)
    } else {
        popup.value = {
            show: true,
            props: {
                type: 'error',
                title: 'Ошибка',
                message: 'Возникли проблемы при обработке попутчика',
            },
        }
    }
}
</script>

<template>
    <div class="card text-dark text-body/15-medium">
        <ScanCamera
            v-model="showCamera"
            @complete="handleComplete"
            @reject="handleScanReject"
            @denied="handleCameraDenied"
        />
        <AppPopup v-model="popup.show" v-bind="popup.props" />

        <div class="card-title h-11 rounded-t px-4">
            <slot name="header" />
        </div>
        <div class="px-4 py-2 field-row">
            <button class="flex flex-col items-center" @click="showCamera = true">
                <AppIcon name="scan" />
                <div class="w-20 text-center text-body/12">Сканировать</div>
            </button>
            <button class="flex flex-col items-center" @click="fileInput.click()">
                <AppSpin v-if="isScanFileLoading" variant="blue" />
                <AppIcon v-else name="gallery" />
                <div class="w-20 text-center text-body/12">Из галереи</div>
                <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    style="display: none"
                    @change="handleUploadFile"
                />
            </button>
            <button
                v-if="isEditPage"
                class="flex flex-col items-center disabled:text-buttons/blue-bg-disable [&:disabled>svg>path]:stroke-buttons/blue-bg-disable"
                :disabled="!userStore.isAuthenticated"
                @click="getProfileInfo"
            >
                <AppIcon name="profile-blue" class="" />
                <div class="w-20 text-center text-body/12">Из профиля</div>
            </button>
            <button v-else class="flex flex-col items-center" @click="emits('editClick')">
                <AppIcon name="edit" class="" />
                <div class="w-20 text-center text-body/12">Ввести</div>
            </button>
            <FellowTravelerSelect @select="getFellowTraveler" />
        </div>
    </div>
</template>
