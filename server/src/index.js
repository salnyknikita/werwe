import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { logger } from './src/config/logger.js'
import { prisma } from './src/config/prisma.js'
import authRoutes from './src/routes/auth.routes.js'
import movieRoutes from './src/routes/movie.routes.js'
import commentRoutes from './src/routes/comment.routes.js'
import reactionRoutes from './src/routes/reaction.routes.js'

const app = express()

const PORT = process.env.PORT || 4000
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*'
app.use(cors({ origin: CORS_ORIGIN, credentials: true }))
app.use(express.json())
app.use(morgan('dev'))

// Health & API availability
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Film Rating API is up', time: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/movies', movieRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/reactions', reactionRoutes)

// Error handler
app.use((err, req, res, next) => {
  logger.error(`[ERROR] ${err.message}`, { stack: err.stack })
  res.status(err.status || 500).json({ error: 'Server error', details: err.message })
})

app.listen(PORT, () => {
  logger.info(`API running on http://localhost:${PORT}`)
  console.log(`API available at http://localhost:${PORT}`)
})
