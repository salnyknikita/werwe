import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/prisma.js'
import { logInfo, logError } from '../config/logger.js'

export const register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body
    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { email, username, password: hash } })
    logInfo('REGISTER', `User ${user.username} registered`)
    res.status(201).json({ id: user.id, email: user.email, username: user.username })
  } catch (e) {
    logError('REGISTER_ERROR', e.message)
    next(e)
  }
}

export const login = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: emailOrUsername }, { username: emailOrUsername }] }
    })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' })
    logInfo('LOGIN', `User ${user.username} logged in`)
    res.json({ token, user: { id: user.id, email: user.email, username: user.username } })
  } catch (e) {
    logError('LOGIN_ERROR', e.message)
    next(e)
  }
}
