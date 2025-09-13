import { prisma } from '../config/prisma.js'
import { logInfo, logError } from '../config/logger.js'

export const reactToMovie = async (req, res, next) => {
  try {
    const movieId = Number(req.params.movieId)
    const { type } = req.body // 'LIKE' or 'DISLIKE'
    if (!['LIKE', 'DISLIKE'].includes(type)) return res.status(400).json({ error: 'Invalid type' })

    const existing = await prisma.reaction.findUnique({
      where: { userId_movieId: { userId: req.user.id, movieId } }
    })

    let reaction
    if (!existing) {
      reaction = await prisma.reaction.create({ data: { userId: req.user.id, movieId, type } })
    } else if (existing.type === type) {
      // toggle off if same reaction clicked again
      await prisma.reaction.delete({ where: { id: existing.id } })
      reaction = null
    } else {
      reaction = await prisma.reaction.update({ where: { id: existing.id }, data: { type } })
    }

    const likes = await prisma.reaction.count({ where: { movieId, type: 'LIKE' } })
    const dislikes = await prisma.reaction.count({ where: { movieId, type: 'DISLIKE' } })

    logInfo('REACTION', `User ${req.user.username} -> ${type} movie ${movieId}`)
    res.json({ reaction, stats: { likes, dislikes } })
  } catch (e) {
    logError('REACTION_ERROR', e.message)
    next(e)
  }
}
