import express from 'express'
import { register, login, getProfile, updateProfile, logout, sendVerification, verifyEmail, uploadProfilePicture, analyzeUserInterests } from '../controllers/authController.js'
import { authenticate } from '../middleware/authMiddleware.js'
import upload from '../middleware/upload.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/profile', authenticate, getProfile)
router.put('/profile', authenticate, updateProfile)
router.post('/logout', authenticate, logout)
router.post('/send-verification', sendVerification)
router.post('/verify-email', verifyEmail)
router.post('/upload-profile-picture', authenticate, upload.single('image'), uploadProfilePicture)
router.get('/analyze-interests', authenticate, analyzeUserInterests)

export default router