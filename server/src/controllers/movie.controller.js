import { prisma } from '../config/prisma.js'
import { logInfo, logError } from '../config/logger.js'
import axios from 'axios'

const TMDB_URL = 'https://api.themoviedb.org/3/movie/popular'

export const listMovies = async (req, res, next) => {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: { id: 'desc' }
    })
    // add counts
    const withStats = await Promise.all(movies.map(async m => {
      const likes = await prisma.reaction.count({ where: { movieId: m.id, type: 'LIKE' } })
      const dislikes = await prisma.reaction.count({ where: { movieId: m.id, type: 'DISLIKE' } })
      const comments = await prisma.comment.count({ where: { movieId: m.id } })
      return { ...m, stats: { likes, dislikes, comments } }
    }))
    res.json(withStats)
  } catch (e) {
    logError('LIST_MOVIES_ERROR', e.message)
    next(e)
  }
}

export const getMovie = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const movie = await prisma.movie.findUnique({ where: { id } })
    if (!movie) return res.status(404).json({ error: 'Not found' })
    const likes = await prisma.reaction.count({ where: { movieId: id, type: 'LIKE' } })
    const dislikes = await prisma.reaction.count({ where: { movieId: id, type: 'DISLIKE' } })
    const comments = await prisma.comment.count({ where: { movieId: id } })
    res.json({ ...movie, stats: { likes, dislikes, comments } })
  } catch (e) {
    logError('GET_MOVIE_ERROR', e.message)
    next(e)
  }
}

export const refreshMovies = async (req, res, next) => {
  try {
    const apiKey = process.env.TMDB_API_KEY
    const { data } = await axios.get(TMDB_URL, { params: { api_key: apiKey, language: 'en-US', page: 1 } })
    const items = (data.results || []).slice(0, 20)
    for (const it of items) {
      const externalId = String(it.id)
      const title = it.title
      const poster = it.poster_path ? `https://image.tmdb.org/t/p/w500${it.poster_path}` : null
      const description = it.overview || null
      await prisma.movie.upsert({
        where: { externalId },
        update: { title, poster, description },
        create: { externalId, title, poster, description }
      })
    }
    logInfo('REFRESH_MOVIES', `Refreshed ${items.length} movies`)
    res.json({ ok: true, count: items.length })
  } catch (e) {
    logError('REFRESH_MOVIES_ERROR', e.message)
    next(e)
  }
}
