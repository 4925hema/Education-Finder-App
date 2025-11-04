import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Get course with related data
    const course = await db.course.findUnique({
      where: { id },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            type: true,
            city: true,
            state: true,
            country: true,
            rating: true,
            reviewCount: true
          }
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
            reviews: true
          }
        }
      }
    })

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }

    // Transform the data
    const transformedCourse = {
      ...course,
      reviewCount: course._count.reviews
    }

    return NextResponse.json({
      success: true,
      data: transformedCourse
    })

  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}