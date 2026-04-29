import app from './app.js'
import prisma from './src/db.js'
import bcrypt from 'bcryptjs'

const PORT = process.env.PORT || 3000

async function seedAdmin() {
  const existing = await prisma.employee.findUnique({
    where: { email: 'admin@admin.com' },
  })

  if (existing) return

  const hash = await bcrypt.hash('admin', 10)

  await prisma.employee.create({
    data: {
      name: 'admin',
      email: 'admin@admin.com',
      passwordHash: hash,
      role: 'admin',
    },
  })

  console.log('default admin created')
}

async function start() {
  await prisma.$connect()
  console.log('database connected')

  await seedAdmin()

  app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
  })
}

start().catch((err) => {
  console.error('failed to start:', err)
  process.exit(1)
})
