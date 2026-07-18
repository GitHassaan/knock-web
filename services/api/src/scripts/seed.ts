// Add product text index creation in seed to improve search
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from '../models/Product'

dotenv.config()

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/knock-web')
  console.log('Connected')

  const products = [
    { title: 'Classic Pizza', slug: 'classic-pizza', price: 1200, stock: 20, gallery: [], categories: ['food'], featured: true, description: 'Cheesy classic pizza' },
    { title: 'Fresh Bread', slug: 'fresh-bread', price: 200, stock: 100, gallery: [], categories: ['bakery'], description: 'Baked fresh daily' },
    { title: 'Cold Drink', slug: 'cold-drink', price: 150, stock: 50, gallery: [], description: 'Refreshing beverage' },
    { title: 'Burger Combo', slug: 'burger-combo', price: 900, stock: 30, gallery: [], categories: ['food'], description: 'Burger with fries and drink' },
    { title: 'Gourmet Sandwich', slug: 'gourmet-sandwich', price: 350, stock: 40, gallery: [], categories: ['food'], description: 'Premium sandwich' }
  ]

  await Product.deleteMany({})
  await Product.insertMany(products)
  await Product.collection.createIndex({ title: 'text', description: 'text' })
  console.log('Seeded products and text index')
  process.exit(0)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
