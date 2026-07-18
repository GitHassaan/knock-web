import axios from 'axios'

export async function uploadImageToServer(fileDataUrl: string) {
  // This client helper posts base64 data URL to the server; server will attempt to upload to Cloudinary if configured
  const res = await axios.post('/api/uploads/base64', { dataUrl: fileDataUrl })
  return res.data
}

export async function createDeliveryRequest(payload: any) {
  const res = await axios.post('/api/delivery-requests', payload)
  return res.data
}
