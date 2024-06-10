<script setup lang="ts">
import AppFooter from '@/components/layouts/new/AppFooter.vue'
import AirplaneMap from './AirplaneMap.vue'
import PassengerList from './PassengerList.vue'
import Legend from './Legend.vue'
</script>

<template>
    <MainLayout>
        <AppHeader />
        <AppContent>
            <div class="px-2 gap-y-[6px] flex flex-col">
                <h1 class="text-white text-[32px] font-semibold">Выбор мест</h1>
                <span class="text-white text-[17px]">SVO–LHR, 13 января</span>
            </div>
            <div class="flex flex-col gap-y-4 overflow-hidden mt-4">
                <PassengerList />
                <Legend />
                <AirplaneMap />
            </div>
        </AppContent>
        <AppFooter>
            <div class="w-full bg-blue-10 px-4 py-2">
                <AppButton full size="l">Подтвердить</AppButton>
            </div>
        </AppFooter>
    </MainLayout>
</template>
