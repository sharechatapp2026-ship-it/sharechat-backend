import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './src/routes/authRoutes.js'

import notificationRoutes from './src/routes/notificationRoutes.js'
app.use('/api/notifications', notificationRoutes)

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())

//=============
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// بعد middleware أضف:
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

//===========
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'ShareChat API يعمل 🚀' })
})

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    time: new Date().toLocaleString('ar-EG')
  })
})

app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على: http://localhost:${PORT}`)
  console.log(`📋 اختبر الاتصال: http://localhost:${PORT}/health`)
})