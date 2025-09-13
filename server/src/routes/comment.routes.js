import { Router } from 'express'
import { authRequired } from '../middlewares/auth.js'
import { addComment, updateComment, deleteComment, listComments } from '../controllers/comment.controller.js'

const router = Router()

router.get('/movie/:movieId', listComments)
router.post('/movie/:movieId', authRequired, addComment)
router.put('/:id', authRequired, updateComment)
router.delete('/:id', authRequired, deleteComment)

export default router
