"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  BookOpen, 
  Globe, 
  Phone, 
  Mail,
  Calendar,
  Award,
  ChevronLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourseCard } from "@/components/education"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

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
  courseCount: number
  courses: any[]
  reviews: any[]
}

export default function InstitutionDetailPage() {
  const params = useParams()
  const [institution, setInstitution] = useState<Institution | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/institutions/${params.id}`)
        const result = await response.json()

        if (result.success) {
          setInstitution(result.data)
        } else {
          setError(result.error || 'Failed to fetch institution')
        }
      } catch (err) {
        setError('An error occurred while fetching institution')
        console.error('Error fetching institution:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchInstitution()
    }
  }, [params.id])

  const formatType = (type: string) => {
    return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
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

  if (error || !institution) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Institution Not Found</h1>
          <p className="text-gray-600 mb-6">The institution you're looking for doesn't exist.</p>
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
                    {institution.name}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{[institution.city, institution.state, institution.country].filter(Boolean).join(", ")}</span>
                    </div>
                    <Badge variant="secondary">{formatType(institution.type)}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">{institution.rating.toFixed(1)}</span>
                  <span className="text-gray-500">({institution.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <BookOpen className="h-5 w-5" />
                  <span>{institution.courseCount} courses</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span>Founded {institution.foundedYear}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="aspect-video w-full max-w-sm bg-gray-200 rounded-lg overflow-hidden">
                {institution.imageUrl ? (
                  <img 
                    src={institution.imageUrl} 
                    alt={institution.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-blue-600" />
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
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {institution.description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {institution.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium">Address</p>
                          <p className="text-gray-600">{institution.address}</p>
                        </div>
                      </div>
                    )}
                    {institution.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-gray-600">{institution.phone}</p>
                        </div>
                      </div>
                    )}
                    {institution.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-gray-600">{institution.email}</p>
                        </div>
                      </div>
                    )}
                    {institution.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Website</p>
                          <a 
                            href={institution.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {institution.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {institution.accreditation && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Accreditation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{institution.accreditation}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="courses" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Available Courses</h2>
                  <Badge variant="outline">{institution.courses.length} courses</Badge>
                </div>
                
                {institution.courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {institution.courses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No courses available at this time.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Reviews</h2>
                  <Badge variant="outline">{institution.reviews.length} reviews</Badge>
                </div>
                
                {institution.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {institution.reviews.map((review) => (
                      <Card key={review.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
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
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">Add to Favorites</Button>
                <Button variant="outline" className="w-full">Compare</Button>
                <Button variant="outline" className="w-full">Share</Button>
                <Button variant="outline" className="w-full">Visit Website</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}