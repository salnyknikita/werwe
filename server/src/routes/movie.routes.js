import { Router } from 'express'
import { authRequired } from '../middlewares/auth.js'
import { listMovies, getMovie, refreshMovies } from '../controllers/movie.controller.js'

const router = Router()

router.get('/', listMovies)
router.get('/:id', getMovie)
router.post('/refresh', authRequired, refreshMovies)

export default router
