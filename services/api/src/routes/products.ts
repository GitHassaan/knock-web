import express from 'express'
import Product from '../models/Product'

const router = express.Router()

router.get('/', async (req, res) => {
  const products = await Product.find().limit(50)
  res.json(products)
})

export default router
