type Crop = { x: number; y: number; width: number; height: number }

const createImage = (imageSrc: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = imageSrc
        image.onload = () => resolve(image)
        image.onerror = reject
    })
}

const getCroppedImage = async ( imageSrc: string, crop: Crop, targetSize: number = 300): Promise<Blob> => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    canvas.width = targetSize
    canvas.height = targetSize
    const ctx = canvas.getContext('2d')

    // draw cropped area to canvas
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    ctx?.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        targetSize,
        targetSize
    )

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                return reject(new Error('Canvas is empty.'))
            }

            resolve(blob)
        }, 'image/png')
    })
}

export default getCroppedImage
