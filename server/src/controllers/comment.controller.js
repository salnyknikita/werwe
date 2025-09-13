import { prisma } from '../config/prisma.js'
import { logInfo, logError } from '../config/logger.js'

export const listComments = async (req, res, next) => {
  try {
    const movieId = Number(req.params.movieId)
    const comments = await prisma.comment.findMany({
      where: { movieId },
      include: { user: { select: { id: true, username: true } } },
      orderBy: { createdAt: 'desc' }
    })
    res.json(comments)
  } catch (e) {
    logError('LIST_COMMENTS_ERROR', e.message)
    next(e)
  }
}

export const addComment = async (req, res, next) => {
  try {
    const movieId = Number(req.params.movieId)
    const { content } = req.body
    const comment = await prisma.comment.create({
      data: { content, movieId, userId: req.user.id },
      include: { user: { select: { id: true, username: true } } }
    })
    logInfo('COMMENT_ADD', `User ${req.user.username} commented movie ${movieId}`)
    res.status(201).json(comment)
  } catch (e) {
    logError('COMMENT_ADD_ERROR', e.message)
    next(e)
  }
}

export const updateComment = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const { content } = req.body
    const old = await prisma.comment.findUnique({ where: { id } })
    if (!old || old.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' })
    const updated = await prisma.comment.update({ where: { id }, data: { content } })
    logInfo('COMMENT_UPDATE', `User ${req.user.username} updated comment ${id}`)
    res.json(updated)
  } catch (e) {
    logError('COMMENT_UPDATE_ERROR', e.message)
    next(e)
  }
}

export const deleteComment = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const old = await prisma.comment.findUnique({ where: { id } })
    if (!old || old.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' })
    await prisma.comment.delete({ where: { id } })
    logInfo('COMMENT_DELETE', `User ${req.user.username} deleted comment ${id}`)
    res.json({ ok: true })
  } catch (e) {
    logError('COMMENT_DELETE_ERROR', e.message)
    next(e)
  }
}
