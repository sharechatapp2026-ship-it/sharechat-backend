import bcrypt from 'bcrypt'
import prisma from '../config/database.js'

export const register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body
    
    // Check if user exists
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
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        fullName
      }
    })
    
    res.status(201).json({
      message: 'Account created successfully',
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
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash)
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    res.json({
      message: 'Login successful',
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