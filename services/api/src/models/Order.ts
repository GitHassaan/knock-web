import mongoose, { Schema, Document } from 'mongoose'

export type OrderStatus = 'received'|'preparing'|'picked_up'|'on_the_way'|'delivered'|'cancelled'

export interface IOrderItem {
  productId: mongoose.Types.ObjectId
  title: string
  price: number
  qty: number
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId
  items: IOrderItem[]
  subtotal: number
  tax: number
  deliveryFee: number
  total: number
  orderType: 'shop'|'custom_pickup'
  status: OrderStatus
  timeline: { status: OrderStatus, ts: Date }[]
}

const OrderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ productId: Schema.Types.ObjectId, title: String, price: Number, qty: Number }],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  orderType: { type: String, enum: ['shop','custom_pickup'], default: 'shop' },
  status: { type: String, default: 'received' },
  timeline: [{ status: String, ts: Date }]
}, { timestamps: true })

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)
