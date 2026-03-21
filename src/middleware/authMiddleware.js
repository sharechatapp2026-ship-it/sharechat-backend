import jwt from 'jsonwebtoken'
import prisma from '../config/database.js'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_this'

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }
    
    const token = authHeader.split(' ')[1]
    
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    })
    
    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }
    
    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { id: session.id } })
      return res.status(401).json({ error: 'Token expired' })
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      req.userId = decoded.userId
      req.user = session.user
      next()
    } catch (jwtError) {
      return res.status(401).json({ error: 'Invalid token' })
    }
    
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
}