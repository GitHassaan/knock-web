import React from 'react'
import useSWR from 'swr'
import axios from 'axios'
import { useCart } from '../../../lib/store/cart'

const fetcher = (url: string) => axios.get(url).then(r=>r.data)

export default function ProductPage({ params }: any) {
  const { slug } = params
  const { data } = useSWR(`/api/products/${slug}`, fetcher)
  const cart = useCart()
  const p = data
  if (!p) return <div className="p-8">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <img src={p.gallery?.[0] || '/placeholder.png'} alt={p.title} className="max-h-80" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">{p.title}</h1>
          <p className="text-xl text-primary mb-4">Rs. {p.price}</p>
          <p className="text-gray-600 mb-4">{p.description || 'Delicious product.'}</p>
          <p className="mb-4">Stock: {p.stock}</p>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-primary text-white rounded" onClick={()=>cart.add({ productId: p._id, title: p.title, price: p.price, qty:1 })}>Add to Cart</button>
            <a href="/cart" className="px-4 py-2 border rounded">Go to Cart</a>
          </div>
        </div>
      </div>
    </div>
  )
}
