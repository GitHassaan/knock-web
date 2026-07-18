import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'

const router = express.Router()

// Register (very basic)
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Missing' })
  const existing = await User.findOne({ email })
  if (existing) return res.status(400).json({ error: 'User exists' })
  const hash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, passwordHash: hash })
  res.json({ id: user._id, email: user.email })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ error: 'Invalid' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid' })

  const access = jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET || 'secret', { expiresIn: '15m' })
  const refresh = jwt.sign({ sub: user._id }, process.env.JWT_REFRESH_SECRET || 'refresh', { expiresIn: '7d' })

  res.cookie('refresh', refresh, { httpOnly: true, secure: false })
  res.json({ access })
})

export default router
