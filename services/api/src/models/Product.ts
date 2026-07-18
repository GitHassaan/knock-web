import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  title: string
  slug: string
  description?: string
  price: number
  salePrice?: number
  stock: number
  gallery: string[]
  categories: string[]
  featured?: boolean
}

const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  stock: { type: Number, default: 0 },
  gallery: { type: [String], default: [] },
  categories: { type: [String], default: [] },
  featured: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)
