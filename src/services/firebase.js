import admin from 'firebase-admin'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  })
}

export const sendFCMNotification = async (token, title, body, data = {}) => {
  try {
    const message = {
      notification: { title, body },
      data: data,
      token: token,
      android: {
        priority: 'high',
        notification: { sound: 'default', channelId: 'default' }
      }
    }
    const response = await admin.messaging().send(message)
    console.log('✅ FCM notification sent:', response)
    return { success: true, response }
  } catch (error) {
    console.error('❌ FCM error:', error)
    return { success: false, error: error.message }
  }
}