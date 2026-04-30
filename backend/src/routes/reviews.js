import { Router } from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { getAll, getMine, create, assignReviewers, getFeedback } from '../controllers/reviewController.js'

const router = Router()

router.use(requireAuth)

router.get('/my', getMine)
router.get('/', requireAdmin, getAll)
router.post('/', requireAdmin, create)
router.post('/:id/assign', requireAdmin, assignReviewers)
router.get('/:id/feedback', requireAdmin, getFeedback)

export default router
