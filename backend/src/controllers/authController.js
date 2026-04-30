import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../db.js'

export async function login(req, res) {
  const { email, password } = req.body

  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' })

  const employee = await prisma.employee.findUnique({ where: { email } })
  if (!employee || employee.deletedAt) return res.status(401).json({ message: 'Invalid credentials' })

  const valid = await bcrypt.compare(password, employee.passwordHash)
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

  const token = jwt.sign(
    { id: employee.id, role: employee.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  const { passwordHash, ...user } = employee
  res.json({ token, user })
}
