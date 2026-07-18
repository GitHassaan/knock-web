import mongoose, { Schema, Document } from 'mongoose'

export interface IRefreshToken extends Document {
  tokenHash: string
  userId: mongoose.Types.ObjectId
  expiresAt: Date
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
  tokenHash: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true })

export default mongoose.models.RefreshToken || mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema)
