import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Get institution with related data
    const institution = await db.institution.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            _count: {
              select: {
                reviews: true
              }
            }
          },
          orderBy: [
            { rating: 'desc' },
            { reviewCount: 'desc' }
          ],
          take: 10 // Limit to top 10 courses
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5 // Limit to latest 5 reviews
        },
        _count: {
          select: {
            courses: true,
            reviews: true
          }
        }
      }
    })

    if (!institution) {
      return NextResponse.json(
        { success: false, error: 'Institution not found' },
        { status: 404 }
      )
    }

    // Transform the data
    const transformedInstitution = {
      ...institution,
      courseCount: institution._count.courses,
      reviewCount: institution._count.reviews,
      courses: institution.courses.map(course => ({
        ...course,
        reviewCount: course._count.reviews
      }))
    }

    return NextResponse.json({
      success: true,
      data: transformedInstitution
    })

  } catch (error) {
    console.error('Error fetching institution:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch institution' },
      { status: 500 }
    )
  }
}