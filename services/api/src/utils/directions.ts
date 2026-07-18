import axios from 'axios'

// pickup/drop: { lat, lng, address }
export async function getDistanceKm(pickup: any, drop: any) {
  const key = process.env.GOOGLE_MAPS_API_KEY
  if (key) {
    try {
      const origin = `${pickup.lat},${pickup.lng}`
      const dest = `${drop.lat},${drop.lng}`
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&key=${key}`
      const resp = await axios.get(url)
      const data = resp.data
      if (data && data.routes && data.routes[0] && data.routes[0].legs && data.routes[0].legs[0] && data.routes[0].legs[0].distance) {
        const meters = data.routes[0].legs[0].distance.value
        return Math.round((meters/1000) * 100) / 100
      }
    } catch (e) {
      console.warn('Directions API failed, falling back', e.message)
    }
  }

  // Haversine fallback
  const R = 6371 // km
  const dLat = (drop.lat - pickup.lat) * Math.PI / 180
  const dLon = (drop.lng - pickup.lng) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(pickup.lat * Math.PI / 180) * Math.cos(drop.lat * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const d = R * c
  return Math.round(d * 100) / 100
}
