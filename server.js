import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './src/routes/authRoutes.js'
import notificationRoutes from './src/routes/notificationRoutes.js'  // ← هذا بعد app
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()  // ← يجب أن يكون قبل استخدام app
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static files
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}
app.use('/uploads', express.static(uploadDir))

// Routes - يجب أن تكون بعد تعريف app
app.use('/api/auth', authRoutes)
app.use('/api/notifications', notificationRoutes)  // ← هنا

app.get('/', (req, res) => {
  res.json({ message: 'ShareChat API يعمل 🚀' })
})

app.get('/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toLocaleString('ar-EG') })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 الخادم يعمل على: http://0.0.0.0:${PORT}`)
})