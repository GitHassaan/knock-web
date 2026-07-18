import React, { useState } from 'react'
import { register } from '../../lib/api/auth'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    setLoading(true)
    try {
      await register(name, email, password)
      alert('Registered, now login')
      window.location.href = '/login'
    } catch (e:any) {
      alert(e?.response?.data?.error || 'Failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <div className="max-w-md p-4 bg-white rounded">
        <input className="w-full p-3 border rounded mb-3" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full p-3 border rounded mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full p-3 border rounded mb-3" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="px-4 py-2 bg-primary text-white rounded" onClick={handle} disabled={loading}>{loading ? '...' : 'Register'}</button>
      </div>
    </div>
  )
}
