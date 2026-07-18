// Simple delivery helpers (placeholder)

export function calculateByDistanceKm(distanceKm: number) {
  // Simple slab pricing example: first 3km = 100, then 20 per km
  if (!distanceKm || distanceKm <= 3) return 100
  return Math.round(100 + (distanceKm - 3) * 20)
}
