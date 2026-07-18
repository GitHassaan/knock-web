import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from '../models/Product'

dotenv.config()

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/knock-web')
  console.log('Connected')

  const products = [
    { title: 'Classic Pizza', slug: 'classic-pizza', price: 1200, stock: 20, gallery: [], categories: ['food'], featured: true },
    { title: 'Fresh Bread', slug: 'fresh-bread', price: 200, stock: 100, gallery: [], categories: ['bakery'] },
    { title: 'Cold Drink', slug: 'cold-drink', price: 150, stock: 50 }
  ]

  await Product.deleteMany({})
  await Product.insertMany(products)
  console.log('Seeded products')
  process.exit(0)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
