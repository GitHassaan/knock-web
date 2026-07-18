import React from 'react'
import { useCart } from '../../lib/store/cart'

export default function CartPage() {
  const cart = useCart()
  const items = cart.items
  const subtotal = cart.subtotal()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {items.length === 0 ? (
        <div>No items. <a href="/shop" className="text-primary">Continue shopping</a></div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {items.map(i => (
              <div key={i.productId} className="p-4 bg-white rounded mb-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">{i.title}</div>
                  <div className="text-sm text-gray-500">Rs. {i.price}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>cart.updateQty(i.productId, Math.max(1, i.qty-1))} className="px-2">-</button>
                  <div>{i.qty}</div>
                  <button onClick={()=>cart.updateQty(i.productId, i.qty+1)} className="px-2">+</button>
                  <button onClick={()=>cart.remove(i.productId)} className="text-red-500">Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white rounded">
            <div className="mb-2">Subtotal: Rs. {subtotal}</div>
            <div className="mb-4">Delivery: calculated at checkout</div>
            <a href="/checkout" className="block text-center px-4 py-2 bg-primary text-white rounded">Proceed to Checkout</a>
          </div>
        </div>
      )}
    </div>
  )
}
