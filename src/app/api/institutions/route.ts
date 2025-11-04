import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get query parameters
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''
    const city = searchParams.get('city') || ''
    const state = searchParams.get('state') || ''
    const country = searchParams.get('country') || ''
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : 0
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    // Build where clause
    let whereClause: any = {}
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (type) {
      whereClause.type = type
    }
    
    if (city) {
      whereClause.city = { contains: city, mode: 'insensitive' }
    }
    
    if (state) {
      whereClause.state = { contains: state, mode: 'insensitive' }
    }
    
    if (country) {
      whereClause.country = { contains: country, mode: 'insensitive' }
    }
    
    if (minRating > 0) {
      whereClause.rating = { gte: minRating }
    }

    // Get institutions with pagination
    const [institutions, totalCount] = await Promise.all([
      db.institution.findMany({
        where: whereClause,
        include: {
          _count: {
            select: {
              courses: true,
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
      db.institution.count({ where: whereClause })
    ])

    // Transform the data to include course count and review count
    const transformedInstitutions = institutions.map(institution => ({
      ...institution,
      courseCount: institution._count.courses,
      reviewCount: institution._count.reviews
    }))

    return NextResponse.json({
      success: true,
      data: transformedInstitutions,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching institutions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch institutions' },
      { status: 500 }
    )
  }
}