import { Router } from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { getAll, create, remove } from '../controllers/employeeController.js'

const router = Router()

router.use(requireAuth, requireAdmin)

router.get('/', getAll)
router.post('/', create)
router.delete('/:id', remove)

export default router
