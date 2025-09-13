import jwt from 'jsonwebtoken'

export const authRequired = (req, res, next) => {
  const header = req.headers.authorization || ''
  const [prefix, token] = header.split(' ')
  if (prefix !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
