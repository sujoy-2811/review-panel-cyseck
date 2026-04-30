import express from 'express'
import cors from 'cors'

import authRoutes from './src/routes/auth.js'
import employeeRoutes from './src/routes/employees.js'
import reviewRoutes from './src/routes/reviews.js'
import assignmentRoutes from './src/routes/assignments.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/employees', employeeRoutes)
app.use('/reviews', reviewRoutes)
app.use('/assignments', assignmentRoutes)

app.get('/', (req, res) => res.json({ status: 'ok' }))

export default app
