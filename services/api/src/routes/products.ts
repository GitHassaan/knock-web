import express from 'express'
import Product from '../models/Product'

const router = express.Router()

// GET /api/products?q=&category=&minPrice=&maxPrice=&page=&limit=
router.get('/', async (req, res) => {
  try {
    const q = (req.query.q as string) || ''
    const category = (req.query.category as string) || ''
    const minPrice = parseFloat((req.query.minPrice as string) || '0')
    const maxPrice = parseFloat((req.query.maxPrice as string) || '0')
    const page = parseInt((req.query.page as string) || '1')
    const limit = parseInt((req.query.limit as string) || '12')

    const filter: any = {}
    if (q) filter.$text = { $search: q }
    if (category) filter.categories = category
    if (minPrice) filter.price = { ...(filter.price || {}), $gte: minPrice }
    if (maxPrice) filter.price = { ...(filter.price || {}), $lte: maxPrice }

    const skip = (page - 1) * limit
    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter)
    ])

    res.json({ products, total, page, limit })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/products/:slug
router.get('/:slug', async (req, res) => {
  try {
    const slug = req.params.slug
    const product = await Product.findOne({ slug }).lean()
    if (!product) return res.status(404).json({ error: 'Not found' })
    res.json(product)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
