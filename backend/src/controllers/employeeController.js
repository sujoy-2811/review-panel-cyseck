import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import prisma from '../db.js'
import { sendWelcomeEmail } from '../lib/mailer.js'

export async function getAll(req, res) {
  const employees = await prisma.employee.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true, email: true, department: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })
  res.json(employees)
}

export async function create(req, res) {
  const { name, email, password, department, role } = req.body

  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Invalid email address' })

  const exists = await prisma.employee.findUnique({ where: { email } })
  if (exists && !exists.deletedAt) return res.status(409).json({ message: 'Email already in use' })
  if (exists && exists.deletedAt) return res.status(409).json({ message: 'This email belongs to a deleted account and cannot be reused' })

  const passwordHash = await bcrypt.hash(password, 10)

  const employee = await prisma.employee.create({
    data: { name, email, passwordHash, department, role: role || 'employee' },
    select: { id: true, name: true, email: true, department: true, role: true, createdAt: true },
  })

  // generate password reset token and send welcome email
  const token = crypto.randomBytes(32).toString('hex')
  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  })

  sendWelcomeEmail({ name, email, token })

  res.status(201).json(employee)
}

export async function remove(req, res) {
  const employee = await prisma.employee.findUnique({ where: { id: req.params.id } })
  if (!employee || employee.deletedAt) return res.status(404).json({ message: 'Employee not found' })

  await prisma.$transaction([
    // remove their pending assignments so review totals stay accurate
    prisma.reviewAssignment.deleteMany({
      where: { participantId: req.params.id, status: 'pending' },
    }),
    prisma.employee.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date() },
    }),
  ])

  res.json({ message: 'Employee deleted' })
}
