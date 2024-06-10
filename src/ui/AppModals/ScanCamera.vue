<script setup lang="ts">
import { watch, nextTick, ref } from 'vue'
import { useRegula } from '@/features/regula'
import { getPassengerInfo } from '@/services/parse-document'
import Torch from './Flash.vue'

const model = defineModel<boolean>()

const emits = defineEmits(['complete', 'reject', 'denied'])

const isInit = ref(false)

const { isInitLoading, startStream, stopStream, switchCamera } = useRegula()

watch(
    () => model.value,
    () => {
        if (model.value) {
            nextTick(() => {
                startStream('videoRegula')
                    .then((response) => {
                        stopStream()
                        const passenger = getPassengerInfo(response)

                        if (passenger) {
                            emits('complete', passenger)
                        } else {
                            emits('reject')
                        }
                    })
                    .catch((error) => {
                        if (
                            typeof error === 'object' &&
                            'type' in error &&
                            error.type === 'CAMERA_PERMISSION_DENIED'
                        ) {
                            emits('denied')
                        } else {
                            emits('reject')
                        }
                    })
                    .finally(() => {
                        model.value = false
                    })

                isInit.value = true
            })
        } else {
            isInit.value = false
            stopStream()
        }
    },
)
</script>

<template>
    <AppModalOverlay :show="model" position="center">
        <div class="relative w-full h-full rounded-2xl">
            <video
                id="videoRegula"
                autoPlay
                class="w-full h-full" />
            <AppSpin
                v-if="isInitLoading || !isInit"
                variant="white"
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
            <template v-else>
                <button
                    class="absolute top-2 bg-black bg-opacity-20 rounded-full right-2 text-white"
                    @click="model = false"
                >
                    <AppIcon name="close" class="w-10 h-10" />
                </button>
                <Torch class="absolute bottom-7 left-4" />
                <button
                    class="absolute rounded-full bottom-7 right-4 w-13 h-13 flex items-center justify-center text-white bg-black bg-opacity-20"
                    @click="switchCamera"
                >
                    <AppIcon
                        name="change"
                        theme="white"
                        class="w-10 h-10" />
                </button>
            </template>
        </div>
    </AppModalOverlay>
</template>
