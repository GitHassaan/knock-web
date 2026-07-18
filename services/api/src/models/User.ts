import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  phone: string
  passwordHash: string
  role: 'customer'|'admin'|'rider'
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['customer','admin','rider'], default: 'customer' }
}, { timestamps: true })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
