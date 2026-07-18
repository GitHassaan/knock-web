import React, { useState } from 'react'
import axios from 'axios'
import { useCart } from '../../lib/store/cart'

export default function CheckoutPage() {
  const cart = useCart()
  const [orderType, setOrderType] = useState<'shop'|'custom_pickup'>('shop')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<any>(null)

  const handlePlace = async () => {
    setLoading(true)
    try {
      const items = cart.items.map(i=>({ productId: i.productId, qty: i.qty }))
      const res = await axios.post('/api/checkout', { items, orderType })
      setMessage(res.data)
      cart.clear()
    } catch (e:any) {
      setMessage({ error: e.response?.data?.error || 'Failed' })
    } finally { setLoading(false) }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="mb-4">
        <label className="mr-3"><input type="radio" checked={orderType==='shop'} onChange={()=>setOrderType('shop')} /> Shop Order</label>
        <label className="ml-4"><input type="radio" checked={orderType==='custom_pickup'} onChange={()=>setOrderType('custom_pickup')} /> Custom Pickup</label>
      </div>
      <div className="p-4 bg-white rounded mb-4">
        <div>Items: {cart.items.length}</div>
        <div>Subtotal: Rs. {cart.subtotal()}</div>
      </div>
      <button onClick={handlePlace} disabled={loading} className="px-4 py-2 bg-primary text-white rounded">{loading ? 'Placing...' : 'Place Order'}</button>

      {message && (
        <div className="mt-6 p-4 bg-green-50 border rounded">
          {message.freeMessage ? <div className="text-green-700">{message.freeMessage}</div> : null}
          <div className="mt-2">Order ID: {message.order?._id}</div>
          <div>Total: Rs. {message.order?.total}</div>
        </div>
      )}
    </div>
  )
}
