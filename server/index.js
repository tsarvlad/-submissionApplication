import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import helmet, { crossOriginResourcePolicy } from 'helmet'
import morgan from 'morgan'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

// Authentication importF
import { register } from './controllers/auth.js'
import authRoutes from './routes/auth.js'

import userRoutes from './routes/user.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use(cors({
    origin: process.env.FRONT_DEPLOYMENT_URL
}))

/*File Storage */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //callback, where is image will be stored
        cb(null, 'public/assets')
    },
    //with which name it's going to be stored
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

// Routes with images (files)
app.post('/auth/register', upload.single('picture'), register)

// Routes
app.use('/auth', authRoutes)
app.use('/user', userRoutes)
//Mongoose Setup



const PORT = process.env.PORT || 6001;
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`))
}).catch((error) => console.log(`${error}, did not connect`))

export default app