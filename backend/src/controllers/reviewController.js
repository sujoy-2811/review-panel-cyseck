import prisma from '../db.js'

export async function getAll(req, res) {
  const reviews = await prisma.performanceReview.findMany({
    include: {
      employee: { select: { id: true, name: true } },
      assignments: {
        where: { participant: { deletedAt: null } },
        select: { participantId: true, status: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const result = reviews.map(r => ({
    ...r,
    feedbackGiven: r.assignments.filter(a => a.status === 'submitted').length,
    totalFeedback: r.assignments.length,
  }))

  res.json(result)
}

export async function getMine(req, res) {
  const reviews = await prisma.performanceReview.findMany({
    where: { employeeId: req.user.id },
    include: {
      assignments: {
        where: { status: 'submitted' },
        select: { comment: true, rating: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const result = reviews.map(r => ({
    ...r,
    feedbackGiven: r.assignments.length,
  }))

  res.json(result)
}

export async function create(req, res) {
  const { employeeId, title, period } = req.body

  if (!employeeId || !title || !period) return res.status(400).json({ message: 'employeeId, title and period are required' })

  const review = await prisma.performanceReview.create({
    data: { employeeId, title, period, createdById: req.user.id },
    include: { employee: { select: { id: true, name: true } } },
  })

  res.status(201).json({ ...review, feedbackGiven: 0, totalFeedback: 0 })
}

export async function assignReviewers(req, res) {
  const { participantIds } = req.body
  if (!participantIds?.length) return res.status(400).json({ message: 'participantIds are required' })

  const review = await prisma.performanceReview.findUnique({ where: { id: req.params.id } })
  if (!review) return res.status(404).json({ message: 'Review not found' })

  await Promise.all(
    participantIds.map(participantId =>
      prisma.reviewAssignment.upsert({
        where: { reviewId_participantId: { reviewId: review.id, participantId } },
        update: {},
        create: { reviewId: review.id, participantId },
      })
    )
  )

  res.json({ message: 'Reviewers assigned' })
}

export async function getFeedback(req, res) {
  const assignments = await prisma.reviewAssignment.findMany({
    where: { reviewId: req.params.id, status: 'submitted' },
    select: {
      comment: true,
      rating: true,
      participant: { select: { name: true, department: true } },
    },
  })
  res.json(assignments)
}
