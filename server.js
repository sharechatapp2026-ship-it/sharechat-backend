import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './src/routes/authRoutes.js'
import notificationRoutes from './src/routes/notificationRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

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

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/notifications', notificationRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'ShareChat API works 🚀' })
})

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    time: new Date().toLocaleString('ar-EG')
  })
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port: ${PORT}`)
})