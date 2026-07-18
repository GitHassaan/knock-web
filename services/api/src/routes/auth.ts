import express from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import User from '../models/User'
import RefreshToken from '../models/RefreshToken'
import { signAccess, verifyAccess } from '../utils/jwt'

const router = express.Router()

const REFRESH_EXPIRE_DAYS = 30

// Helper to create and store refresh token
async function createRefreshToken(userId: any) {
  const token = crypto.randomBytes(64).toString('hex')
  const hash = await bcrypt.hash(token, 10)
  const expiresAt = new Date(Date.now() + REFRESH_EXPIRE_DAYS * 24 * 60 * 60 * 1000)
  await RefreshToken.create({ tokenHash: hash, userId, expiresAt })
  return { token, expiresAt }
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' })
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ error: 'User exists' })
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash: hash })
    res.json({ id: user._id, email: user.email })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

    const access = signAccess({ sub: user._id, role: user.role })
    const { token, expiresAt } = await createRefreshToken(user._id)

    // Set httpOnly cookie
    res.cookie('refreshToken', token, { httpOnly: true, secure: false, sameSite: 'lax', path: '/', expires: expiresAt })
    res.json({ access, user: { id: user._id, email: user.email, name: user.name, role: user.role } })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.refreshToken
    if (!token) return res.status(401).json({ error: 'Missing refresh token' })

    // Find candidate tokens for user by scanning collection (we store hashes), so we need to try matches — but better to query by user via an attached claim; here we'll iterate recent tokens
    const tokens = await RefreshToken.find({ expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 }).limit(100)
    let matched: any = null
    for (const t of tokens) {
      const ok = await bcrypt.compare(token, t.tokenHash)
      if (ok) { matched = t; break }
    }

    if (!matched) return res.status(401).json({ error: 'Invalid refresh token' })

    const user = await User.findById(matched.userId)
    if (!user) return res.status(401).json({ error: 'Invalid token user' })

    // Rotate refresh token: delete old, create new
    await RefreshToken.findByIdAndDelete(matched._id)
    const { token: newToken, expiresAt } = await createRefreshToken(user._id)
    const access = signAccess({ sub: user._id, role: user.role })
    res.cookie('refreshToken', newToken, { httpOnly: true, secure: false, sameSite: 'lax', path: '/', expires: expiresAt })
    res.json({ access, user: { id: user._id, email: user.email, name: user.name, role: user.role } })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies?.refreshToken
    if (token) {
      // delete matching hashed token(s)
      const tokens = await RefreshToken.find()
      for (const t of tokens) {
        const ok = await bcrypt.compare(token, t.tokenHash)
        if (ok) await RefreshToken.findByIdAndDelete(t._id)
      }
    }
    res.clearCookie('refreshToken', { path: '/' })
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
