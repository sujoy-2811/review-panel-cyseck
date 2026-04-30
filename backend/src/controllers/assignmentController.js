import prisma from '../db.js'

export async function getMine(req, res) {
  const assignments = await prisma.reviewAssignment.findMany({
    where: { participantId: req.user.id },
    include: {
      review: {
        include: { employee: { select: { id: true, name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  res.json(assignments)
}

export async function submitFeedback(req, res) {
  const { comment, rating } = req.body

  if (!comment || !rating) return res.status(400).json({ message: 'Comment and rating are required' })
  if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' })

  const assignment = await prisma.reviewAssignment.findUnique({ where: { id: req.params.id } })
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' })
  if (assignment.participantId !== req.user.id) return res.status(403).json({ message: 'Forbidden' })
  if (assignment.status === 'submitted') return res.status(409).json({ message: 'Feedback already submitted' })

  const updated = await prisma.reviewAssignment.update({
    where: { id: req.params.id },
    data: { comment, rating: Number(rating), status: 'submitted' },
  })

  res.json(updated)
}

export async function updateFeedback(req, res) {
  const { comment, rating } = req.body

  if (!comment || !rating) return res.status(400).json({ message: 'Comment and rating are required' })
  if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' })

  const assignment = await prisma.reviewAssignment.findUnique({ where: { id: req.params.id } })
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' })
  if (assignment.participantId !== req.user.id) return res.status(403).json({ message: 'Forbidden' })

  const updated = await prisma.reviewAssignment.update({
    where: { id: req.params.id },
    data: { comment, rating: Number(rating) },
  })

  res.json(updated)
}

export async function deleteFeedback(req, res) {
  const assignment = await prisma.reviewAssignment.findUnique({ where: { id: req.params.id } })
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' })
  if (assignment.participantId !== req.user.id) return res.status(403).json({ message: 'Forbidden' })

  await prisma.reviewAssignment.update({
    where: { id: req.params.id },
    data: { comment: null, rating: null, status: 'pending' },
  })

  res.json({ message: 'Feedback removed' })
}
