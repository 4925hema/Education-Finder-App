import { useState, useEffect } from 'react'

// Define TypeScript interfaces instead of importing from Prisma
interface Course {
  id: string
  title: string
  description: string
  level: string
  duration: string
  format: string
  tuitionFee: number
  currency: string
  requirements: string
  imageUrl: string
  rating: number
  reviewCount: number
  createdAt: Date
  updatedAt: Date
  institutionId: string
}

interface Institution {
  id: string
  name: string
  type: string
  city: string
  state: string
  country: string
  rating: number
  reviewCount: number
}

interface CourseWithInstitution extends Course {
  institution: Institution
  reviewCount: number
}

interface UseCoursesOptions {
  search?: string
  level?: string
  format?: string
  institutionId?: string
  minRating?: number
  maxTuition?: number
  page?: number
  limit?: number
}

interface CoursesResponse {
  success: boolean
  data: CourseWithInstitution[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export function useCourses(options: UseCoursesOptions = {}) {
  const [data, setData] = useState<CourseWithInstitution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (options.search) params.append('search', options.search)
        if (options.level) params.append('level', options.level)
        if (options.format) params.append('format', options.format)
        if (options.institutionId) params.append('institutionId', options.institutionId)
        if (options.minRating) params.append('minRating', options.minRating.toString())
        if (options.maxTuition) params.append('maxTuition', options.maxTuition.toString())
        if (options.page) params.append('page', options.page.toString())
        if (options.limit) params.append('limit', options.limit.toString())

        const response = await fetch(`/api/courses?${params}`)
        const result: CoursesResponse = await response.json()

        if (result.success) {
          setData(result.data)
          setPagination(result.pagination)
        } else {
          setError(result.error || 'Failed to fetch courses')
        }
      } catch (err) {
        setError('An error occurred while fetching courses')
        console.error('Error fetching courses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [options])

  return {
    courses: data,
    loading,
    error,
    pagination,
    refetch: () => fetchCourses()
  }
}