import './globals.css'
import React from 'react'

export const metadata = {
  title: 'Knock Knock Delivery - Sargodha',
  description: 'Premium real-time e-commerce & delivery service in Sargodha'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
          {children}
        </main>
      </body>
    </html>
  )
}
