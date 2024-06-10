<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
const constraints = {
    audio: false,
    video: {
        facingMode: 'environment', // задняя камера. Фронтальная - user
    },
}

const track = ref<MediaStreamTrack>()
const isSwitchOn = ref(false)

const toggleFlash = () => {
    track.value
        ?.applyConstraints({
            advanced: [{ torch: !isSwitchOn.value } as MediaTrackConstraints],
        })
        .then(() => {
            isSwitchOn.value = !isSwitchOn.value
        })
}

onMounted(() => {
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        track.value = stream.getVideoTracks()[0]
    })
})

onUnmounted(() => {
    track.value?.stop()
})
</script>

<template>
    <button
        class="rounded-full left-4 w-13 h-13"
        :class="isSwitchOn ? 'text-black bg-white' : 'text-white bg-black bg-opacity-20'"
        @click="toggleFlash"
    >
        <AppIcon name="flash" class="w-13 h-13" />
    </button>
</template>
