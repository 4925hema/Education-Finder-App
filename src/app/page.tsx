"use client"

import { useState, useEffect } from "react"
import { Search, Filter, GraduationCap, MapPin, Star, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InstitutionCard, CourseCard } from "@/components/education"
import { useInstitutions } from '@/hooks/use-institutions'
import { useCourses } from '@/hooks/use-courses'
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")
  const [selectedType, setSelectedType] = useState("")

  // Fetch institutions and courses
  const { institutions, loading: institutionsLoading } = useInstitutions({
    search: searchQuery,
    type: selectedType,
    limit: 4
  })

  const { courses, loading: coursesLoading } = useCourses({
    search: searchQuery,
    level: selectedLevel,
    limit: 6
  })

  const categories = [
    { name: "Universities", icon: GraduationCap, count: 1250 },
    { name: "Community Colleges", icon: GraduationCap, count: 3200 },
    { name: "Online Programs", icon: Clock, count: 890 },
    { name: "Vocational Schools", icon: Star, count: 1560 }
  ]

  const handleSearch = () => {
    // The hooks will automatically refetch when searchQuery changes
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find Your Perfect Educational Path
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover thousands of institutions, courses, and programs tailored to your goals and preferences
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-lg shadow-lg p-2 flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search for institutions, courses, or programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-0 focus:ring-0 text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Education Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UNDERGRADUATE">Undergraduate</SelectItem>
                    <SelectItem value="GRADUATE">Graduate</SelectItem>
                    <SelectItem value="DOCTORAL">Doctoral</SelectItem>
                    <SelectItem value="CERTIFICATE">Certificate</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UNIVERSITY">University</SelectItem>
                    <SelectItem value="COLLEGE">College</SelectItem>
                    <SelectItem value="COMMUNITY_COLLEGE">Community College</SelectItem>
                    <SelectItem value="INSTITUTE">Institute</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={handleSearch}>
                  <Filter className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <category.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.count} institutions</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Institutions */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Institutions</h2>
            <Button variant="outline">View All</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {institutionsLoading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index}>
                  <Skeleton className="aspect-video rounded-t-lg" />
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-3 w-full mb-2" />
                    <Skeleton className="h-3 w-2/3" />
                  </CardContent>
                </Card>
              ))
            ) : institutions.length > 0 ? (
              institutions.map((institution) => (
                <InstitutionCard key={institution.id} institution={institution} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No institutions found. Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Programs */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Popular Programs</h2>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Programs</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="technology">Technology</TabsTrigger>
              <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coursesLoading ? (
                  // Loading skeletons
                  Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index}>
                      <Skeleton className="aspect-video rounded-t-lg" />
                      <CardHeader>
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-3 w-full mb-2" />
                        <Skeleton className="h-3 w-2/3" />
                      </CardContent>
                    </Card>
                  ))
                ) : courses.length > 0 ? (
                  courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No courses found. Try adjusting your search criteria.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Educational Match?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who found their ideal institution through our platform
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary">Get Started</Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}