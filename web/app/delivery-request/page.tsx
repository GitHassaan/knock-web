import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { createDeliveryRequest } from '../../lib/api/delivery'

export default function DeliveryRequestPage() {
  const [pickupAddr, setPickupAddr] = useState('')
  const [dropAddr, setDropAddr] = useState('')
  const [pickupLat, setPickupLat] = useState(0)
  const [pickupLng, setPickupLng] = useState(0)
  const [dropLat, setDropLat] = useState(0)
  const [dropLng, setDropLng] = useState(0)
  const [shopName, setShopName] = useState('')
  const [notes, setNotes] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [previewImgs, setPreviewImgs] = useState<string[]>([])
  const [distance, setDistance] = useState<number | null>(null)
  const [fee, setFee] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  // Simple file to dataURL conversion
  const handleFiles = (fList: FileList | null) => {
    if (!fList) return
    const arr = Array.from(fList)
    setFiles(arr)
    arr.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewImgs(prev => [...prev, String(reader.result)])
      }
      reader.readAsDataURL(file)
    })
  }

  const estimate = async () => {
    // lightweight client-side estimate using Haversine
    if (!pickupLat || !dropLat) return
    const R = 6371
    const dLat = (dropLat - pickupLat) * Math.PI/180
    const dLon = (dropLng - pickupLng) * Math.PI/180
    const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(pickupLat * Math.PI/180)*Math.cos(dropLat * Math.PI/180) * Math.sin(dLon/2)*Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const d = R * c
    setDistance(Math.round(d*100)/100)
    // client-side sample fee same formula as server
    const feeCalc = d <= 3 ? 100 : Math.round(100 + (d-3)*20)
    setFee(feeCalc)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // convert files to data URLs (we already did previews, so use those)
      const images = previewImgs
      const payload = {
        pickup: { lat: pickupLat, lng: pickupLng, address: pickupAddr },
        drop: { lat: dropLat, lng: dropLng, address: dropAddr },
        shopName, notes, images
      }
      const res = await createDeliveryRequest(payload)
      setResult(res.request)
    } catch (e:any) {
      console.error(e)
      alert(e?.response?.data?.error || 'Failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Request a Delivery / Pickup</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block">Pickup address</label>
          <input className="p-3 border rounded w-full" value={pickupAddr} onChange={e=>setPickupAddr(e.target.value)} placeholder="Enter pickup address" />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input className="p-2 border rounded" placeholder="lat" value={pickupLat||''} onChange={e=>setPickupLat(parseFloat(e.target.value)||0)} />
            <input className="p-2 border rounded" placeholder="lng" value={pickupLng||''} onChange={e=>setPickupLng(parseFloat(e.target.value)||0)} />
          </div>

          <label className="block mt-4">Drop address</label>
          <input className="p-3 border rounded w-full" value={dropAddr} onChange={e=>setDropAddr(e.target.value)} placeholder="Enter drop address" />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input className="p-2 border rounded" placeholder="lat" value={dropLat||''} onChange={e=>setDropLat(parseFloat(e.target.value)||0)} />
            <input className="p-2 border rounded" placeholder="lng" value={dropLng||''} onChange={e=>setDropLng(parseFloat(e.target.value)||0)} />
          </div>

          <label className="block mt-4">Shop name (optional)</label>
          <input className="p-3 border rounded w-full" value={shopName} onChange={e=>setShopName(e.target.value)} />

          <label className="block mt-4">Notes (optional)</label>
          <textarea className="p-3 border rounded w-full" value={notes} onChange={e=>setNotes(e.target.value)} />

          <label className="block mt-4">Images (optional)</label>
          <input type="file" multiple onChange={e=>handleFiles(e.target.files)} />
          <div className="flex gap-2 mt-2">
            {previewImgs.map((s,i)=> <img key={i} src={s} className="w-24 h-24 object-cover rounded" />)}
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={estimate} className="px-4 py-2 bg-primary text-white rounded">Estimate</button>
            <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 border rounded">{loading? 'Placing...' : 'Place Request'}</button>
          </div>

          {distance !== null && <div className="mt-4">Estimated distance: {distance} km — Estimated fee: Rs. {fee}</div>}
        </div>

        <div>
          <div className="p-4 bg-white rounded shadow">Map / preview (loads if Google Maps key provided)</div>
          <div className="mt-4 p-4 bg-white rounded">
            <h3 className="font-medium mb-2">How it works</h3>
            <ol className="list-decimal ml-6 text-sm text-gray-600">
              <li>Enter pickup and drop locations</li>
              <li>Upload images or notes</li>
              <li>Estimate distance and fee</li>
              <li>Place request and we will assign a rider</li>
            </ol>
          </div>
        </div>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-green-50 rounded">
          <div className="font-semibold">Request placed — ID: {result._id}</div>
          <div>Status: {result.status}</div>
          <div>Distance: {result.distanceKm} km</div>
          <div>Delivery Fee: Rs. {result.deliveryFee}</div>
        </div>
      )}
    </div>
  )
}
