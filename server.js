import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './src/routes/authRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
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