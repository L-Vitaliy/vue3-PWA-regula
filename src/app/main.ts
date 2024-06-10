import '@/shared/assets/main.css'

import { createApp } from 'vue'

import uiComponents from '@/components/ui'
import layouts from '@/components/layouts'

import App from './App.vue'
import router from './router'
import { messagingFetchToken } from './firebase'
import { initProviderAuth } from '@/shared/api-providers'

import VueScrollPicker from 'vue-scroll-picker'
import 'vue-scroll-picker/src/vue-scroll-picker.css'

initProviderAuth()
messagingFetchToken()

const app = createApp(App)

app.use(router)
app.use(VueScrollPicker)

const autoMountList = [...Object.entries(uiComponents), ...Object.entries(layouts)]

for (const [title, component] of autoMountList) {
    app.component(title, component)
}

app.mount('#app')
