import jwt from 'jsonwebtoken'

export function signAccess(payload: object) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET || 'secret', { expiresIn: '15m' })
}

export function verifyAccess(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'secret')
  } catch (e) {
    return null
  }
}
