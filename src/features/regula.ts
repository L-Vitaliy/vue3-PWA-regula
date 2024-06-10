import { ref } from 'vue'
import {
    type DocumentReaderProcessor as DocumentReaderProcessorType,
    DocumentReaderProcessor,
} from '@regulaforensics/vp-frontend-document-components'

export function useRegula() {
    let _processor: DocumentReaderProcessorType | null = null

    const isInitLoading = ref(false)

    const init = async (videoElementId?: string) => {
        isInitLoading.value = true
        const videoElement = document.getElementById(videoElementId || '') as HTMLVideoElement
        _processor = new DocumentReaderProcessor(videoElement)

        try {
            // Variant 1 - for production environment
            // await processor.initialize();
            // Variant 2 - for test-only environment
            await _processor.initialize({
                license: '',
            })
        } catch (e) {
            console.log(e)
        }
        isInitLoading.value = false
    }

    const startStream = async (videoElementId: string) => {
        await init(videoElementId)

        if (_processor) {
            const result = await _processor.startRecognition()

            if (result) {
                return result
            }
            throw new Error('Документ не распознан')
        }

        throw new Error('Ошибка инициализации')
    }

    const stopStream = async () => {
        if (_processor) {
            _processor.shutdown()
            _processor.stopRecognition()
        }
    }

    const parseImage = async (files: FileList) => {
        await init()
        if (_processor) {
            const result = await _processor.processImage(files)
            return result
        }
    }

    const switchCamera = () => {
        if (_processor) {
            _processor.switchCamera()
        }
    }

    return {
        isInitLoading,
        startStream,
        stopStream,
        parseImage,
        switchCamera,
    }
}
