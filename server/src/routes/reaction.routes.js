import { Router } from 'express'
import { authRequired } from '../middlewares/auth.js'
import { reactToMovie } from '../controllers/reaction.controller.js'

const router = Router()

router.post('/movie/:movieId', authRequired, reactToMovie)

export default router
