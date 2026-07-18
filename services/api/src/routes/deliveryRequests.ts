import express from 'express'
import DeliveryRequest from '../models/DeliveryRequest'
import { getDistanceKm } from '../utils/directions'
import { calculateByDistanceKm } from '../utils/delivery'

const router = express.Router()

// POST /api/delivery-requests
// body: { userId?, pickup: { lat, lng, address }, drop: { lat, lng, address }, shopName?, notes?, images?: [dataUrl|string] }
router.post('/', async (req, res) => {
  try {
    const { userId, pickup, drop, shopName, notes, images } = req.body
    if (!pickup || !drop) return res.status(400).json({ error: 'Missing pickup or drop location' })

    // Compute distance (km) using Directions API or haversine fallback
    const distanceKm = await getDistanceKm(pickup, drop)
    const deliveryFee = calculateByDistanceKm(distanceKm)

    const doc = await DeliveryRequest.create({
      userId: userId || null,
      pickupLocation: pickup,
      dropLocation: drop,
      shopName: shopName || null,
      notes: notes || null,
      images: Array.isArray(images) ? images : [],
      distanceKm,
      deliveryFee,
      status: 'requested'
    })

    // Emit socket event
    try {
      const io = req.app.get('io')
      if (io) io.emit('deliveryRequest:new', { id: doc._id, status: doc.status })
    } catch (e) { /* noop */ }

    res.json({ ok: true, request: doc })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/delivery-requests/:id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const d = await DeliveryRequest.findById(id)
    if (!d) return res.status(404).json({ error: 'Not found' })
    res.json(d)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/delivery-requests (admin list) - simple
router.get('/', async (req, res) => {
  try {
    const list = await DeliveryRequest.find().sort({ createdAt: -1 }).limit(200)
    res.json(list)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
