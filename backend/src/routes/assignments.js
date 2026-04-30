import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getMine, submitFeedback, updateFeedback, deleteFeedback } from '../controllers/assignmentController.js'

const router = Router()

router.use(requireAuth)

router.get('/my', getMine)
router.post('/:id/feedback', submitFeedback)
router.put('/:id/feedback', updateFeedback)
router.delete('/:id/feedback', deleteFeedback)

export default router
