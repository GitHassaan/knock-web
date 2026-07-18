import React, { useState } from 'react'
import useSWR from 'swr'
import ProductCard from '../../components/ProductCard'
import axios from 'axios'
import { useCart } from '../../lib/store/cart'
import useDebounce from '../../hooks/use-debounce'

const fetcher = (url: string) => axios.get(url).then(r=>r.data)

export default function ShopPage() {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const debounced = useDebounce(q, 300)
  const { data } = useSWR(`/api/products?q=${encodeURIComponent(debounced)}&page=${page}`, fetcher)
  const cart = useCart()

  const products = data?.products || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 flex gap-3">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products..." className="flex-1 p-3 rounded-lg border" />
        <a href="/cart" className="px-4 py-3 bg-primary text-white rounded-lg">Cart ({cart.items.length})</a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p:any)=> (
          <ProductCard key={p._id} product={p} onAdd={(prod:any)=>cart.add({ productId: prod._id, title: prod.title, price: prod.price, qty: 1 })} />
        ))}
      </div>
    </div>
  )
}
