"use client"

import { useState, useEffect } from "react"
import { 
  Star, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  BookOpen,
  X,
  ArrowLeft,
  Check,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

interface CompareItem {
  id: string
  type: 'institution' | 'course'
  name: string
  data: any
}

export default function ComparePage() {
  const [compareItems, setCompareItems] = useState<CompareItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load comparison items from localStorage
    const savedItems = localStorage.getItem('compareItems')
    if (savedItems) {
      try {
        const parsed = JSON.parse(savedItems)
        setCompareItems(parsed)
      } catch (err) {
        console.error('Error parsing compare items:', err)
      }
    }
  }, [])

  const removeFromCompare = (id: string) => {
    const updatedItems = compareItems.filter(item => item.id !== id)
    setCompareItems(updatedItems)
    localStorage.setItem('compareItems', JSON.stringify(updatedItems))
  }

  const clearAll = () => {
    setCompareItems([])
    localStorage.removeItem('compareItems')
  }

  const formatType = (type: string) => {
    return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatLevel = (level: string) => {
    return level.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatFormat = (format: string) => {
    return format.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  if (compareItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Items to Compare</h1>
          <p className="text-gray-600 mb-6">
            Add institutions or courses to your comparison list to see them side by side.
          </p>
          <Button asChild>
            <Link href="/">
              Browse Institutions & Courses
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Home
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Compare</h1>
                <p className="text-gray-600">
                  {compareItems.length} {compareItems.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Items Header */}
            <div className="grid grid-cols-[200px_1fr] gap-4 mb-6">
              <div></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {compareItems.map((item) => (
                  <Card key={item.id} className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 z-10 h-8 w-8 p-0"
                      onClick={() => removeFromCompare(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <CardHeader className="pb-3">
                      <Badge variant="secondary" className="w-fit">
                        {item.type === 'institution' ? 'Institution' : 'Course'}
                      </Badge>
                      <CardTitle className="text-lg leading-tight">
                        {item.name}
                      </CardTitle>
                      {item.type === 'institution' && item.data.city && (
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {[item.data.city, item.data.state, item.data.country]
                            .filter(Boolean)
                            .join(", ")}
                        </CardDescription>
                      )}
                      {item.type === 'course' && item.data.institution && (
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.data.institution.name}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="aspect-video bg-gray-200 rounded-lg mb-3">
                        {item.data.imageUrl ? (
                          <img 
                            src={item.data.imageUrl} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-blue-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{item.data.rating?.toFixed(1) || 'N/A'}</span>
                        <span className="text-gray-500 text-sm">
                          ({item.data.reviewCount || 0})
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Comparison Table */}
            <div className="space-y-4">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium text-gray-900">Name</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Type</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Rating</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Reviews</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {compareItems.map((item) => (
                        <div key={item.id} className="space-y-4">
                          <div>
                            <p className="text-gray-700">{item.name}</p>
                          </div>
                          <div>
                            <Badge variant="outline">
                              {item.type === 'institution' 
                                ? formatType(item.data.type)
                                : formatLevel(item.data.level)
                              }
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{item.data.rating?.toFixed(1) || 'N/A'}</span>
                          </div>
                          <div>
                            <p className="text-gray-600">{item.data.reviewCount || 0}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Institution-specific Information */}
              {compareItems.some(item => item.type === 'institution') && (
                <Card>
                  <CardHeader>
                    <CardTitle>Institution Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-[200px_1fr] gap-4">
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium text-gray-900">Location</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Founded</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Courses</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Website</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {compareItems.map((item) => (
                          <div key={item.id} className="space-y-4">
                            {item.type === 'institution' ? (
                              <>
                                <div>
                                  <p className="text-gray-700">
                                    {[item.data.city, item.data.state, item.data.country]
                                      .filter(Boolean)
                                      .join(", ") || 'N/A'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-700">{item.data.foundedYear || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-gray-700">{item.data.courseCount || 0}</p>
                                </div>
                                <div>
                                  {item.data.website ? (
                                    <a 
                                      href={item.data.website} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline text-sm"
                                    >
                                      Visit Website
                                    </a>
                                  ) : (
                                    <p className="text-gray-500">N/A</p>
                                  )}
                                </div>
                              </>
                            ) : (
                              <>
                                <div>
                                  <p className="text-gray-500">-</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">-</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">-</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">-</p>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Course-specific Information */}
              {compareItems.some(item => item.type === 'course') && (
                <Card>
                  <CardHeader>
                    <CardTitle>Course Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-[200px_1fr] gap-4">
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium text-gray-900">Duration</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Format</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Tuition Fee</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Institution</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {compareItems.map((item) => (
                          <div key={item.id} className="space-y-4">
                            {item.type === 'course' ? (
                              <>
                                <div>
                                  <p className="text-gray-700">{item.data.duration || 'N/A'}</p>
                                </div>
                                <div>
                                  <Badge variant="outline">
                                    {formatFormat(item.data.format)}
                                  </Badge>
                                </div>
                                <div>
                                  {item.data.tuitionFee ? (
                                    <p className="text-green-600 font-medium">
                                      {item.data.currency || "$"}{item.data.tuitionFee.toLocaleString()}/year
                                    </p>
                                  ) : (
                                    <p className="text-gray-500">Contact institution</p>
                                  )}
                                </div>
                                <div>
                                  {item.data.institution ? (
                                    <Link 
                                      href={`/institutions/${item.data.institution.id}`}
                                      className="text-blue-600 hover:underline text-sm"
                                    >
                                      {item.data.institution.name}
                                    </Link>
                                  ) : (
                                    <p className="text-gray-500">N/A</p>
                                  )}
                                </div>
                              </>
                            ) : (
                              <>
                                <div>
                                  <p className="text-gray-500">-</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">-</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">-</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">-</p>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {compareItems.map((item) => (
                        <div key={item.id} className="space-y-2">
                          <Button className="w-full" size="sm">
                            {item.type === 'institution' ? 'View Institution' : 'View Course'}
                          </Button>
                          <Button variant="outline" className="w-full" size="sm">
                            Remove from Compare
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}