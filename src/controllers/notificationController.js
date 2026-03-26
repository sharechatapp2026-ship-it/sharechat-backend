import prisma from '../config/database.js'

export const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    res.json({ notifications })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

export const markAsRead = async (req, res) => {
  try {
    await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true }
    })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

export const markAllAsRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.userId, isRead: false },
      data: { isRead: true }
    })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

export const registerPushToken = async (req, res) => {
  try {
    const { token, deviceType } = req.body
    await prisma.pushToken.upsert({
      where: { token },
      update: { userId: req.userId, deviceType, lastUsed: new Date() },
      create: { userId: req.userId, token, deviceType }
    })
    res.json({ message: 'Token registered' })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}