import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

// POST /api/uploads/base64 { dataUrl }
// If Cloudinary configured, upload there, otherwise echo back the data URL as a fallback
router.post('/base64', async (req, res) => {
  try {
    const { dataUrl } = req.body
    if (!dataUrl) return res.status(400).json({ error: 'Missing dataUrl' })

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (cloudName && apiKey && apiSecret) {
      // Use unsigned upload endpoint or server-side upload via API
      // Simple approach: use Cloudinary upload API via axios
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      // For production, use signed uploads. Here we attempt unsigned with upload_preset env if provided.
      const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET
      const payload: any = { file: dataUrl }
      if (uploadPreset) payload.upload_preset = uploadPreset

      const resp = await axios.post(url, payload)
      return res.json({ url: resp.data.secure_url })
    }

    // Fallback: return dataUrl (not ideal for production but works for demo)
    return res.json({ url: dataUrl })
  } catch (err: any) {
    console.error(err?.response?.data || err.message)
    res.status(500).json({ error: 'Upload failed' })
  }
})

export default router
