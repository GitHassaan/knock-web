import axios from 'axios'

export async function login(email: string, password: string) {
  const res = await axios.post('/api/auth/login', { email, password })
  if (res.data?.access) {
    localStorage.setItem('access', res.data.access)
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`
  }
  return res.data
}

export async function register(name: string, email: string, password: string) {
  const res = await axios.post('/api/auth/register', { name, email, password })
  return res.data
}

export async function refresh() {
  const res = await axios.post('/api/auth/refresh')
  if (res.data?.access) {
    localStorage.setItem('access', res.data.access)
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`
  }
  return res.data
}

export async function logout() {
  await axios.post('/api/auth/logout')
  localStorage.removeItem('access')
  delete axios.defaults.headers.common['Authorization']
}
