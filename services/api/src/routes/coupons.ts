import express from 'express'
import Coupon from '../models/Coupon'

const router = express.Router()

// POST /api/coupons/validate { code, subtotal }
router.post('/validate', async (req, res) => {
  try {
    const { code, subtotal } = req.body
    if (!code) return res.status(400).json({ valid: false, error: 'Missing code' })
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true })
    if (!coupon) return res.status(404).json({ valid: false, error: 'Invalid coupon' })

    if (coupon.expiresAt && coupon.expiresAt < new Date()) return res.status(400).json({ valid: false, error: 'Coupon expired' })
    if (subtotal < (coupon.minOrderValue || 0)) return res.status(400).json({ valid: false, error: `Minimum order value is Rs. ${coupon.minOrderValue}` })

    let discount = 0
    if (coupon.discountType === 'amount') discount = coupon.amount
    else discount = Math.round((subtotal * coupon.amount) / 100)

    res.json({ valid: true, discount, coupon: { code: coupon.code, discountType: coupon.discountType, amount: coupon.amount } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
