import { useState } from 'react'
import ImageCropper from '../../components/ImageCropper/ImageCropper'
import image from '../../assets/user_default.png'
import './home.css'


const Home = () => {
    const [file, setFile] = useState<string | null>(null)
    const [croppedImage, setCroppedImage] = useState<Blob | null>(null)
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target

        if (files && files.length > 0) {
            const file = files[0]
            const reader = new FileReader()

            reader.onload = () => {
                if (reader.result)
                    setFile(reader.result as string)  // This is the image src string
            }

            reader.readAsDataURL(file)  // Convert file to base64 URL
        }
    }

    return (
        <div className='home'>
            <div className='file-input-container'>
                <div className='img-container'>
                    <img src={ croppedImage ?  URL.createObjectURL(croppedImage) : image } />
                </div>
                
                <input
                    className='file-input'
                    id='file'
                    name='file'
                    type='file'
                    accept='image/*'
                    onChange={(event) => handleChange(event)}
                />
            </div>

            {
                file &&
                <ImageCropper
                    image={file}
                    onCropped={(croppedImg) => {
                        setCroppedImage(croppedImg)
                        setFile(null)
                    }}
                />
            }
        </div>  
    )
}

export default Home
