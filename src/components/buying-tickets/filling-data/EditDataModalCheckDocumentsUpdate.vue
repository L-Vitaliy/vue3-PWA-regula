<script setup lang="ts">
import {useBookingPassengersInfo} from "@/features/booking-passengers-info";

const model = defineModel<boolean>()

const emits = defineEmits(['update:model-value'])

const { redirectToTicketConfirmationPage, updateTravelerFullData, updateTravelerWithAddedDocuments } = useBookingPassengersInfo()

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

function onClickAddDocument() {
  closeModal()
  updateTravelerWithAddedDocuments()
}
</script>

<template>
    <AppModal v-model="model">
        <div>
            <div class="flex flex-col pt-1 pb-6 gap-3">
                <div class="text-gray font-bold text-[17px]">
                    Обновить данные попутчика?
                </div>

                <div class="text-gray-90 text-[13px]">
                    Вы можете обновить данные в существующем документе попутчика или добавить новый.
                </div>
            </div>


            <div class="flex flex-col gap-3">
                <AppButton
                    theme="white"
                    @click="onClickDoNotUpdate"
                >
                    Не обновлять
                </AppButton>

                <AppButton
                    theme="white"
                    @click="onClickUpdate"
                >
                    Обновлять
                </AppButton>

                <AppButton
                    theme="blue"
                    @click="onClickAddDocument"
                >
                    Добавить новый
                </AppButton>
            </div>
        </div>
    </AppModal>
</template>
