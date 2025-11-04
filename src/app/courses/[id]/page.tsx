"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { 
  Star, 
  Clock, 
  DollarSign, 
  MapPin, 
  BookOpen,
  Calendar,
  Award,
  ChevronLeft,
  User,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

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
  institution: {
    id: string
    name: string
    type: string
    city: string
    state: string
    country: string
    rating: number
    reviewCount: number
  }
  reviews: any[]
}

export default function CourseDetailPage() {
  const params = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/courses/${params.id}`)
        const result = await response.json()

        if (result.success) {
          setCourse(result.data)
        } else {
          setError(result.error || 'Failed to fetch course')
        }
      } catch (err) {
        setError('An error occurred while fetching course')
        console.error('Error fetching course:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCourse()
    }
  }, [params.id])

  const formatLevel = (level: string) => {
    return level.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatFormat = (format: string) => {
    return format.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-12 w-3/4" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full mb-6" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div>
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{course.institution.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{formatLevel(course.level)}</Badge>
                    <Badge variant="outline">{formatFormat(course.format)}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{course.rating.toFixed(1)}</span>
                      <span className="text-gray-500">({course.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                {course.duration && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="h-5 w-5" />
                    <span>{course.duration}</span>
                  </div>
                )}
                {course.tuitionFee && (
                  <div className="flex items-center gap-1 text-green-600 font-medium">
                    <DollarSign className="h-5 w-5" />
                    <span>{course.currency || "$"}{course.tuitionFee.toLocaleString()}/year</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="aspect-video w-full max-w-sm bg-gray-200 rounded-lg overflow-hidden">
                {course.imageUrl ? (
                  <img 
                    src={course.imageUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-green-600" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Course</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {course.description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Institution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{course.institution.name}</h3>
                        <p className="text-gray-600 mb-2">
                          {[course.institution.city, course.institution.state, course.institution.country]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{course.institution.type.replace(/_/g, " ")}</Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{course.institution.rating.toFixed(1)}</span>
                            <span className="text-gray-500 text-sm">({course.institution.reviewCount})</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/institutions/${course.institution.id}`}>
                          View Institution
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-900">Education Level</p>
                        <p className="text-gray-600">{formatLevel(course.level)}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Format</p>
                        <p className="text-gray-600">{formatFormat(course.format)}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Duration</p>
                        <p className="text-gray-600">{course.duration || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Tuition Fee</p>
                        <p className="text-gray-600">
                          {course.tuitionFee 
                            ? `${course.currency || "$"}${course.tuitionFee.toLocaleString()}/year`
                            : "Contact institution"
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {course.requirements && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{course.requirements}</p>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>What You'll Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {[
                        "Comprehensive understanding of core concepts",
                        "Practical skills through hands-on projects",
                        "Industry-relevant tools and technologies",
                        "Professional development and networking",
                        "Preparation for career advancement"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Student Reviews</h2>
                  <Badge variant="outline">{course.reviews.length} reviews</Badge>
                </div>
                
                {course.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {course.reviews.map((review) => (
                      <Card key={review.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium">{review.user.name}</p>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Apply Now</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">Add to Favorites</Button>
                <Button variant="outline" className="w-full">Compare</Button>
                <Button variant="outline" className="w-full">Contact Institution</Button>
                <Button variant="outline" className="w-full">Share Course</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}