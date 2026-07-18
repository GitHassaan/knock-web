import mongoose, { Schema, Document } from 'mongoose'

export interface IDeliveryRequest extends Document {
  userId: mongoose.Types.ObjectId | null
  pickupLocation: any
  dropLocation: any
  shopName?: string
  notes?: string
  images: string[]
  distanceKm: number
  deliveryFee: number
  assignedRider?: mongoose.Types.ObjectId | null
  status: 'requested'|'assigned'|'picked_up'|'delivered'|'cancelled'
}

const DeliveryRequestSchema = new Schema<IDeliveryRequest>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  pickupLocation: { type: Object, required: true },
  dropLocation: { type: Object, required: true },
  shopName: { type: String },
  notes: { type: String },
  images: { type: [String], default: [] },
  distanceKm: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  assignedRider: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, default: 'requested' }
}, { timestamps: true })

export default mongoose.models.DeliveryRequest || mongoose.model<IDeliveryRequest>('DeliveryRequest', DeliveryRequestSchema)
