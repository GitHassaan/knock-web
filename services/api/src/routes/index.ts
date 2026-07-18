import express from 'express'
import authRouter from './routes/auth'
import productsRouter from './routes/products'
import couponsRouter from './routes/coupons'
import checkoutRouter from './routes/checkout'

export default function registerRoutes(app: express.Application) {
  app.use('/api/auth', authRouter)
  app.use('/api/products', productsRouter)
  app.use('/api/coupons', couponsRouter)
  app.use('/api/checkout', checkoutRouter)
}
