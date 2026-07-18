import dynamic from 'next/dynamic'
import React from 'react'

const HeroThree = dynamic(() => import('../components/HeroThree'), { ssr: false })

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-12">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold mb-4">Knock Knock Delivery — Sargodha</h1>
            <p className="text-lg text-gray-600 mb-6">
              Shop from our store or ask us to pick up from any shop in Sargodha. Fast, reliable, premium delivery.
            </p>
          </div>
          <div className="flex-1 w-full h-96">
            <HeroThree />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* placeholder cards */}
          {[1,2,3,4].map(i=> (
            <div key={i} className="p-4 bg-white rounded-2xl shadow-md glass">
              <div className="h-40 bg-gray-100 rounded-lg mb-3" />
              <h3 className="font-medium">Product {i}</h3>
              <p className="text-sm text-gray-500">Rs. 999</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
