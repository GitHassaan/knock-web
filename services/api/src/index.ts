import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/knock-web'
const PORT = process.env.PORT || 4000

async function start() {
  await mongoose.connect(MONGO)
  console.log('Mongo connected')

  const app = express()
  const server = http.createServer(app)
  const io = new Server(server, { cors: { origin: process.env.NEXT_PUBLIC_API_URL || '*' } })

  app.use(cors({ origin: process.env.NEXT_PUBLIC_API_URL || '*', credentials: true }))
  app.use(express.json())
  app.use(cookieParser())

  // Basic routes
  app.get('/api/health', (req, res) => res.json({ ok: true }))

  // Mount minimal routers (placeholders)
  // import and use routers when ready

  io.on('connection', (socket) => {
    console.log('socket connected', socket.id)

    socket.on('joinOrder', (orderId: string) => {
      socket.join(`order:${orderId}`)
    })

    socket.on('leaveOrder', (orderId: string) => {
      socket.leave(`order:${orderId}`)
    })
  })

  server.listen(PORT, () => console.log(`API server running on ${PORT}`))
}

start().catch(err => {
  console.error(err)
  process.exit(1)
})
