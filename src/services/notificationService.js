import prisma from '../config/database.js'
import { sendFCMNotification } from './firebase.js'


export async function sendPushNotification(userId, title, body, data = {}) {
  try {
    const tokens = await prisma.pushToken.findMany({ where: { userId } })
    if (tokens.length === 0) return { success: false, message: 'No tokens' }

    const notification = await prisma.notification.create({
      data: { userId, type: data.type || 'general', title, body, data }
    })

    for (const tokenObj of tokens) {
      await sendFCMNotification(tokenObj.token, title, body, { notificationId: notification.id, ...data })
    }
    return { success: true, notification }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: error.message }
  }
}

export async function notifyNewFollower(userId, followerName) {
  return sendPushNotification(userId, 'New Follower', `${followerName} started following you`, { type: 'follow' })
}