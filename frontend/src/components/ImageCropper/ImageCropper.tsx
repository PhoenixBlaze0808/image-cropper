import type { Dispatch, SetStateAction } from 'react'
import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImage from './cropImage'
import removeBackground from './removeBackground'
import './imagecropper.css'


type Point = { x: number; y: number }
type Area = { x: number; y: number; width: number; height: number }
type ImageCropperProps = {
    image: string
    onCropped: Dispatch<SetStateAction<Blob | null>>
}

const ImageCropper: React.FC<ImageCropperProps> = ({ image, onCropped }) => {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
    const [zoom, setZoom] = useState<number>(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

    const onCropComplete = useCallback((_: any, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleDone = async () => {
        if (!croppedAreaPixels) {
            console.warn("No cropped area defined.");
            onCropped(null)
            return
        }

        try {
            const croppedImage = await getCroppedImage(image, croppedAreaPixels, 500)
            const bitmap = await createImageBitmap(croppedImage)
            const result = await removeBackground(bitmap)

            if (!result) {
                console.error("Background removal returned undefined.");
                onCropped(null);
                return;
            }
            onCropped(result)
        }
        catch (error) {
            console.error('Cropping or background removal failed: ', error)
        }
    }

    return (
        <div className='image-cropper'>
            <Cropper
                classes={ { containerClassName: 'image-cropper-container' } }
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
            />
            <button className='crop-btn' onClick={handleDone}>Crop</button>
        </div>
    )
}

export default ImageCropper
