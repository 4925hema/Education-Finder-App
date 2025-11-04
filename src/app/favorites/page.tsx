"use client"

import { useState } from "react"
import { 
  Heart, 
  Star, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  BookOpen,
  X,
  ArrowLeft,
  GraduationCap,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InstitutionCard, CourseCard } from "@/components/education"
import { useFavorites } from "@/hooks/use-favorites"
import Link from "next/link"

export default function FavoritesPage() {
  const { favorites, removeFromFavorites, clearFavorites, getFavoritesByType } = useFavorites()
  const [activeTab, setActiveTab] = useState("all")

  const institutionFavorites = getFavoritesByType('institution')
  const courseFavorites = getFavoritesByType('course')

  const handleRemove = (id: string) => {
    removeFromFavorites(id)
  }

  const handleClearAll = () => {
    if (confirm('Are you sure you want to remove all favorites?')) {
      clearFavorites()
    }
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Favorites Yet</h1>
          <p className="text-gray-600 mb-6">
            Start adding institutions and courses to your favorites to keep track of your top choices.
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
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Heart className="h-6 w-6 text-red-500" />
                  My Favorites
                </h1>
                <p className="text-gray-600">
                  {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Favorites Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              All ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="institutions">
              Institutions ({institutionFavorites.length})
            </TabsTrigger>
            <TabsTrigger value="courses">
              Courses ({courseFavorites.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map((favorite) => (
                  <div key={favorite.id} className="relative group">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 z-10 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                      onClick={() => handleRemove(favorite.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {favorite.type === 'institution' ? (
                      <InstitutionCard institution={favorite.data} />
                    ) : (
                      <CourseCard course={favorite.data} />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No favorites found in this category.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="institutions" className="space-y-8">
            {institutionFavorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {institutionFavorites.map((favorite) => (
                  <div key={favorite.id} className="relative group">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 z-10 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                      onClick={() => handleRemove(favorite.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <InstitutionCard institution={favorite.data} />
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No institution favorites yet. Start adding some!</p>
                  <Button className="mt-4" asChild>
                    <Link href="/">Browse Institutions</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="courses" className="space-y-8">
            {courseFavorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courseFavorites.map((favorite) => (
                  <div key={favorite.id} className="relative group">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 z-10 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                      onClick={() => handleRemove(favorite.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <CourseCard course={favorite.data} />
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No course favorites yet. Start adding some!</p>
                  <Button className="mt-4" asChild>
                    <Link href="/">Browse Courses</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}