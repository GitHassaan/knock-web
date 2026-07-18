import create from 'zustand'
import { persist } from 'zustand/middleware'

type CartItem = { productId: string, title: string, price: number, qty: number }

type CartState = {
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clear: () => void
  subtotal: () => number
}

export const useCart = create<CartState>(persist((set, get) => ({
  items: [],
  add: (item) => set(state => {
    const found = state.items.find(i => i.productId === item.productId)
    if (found) return { items: state.items.map(i => i.productId === item.productId ? { ...i, qty: i.qty + item.qty } : i) }
    return { items: [...state.items, item] }
  }),
  remove: (productId) => set(state => ({ items: state.items.filter(i => i.productId !== productId) })),
  updateQty: (productId, qty) => set(state => ({ items: state.items.map(i => i.productId === productId ? { ...i, qty } : i) })),
  clear: () => set({ items: [] }),
  subtotal: () => get().items.reduce((s, i) => s + i.price * i.qty, 0)
}), { name: 'knock-cart' }))
