import { Request, Response, NextFunction } from 'express'
import { verifyAccess } from '../utils/jwt'

export function requireAuth(req: any, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'Unauthorized' })
  const parts = auth.split(' ')
  if (parts.length !== 2) return res.status(401).json({ error: 'Unauthorized' })
  const token = parts[1]
  const payload = verifyAccess(token)
  if (!payload) return res.status(401).json({ error: 'Invalid token' })
  // attach user info
  req.user = payload
  next()
}

export function requireRole(role: string) {
  return (req: any, res: Response, next: NextFunction) => {
    const user = req.user
    if (!user) return res.status(401).json({ error: 'Unauthorized' })
    if ((user as any).role !== role) return res.status(403).json({ error: 'Forbidden' })
    next()
  }
}
