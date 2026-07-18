import React, { useState } from 'react'
import { login } from '../../lib/api/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    setLoading(true)
    try {
      const res = await login(email, password)
      alert('Logged in')
      // reload to allow access-protected calls
      window.location.href = '/'
    } catch (e:any) {
      alert(e?.response?.data?.error || 'Failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <div className="max-w-md p-4 bg-white rounded">
        <input className="w-full p-3 border rounded mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full p-3 border rounded mb-3" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="px-4 py-2 bg-primary text-white rounded" onClick={handle} disabled={loading}>{loading ? '...' : 'Login'}</button>
      </div>
    </div>
  )
}
