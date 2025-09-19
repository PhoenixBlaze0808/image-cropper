import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express()
dotenv.config()


// ES Module workaround for __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


app.use(express.json())

const alloweOrigin = ['http://localhost:5173', 'http://localhost:5174']
app.use(cors({
    origin: alloweOrigin,
    credentials: true,
}))


app.get('/selfie_segmentation', (req, res) => {
    const filepath = path.join(__dirname, 'public', 'selfie_segmentation.js')
    res.sendFile(filepath)
})


const PORT = process.env.APP_PORT || 9999
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})