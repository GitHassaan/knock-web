import React from 'react'

export default function ProductCard({ product, onAdd }: any) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm">
      <div className="h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
        <img src={product.gallery?.[0] || '/placeholder.png'} alt={product.title} className="max-h-36" />
      </div>
      <h3 className="font-medium">{product.title}</h3>
      <p className="text-sm text-gray-500">Rs. {product.price}</p>
      <div className="mt-3 flex gap-2">
        <button className="px-3 py-1 rounded bg-primary text-white" onClick={() => onAdd(product)}>Add</button>
        <a href={`/product/${product.slug}`} className="px-3 py-1 rounded border">View</a>
      </div>
    </div>
  )
}
