import { SelfieSegmentation } from '@mediapipe/selfie_segmentation'


const removeBackground = async (imageBitmap: ImageBitmap): Promise<Blob> => {
    const canvas = document.createElement('canvas')
    canvas.width = imageBitmap.width
    canvas.height = imageBitmap.height
    const ctx = canvas.getContext('2d')

    const selfieSegmentation = new SelfieSegmentation({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
    })

    selfieSegmentation.setOptions({ modelSelection: 1 })

    return new Promise(async (resolve, reject) => {
        selfieSegmentation.onResults((results) => {
            if (!results.segmentationMask)
                return reject('No segmentation mask found')

            // Draw the mask first
            ctx!.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height)

            // Use mask to clip out the person
            ctx!.globalCompositeOperation = 'source-in'
            ctx!.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height)

            // Export final image
            canvas.toBlob((blob) => {
                if (!blob) return reject ('Failed to export image')
                resolve(blob)
            }, `image/png`)
        })

        // Create an offscreen or hidden canvas
        const offscreenCanvas = document.createElement('canvas')
        offscreenCanvas.width = imageBitmap.width
        offscreenCanvas.height = imageBitmap.height
        const offscreenCtx = offscreenCanvas.getContext('2d')
        offscreenCtx!.drawImage(imageBitmap, 0, 0)

        // Now pass the canvas element instead of ImageBitmap
        await selfieSegmentation.send({ image: offscreenCanvas })
    })
}


export default removeBackground