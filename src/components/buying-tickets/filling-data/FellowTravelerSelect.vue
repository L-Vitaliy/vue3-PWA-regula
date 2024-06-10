<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { store as userStore } from '@/stores/user'
import type { FellowTravelerDTO } from '@/entities/fellow-traveler'
import Option from './FellowTravelerOption.vue'
import { useUser } from '@/features/user'
import Cookies from 'js-cookie'

const { fetchUserFellowTravelers } = useUser()

const showPopup = ref(false)

const emits = defineEmits(['select'])

const handleSelect = (fellowTraveler: FellowTravelerDTO) => {
    emits('select', fellowTraveler)
    showPopup.value = false
}

onMounted(async () => {
    if (Cookies.get('auth.accessToken')) {
        userStore.fellowTravelers.length === 0 && fetchUserFellowTravelers()
    }
})
</script>

<template>
    <div>
        <button
            class="flex flex-col items-center disabled:text-buttons/blue-bg-disable [&:disabled>svg>path]:stroke-buttons/blue-bg-disable"
            :disabled="!userStore.isAuthenticated || userStore.fellowTravelers.length === 0"
            @click="showPopup = true"
        >
            <AppIcon name="add-passenger" color="orange" />
            <div class="w-20 text-center text-body/12">Попутчики</div>
        </button>

        <ActionModal :show="showPopup">
            <div class="card">
                <div class="card-title h-11 px-4">Попутчики</div>
                <Option
                    v-for="fellowTraveler in userStore.fellowTravelers"
                    :key="fellowTraveler.id"
                    :fellow-traveler="fellowTraveler"
                    @select="handleSelect"
                />
            </div>
            <template #controls>
                <AppButton
                    class="flex-1"
                    theme="white"
                    size="xl"
                    @click="showPopup = false">
                    Закрыть
                </AppButton>
            </template>
        </ActionModal>
    </div>
</template>
