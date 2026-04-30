import { Router } from 'express'
import { login, forgotPassword, validateResetToken, resetPassword } from '../controllers/authController.js'

const router = Router()

router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.get('/reset-password', validateResetToken)
router.post('/reset-password', resetPassword)

export default router
