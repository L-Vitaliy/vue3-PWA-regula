<script setup lang="ts">
import { computed } from 'vue'
import { state, useBookingPassengersInfo } from '@/features/booking-passengers-info'
import type { Passenger } from '@/entities/passenger'
import { suffixes } from '@/entities/passenger'
import Select from './Select.vue'

interface inputField {
    name: string
    formKey: keyof Passenger
}

const {
    validatedPassenger,
    validateField,
    isPassengersHasSameNames,
    gendersOptions,
    clearActivePassenger,
} = useBookingPassengersInfo()

const inputFields = computed(() => {
    const fieldsArray: inputField[] = [
        {
            name: 'Имя',
            formKey: 'firstName',
        },
        {
            name: 'Фамилия',
            formKey: 'lastName',
        },
    ]

    if (!validatedPassenger.value.withoutMiddleName) {
        fieldsArray.push({
            name: 'Отчество',
            formKey: 'middleName',
        })
    }

    return fieldsArray
})
</script>

<template>
    <div class="card text-dark text-body/15-medium">
        <div class="card-title h-11 rounded-t px-4 justify-between">
            Персональные данные
            <button @click="clearActivePassenger">
                <AppIcon name="plus-round-blue" class="rotate-45" />
            </button>
        </div>
        <div class="divide-y divide-gray-40 ml-4">
            <AppFormField
                v-for="(field, fieldIndex) in inputFields"
                :key="fieldIndex"
                class="p-0 pr-4"
            >
                <AppInputText
                    v-model="validatedPassenger[field.formKey]"
                    placeholder="Только латинские буквы"
                    @blur="validateField(field.formKey, validatedPassenger[field.formKey])"
                >
                    {{ field.name }}
                </AppInputText>
                <template #error>
                    {{ state.errors[field.formKey] }}
                </template>
            </AppFormField>

            <div class="pr-4">
                <div class="h-12 field-row">
                    Отчество отсутсвует
                    <AppSwitch v-model="validatedPassenger.withoutMiddleName" />
                </div>
                <div class="pt-1 pb-3 text-body/13 text-gray-dark">
                    Обязательно для перелетов внутри РФ
                </div>

                <AppFormField>
                    <Select
                        v-if="isPassengersHasSameNames"
                        v-model="validatedPassenger.suffix"
                        title="Суффикс"
                        modal-title="ФИО совпадает с другим пассажиром, необходимо указать суффикс:"
                        :options="suffixes"
                        :selected-title="validatedPassenger.suffix"
                        class="!pr-0"
                    />
                    <template #error>
                        {{ state.errors.suffix }}
                    </template>
                </AppFormField>
            </div>
            <div class="h-12 pr-4 field-row gap-4">
                <div class="">Пол</div>
                <AppRadioTabs
                    v-model="validatedPassenger.gender"
                    :options="gendersOptions.options()"
                    item-container-classes="flex items-center"
                    class="flex rounded overflow-hidden border border-blue-70"
                >
                    <template #default="{ option, index }">
                        <div
                            class="flex h-8 px-10 m-0 bg-white items-center place-content-center peer-checked:bg-blue-70 text-primary peer-checked:text-white whitespace-nowrap"
                            :class="{
                                'border-r border-blue-70 ':
                                    index < gendersOptions.options().length - 1,
                            }"
                        >
                            {{ gendersOptions.title(option) }}
                        </div>
                    </template>
                </AppRadioTabs>
            </div>
        </div>
    </div>
</template>
