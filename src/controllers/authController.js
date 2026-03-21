import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../config/database.js'

import { sendVerificationEmail, generateCode } from '../utils/emailService.js'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_this'
const JWT_EXPIRES_IN = '7d'

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export const register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body
    
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    })
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Email or username already exists' 
      })
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        fullName
      }
    })
    
    const token = generateToken(user.id)
    
    await prisma.session.create({
      data: {
        userId: user.id,
        token: token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })
    
    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName
      }
    })
    
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error occurred' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    const isValid = await bcrypt.compare(password, user.passwordHash)
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    const token = generateToken(user.id)
    
    await prisma.session.create({
      data: {
        userId: user.id,
        token: token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName
      }
    })
    
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error occurred' })
  }
}

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        profilePicture: true,
        bio: true,
        createdAt: true
      }
    })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json({ user })
    
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }}
  export const updateProfile = async (req, res) => {
    try {
      const { fullName, profilePicture, bio, birthYear, gender, interests, displayStyle, workField, educationLevel, country, city } = req.body
      
      const user = await prisma.user.update({
        where: { id: req.userId },
        data: {
          fullName,
          profilePicture,
          bio,
          birthYear: birthYear ? parseInt(birthYear) : null,
          gender,
          interests: interests || [],
          displayStyle,
          workField,
          educationLevel,
          country,
          city
        }
      })
      
      res.json({
        message: 'Profile updated successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          profilePicture: user.profilePicture,
          bio: user.bio,
          interests: user.interests,
          displayStyle: user.displayStyle
        }
      })
      
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Server error occurred' })
    }
  }
  export const logout = async (req, res) => {
    try {
      const authHeader = req.headers.authorization
      const token = authHeader.split(' ')[1]
      
      await prisma.session.deleteMany({
        where: { token: token }
      })
      
      res.json({ message: 'Logged out successfully' })
      
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Server error occurred' })
    }
  }

  




export const sendVerification = async (req, res) => {
  try {
    const { email } = req.body
    
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(404).json({ error: 'User not found' })
    if (user.emailVerified) return res.status(400).json({ error: 'Already verified' })
    
    await prisma.verification.deleteMany({
      where: { userId: user.id, type: 'email_verification' }
    })
    
    const code = generateCode()
    await prisma.verification.create({
      data: {
        userId: user.id,
        email: user.email,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        type: 'email_verification'
      }
    })
    
    const sent = await sendVerificationEmail(user.email, code)
    if (!sent) return res.status(500).json({ error: 'Failed to send email' })
    
    res.json({ message: 'Verification code sent' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
}

export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body
    
    const verification = await prisma.verification.findFirst({
      where: {
        email,
        code,
        type: 'email_verification',
        verifiedAt: null,
        expiresAt: { gt: new Date() }
      }
    })
    
    if (!verification) return res.status(400).json({ error: 'Invalid or expired code' })
    
    await prisma.user.update({
      where: { id: verification.userId },
      data: { emailVerified: true }
    })
    
    await prisma.verification.update({
      where: { id: verification.id },
      data: { verifiedAt: new Date() }
    })
    
    res.json({ message: 'Email verified successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
}

export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }
    
    const imageUrl = `/uploads/${req.file.filename}`
    
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { profilePicture: imageUrl }
    })
    
    res.json({
      message: 'Profile picture uploaded successfully',
      profilePicture: user.profilePicture
    })
    
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error occurred' })
  }
}
export const analyzeUserInterests = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { interests: true }
    })
    
    if (!user || !user.interests || user.interests.length === 0) {
      return res.status(400).json({ 
        error: 'No interests found. Please update your profile first.' 
      })
    }
    
    // تحليل بسيط بدون AI
    const analysis = {
      main_topic: user.interests[0] || 'General',
      intellectual_depth: Math.floor(Math.random() * 5) + 5,
      related_fields: ['Technology', 'Science', 'Philosophy'],
      recommendation: 'Explore content related to your interests for deeper insights.'
    }
    
    res.json({
      message: 'Analysis completed',
      interests: user.interests,
      analysis
    })
    
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error occurred' })
  }
}