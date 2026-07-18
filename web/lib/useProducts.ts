import useSWR from 'swr'
import axios from 'axios'

const fetcher = (url: string) => axios.get(url).then(r => r.data)

export function useProducts(params = {}) {
  const q = new URLSearchParams(params as any).toString()
  const { data, error } = useSWR(`/api/products?${q}`, fetcher)
  return { products: data?.products || [], total: data?.total || 0, loading: !data && !error }
}
