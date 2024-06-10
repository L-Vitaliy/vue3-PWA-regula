<script lang="ts" setup>
import {useBookingPassengersInfo} from "@/features/booking-passengers-info";

const model = defineModel<boolean>()

const emits = defineEmits(['update:model-value'])

const { redirectToTicketConfirmationPage, updateTravelerFullData } = useBookingPassengersInfo()

function closeModal() {
  emits('update:model-value', false)
}

function onClickDoNotUpdate() {
  closeModal()
  redirectToTicketConfirmationPage()
}

function onClickUpdate() {
  closeModal()
  updateTravelerFullData()
}
</script>

<template>
    <AppModal v-model="model">
        <div>
            <div class="flex flex-col pt-1 pb-9 gap-3">
                <div class="text-gray font-bold text-[17px]">
                    Обновить данные попутчика?
                </div>
            </div>


            <div class="flex gap-3">
                <AppButton
                    class="grow"
                    theme="white"
                    @click="onClickDoNotUpdate"
                >
                    Не обновлять
                </AppButton>

                <AppButton
                    class="grow"
                    theme="blue"
                    @click="onClickUpdate"                >
                    Обновлять
                </AppButton>
            </div>
        </div>
    </AppModal>
</template>
