// Import the functions you need from the SDKs you need
import config from '@/shared/config'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, type Messaging } from 'firebase/messaging'

import { store as appStore } from '@/stores/app'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = config.FIREBASE

let messaging: Messaging

try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig)

    messaging = getMessaging(app)
} catch (e) {
    console.log('Не удалось инициализировать firebase', e)
}

export function messagingFetchToken(isRepeat?: boolean) {
    getToken(messaging, { vapidKey: config.VAPID_KEY })
        .then((currentToken) => {
            if (currentToken) {
                appStore.fcmToken = currentToken
            } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.')
                // ...
            }
        })
        .catch((err) => {
            console.log('An error occurred while retrieving token. ', err)
            // ...
            if (!isRepeat) {
                // При первом запуске приложения, скрипт срабатывает до инициализации sw и регистрации pushManager
                // Достаточно просто вызвать второй раз (поставил с таймаутом, чтоб наверняка)
                // Регистрация через navigator не сработала.
                // https://github.com/firebase/firebase-js-sdk/issues/7693
                setTimeout(() => {
                    messagingFetchToken(true)
                }, 1000)
            }
        })
}
