import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get query parameters
    const search = searchParams.get('search') || ''
    const level = searchParams.get('level') || ''
    const format = searchParams.get('format') || ''
    const institutionId = searchParams.get('institutionId') || ''
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : 0
    const maxTuition = searchParams.get('maxTuition') ? parseFloat(searchParams.get('maxTuition')!) : undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    // Build where clause
    let whereClause: any = {}
    
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (level) {
      whereClause.level = level
    }
    
    if (format) {
      whereClause.format = format
    }
    
    if (institutionId) {
      whereClause.institutionId = institutionId
    }
    
    if (minRating > 0) {
      whereClause.rating = { gte: minRating }
    }
    
    if (maxTuition !== undefined) {
      whereClause.tuitionFee = { lte: maxTuition }
    }

    // Get courses with pagination and include institution data
    const [courses, totalCount] = await Promise.all([
      db.course.findMany({
        where: whereClause,
        include: {
          institution: {
            select: {
              id: true,
              name: true,
              city: true,
              state: true,
              country: true
            }
          },
          _count: {
            select: {
              reviews: true
            }
          }
        },
        skip: offset,
        take: limit,
        orderBy: [
          { rating: 'desc' },
          { reviewCount: 'desc' }
        ]
      }),
      db.course.count({ where: whereClause })
    ])

    // Transform the data to include review count
    const transformedCourses = courses.map(course => ({
      ...course,
      reviewCount: course._count.reviews
    }))

    return NextResponse.json({
      success: true,
      data: transformedCourses,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}