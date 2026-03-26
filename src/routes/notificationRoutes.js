import express from 'express'
import { authenticate } from '../middleware/authMiddleware.js'
import { getNotifications, markAsRead, markAllAsRead, registerPushToken } from '../controllers/notificationController.js'
import { notifyNewFollower } from '../services/notificationService.js'

const router = express.Router()

router.get('/', authenticate, getNotifications)
router.put('/:id/read', authenticate, markAsRead)
router.put('/read-all', authenticate, markAllAsRead)
router.post('/register-token', authenticate, registerPushToken)

router.post('/test-follow', authenticate, async (req, res) => {
  const result = await notifyNewFollower(req.userId, 'Test User')
  res.json({ message: 'Test notification sent', result })
})

export default router