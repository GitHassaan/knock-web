import { useState, useEffect } from 'react'
import axios from 'axios'

export function useAuth() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const access = localStorage.getItem('access')
    if (access) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`
      // Optionally decode user from token, but we rely on server responses
    }
  }, [])

  const setAuthUser = (u: any) => setUser(u)

  return { user, setUser: setAuthUser }
}
