import { useState, useEffect } from 'react'

// Define TypeScript interfaces instead of importing from Prisma
interface Institution {
  id: string
  name: string
  description: string
  type: string
  address: string
  city: string
  state: string
  country: string
  website: string
  phone: string
  email: string
  foundedYear: number
  accreditation: string
  imageUrl: string
  rating: number
  reviewCount: number
  createdAt: Date
  updatedAt: Date
}

interface InstitutionWithCounts extends Institution {
  courseCount: number
}

interface UseInstitutionsOptions {
  search?: string
  type?: string
  city?: string
  state?: string
  country?: string
  minRating?: number
  page?: number
  limit?: number
}

interface InstitutionsResponse {
  success: boolean
  data: InstitutionWithCounts[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export function useInstitutions(options: UseInstitutionsOptions = {}) {
  const [data, setData] = useState<InstitutionWithCounts[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (options.search) params.append('search', options.search)
        if (options.type) params.append('type', options.type)
        if (options.city) params.append('city', options.city)
        if (options.state) params.append('state', options.state)
        if (options.country) params.append('country', options.country)
        if (options.minRating) params.append('minRating', options.minRating.toString())
        if (options.page) params.append('page', options.page.toString())
        if (options.limit) params.append('limit', options.limit.toString())

        const response = await fetch(`/api/institutions?${params}`)
        const result: InstitutionsResponse = await response.json()

        if (result.success) {
          setData(result.data)
          setPagination(result.pagination)
        } else {
          setError(result.error || 'Failed to fetch institutions')
        }
      } catch (err) {
        setError('An error occurred while fetching institutions')
        console.error('Error fetching institutions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchInstitutions()
  }, [options])

  return {
    institutions: data,
    loading,
    error,
    pagination,
    refetch: () => fetchInstitutions()
  }
}