<script setup lang="ts">
import '@/shared/assets/style.css'
import { RouterView } from 'vue-router'
import { useLoadApp } from '@/features/load-app'
import AppLoadingOverlay from '@/components/ui/AppModals/AppLoadingOverlay.vue'
import { state } from '@/features/loader'
// import Chatbot from '@/components/chatbot/Chatbot.vue'
import config from '@/shared/config'

useLoadApp()
</script>

<template>
    <AppLoadingOverlay v-show="state.showLoader" />
    <RouterView />
    <!-- <Chatbot v-if="config.SHOW_CHATBOT" /> -->
</template>

<style module="m"></style>
