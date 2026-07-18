import express from 'express'
import Product from '../models/Product'
import Order from '../models/Order'
import Coupon from '../models/Coupon'
import { calculateByDistanceKm } from '../utils/delivery'

const router = express.Router()

// POST /api/checkout
/* body: {
  userId?, items: [{ productId, qty }], orderType: 'shop'|'custom_pickup', pickup/drop locations optional, couponCode?
}
*/
router.post('/', async (req, res) => {
  try {
    const { userId, items, orderType = 'shop', couponCode, distanceKm } = req.body
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items' })

    // Fetch product details and validate stock
    const productIds = items.map((i: any) => i.productId)
    const products = await Product.find({ _id: { $in: productIds } })
    const productMap: any = {}
    products.forEach(p => { productMap[p._id.toString()] = p })

    let subtotal = 0
    const orderItems: any[] = []

    for (const it of items) {
      const prod = productMap[it.productId]
      if (!prod) return res.status(400).json({ error: `Product ${it.productId} not found` })
      if (prod.stock < it.qty) return res.status(400).json({ error: `Insufficient stock for ${prod.title}` })
      const price = prod.salePrice || prod.price
      subtotal += price * it.qty
      orderItems.push({ productId: prod._id, title: prod.title, price, qty: it.qty })
    }

    // Tax (simple example)
    const tax = Math.round(subtotal * 0.0) // set to 0 for now

    // Delivery fee calculation according to business rule
    let deliveryFee = 0
    let freeDelivery = false
    let freeMessage = null

    if (orderType === 'shop') {
      if (subtotal >= 1500) {
        deliveryFee = 0
        freeDelivery = true
        freeMessage = "🎉 Congratulations! You've unlocked FREE Delivery on your shop order."
      } else {
        deliveryFee = 150 // base rate for shop orders under threshold
      }
    } else {
      // custom pickup - calculate by distance or fallback
      const d = typeof distanceKm === 'number' ? distanceKm : 0
      deliveryFee = calculateByDistanceKm(d)
    }

    // Apply coupon if provided
    let discount = 0
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true })
      if (coupon) {
        if (!coupon.expiresAt || coupon.expiresAt > new Date()) {
          if ((coupon.minOrderValue || 0) <= subtotal) {
            if (coupon.discountType === 'amount') discount = coupon.amount
            else discount = Math.round((subtotal * coupon.amount) / 100)
          }
        }
      }
    }

    const total = Math.max(0, subtotal + tax + deliveryFee - discount)

    // Create order
    const order = await Order.create({
      userId: userId || null,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      total,
      orderType,
      status: 'received',
      timeline: [{ status: 'received', ts: new Date() }]
    })

    // TODO: decrement stock in transaction in production

    // Emit via Socket.io if available (attached to req.app)
    try {
      const io = (req.app.get('io'))
      if (io) io.to(`order:${order._id}`).emit('order:update', { orderId: order._id, status: 'received' })
    } catch (e) { /* noop */ }

    res.json({ order, freeDelivery, freeMessage, discount })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
