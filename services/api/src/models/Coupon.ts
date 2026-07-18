import mongoose, { Schema, Document } from 'mongoose'

export interface ICoupon extends Document {
  code: string
  discountType: 'amount' | 'percent'
  amount: number
  minOrderValue?: number
  expiresAt?: Date
  active: boolean
}

const CouponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['amount','percent'], default: 'amount' },
  amount: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  expiresAt: { type: Date },
  active: { type: Boolean, default: true }
}, { timestamps: true })

export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema)
