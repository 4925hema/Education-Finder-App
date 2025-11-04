import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, DollarSign, MapPin, BookOpen, Plus, Heart } from "lucide-react"
import Link from "next/link"
import { useCompare } from "@/hooks/use-compare"
import { useFavorites } from "@/hooks/use-favorites"

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    level: string
    duration: string
    format: string
    tuitionFee?: number
    currency?: string
    rating: number
    reviewCount: number
    imageUrl?: string
    institution: {
      id: string
      name: string
      city: string
      state: string
      country: string
    }
  }
}

export function CourseCard({ course }: CourseCardProps) {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  
  const location = [course.institution.city, course.institution.state, course.institution.country]
    .filter(Boolean)
    .join(", ")

  const formatLevel = (level: string) => {
    return level.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatFormat = (format: string) => {
    return format.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const handleCompare = () => {
    const compareItem = {
      id: course.id,
      type: 'course' as const,
      name: course.title,
      data: course
    }
    
    if (isInCompare(course.id)) {
      removeFromCompare(course.id)
    } else {
      addToCompare(compareItem)
    }
  }

  const handleFavorite = () => {
    const favoriteItem = {
      id: course.id,
      type: 'course' as const,
      name: course.title,
      data: course
    }
    
    if (isFavorite(course.id)) {
      removeFromFavorites(course.id)
    } else {
      addToFavorites(favoriteItem)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
        {course.imageUrl ? (
          <img 
            src={course.imageUrl} 
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-green-600" />
          </div>
        )}
      </div>
      
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="text-xs">{course.institution.name}, {location}</span>
          </CardDescription>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {formatLevel(course.level)}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {formatFormat(course.format)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">
          {course.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{course.rating.toFixed(1)}</span>
              <span className="text-gray-500">({course.reviewCount})</span>
            </div>
            
            {course.duration && (
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
            )}
          </div>
          
          {course.tuitionFee && (
            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
              <DollarSign className="h-4 w-4" />
              <span>
                {course.currency || "$"}{course.tuitionFee.toLocaleString()}/year
              </span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1" asChild>
            <Link href={`/courses/${course.id}`}>
              View Details
            </Link>
          </Button>
          <Button 
            size="sm" 
            variant={isFavorite(course.id) ? "default" : "outline"}
            onClick={handleFavorite}
            className={isFavorite(course.id) ? "bg-red-600 hover:bg-red-700" : ""}
          >
            <Heart className={`h-4 w-4 ${isFavorite(course.id) ? "fill-current" : ""}`} />
          </Button>
          <Button 
            size="sm" 
            variant={isInCompare(course.id) ? "default" : "outline"}
            onClick={handleCompare}
            className={isInCompare(course.id) ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isInCompare(course.id) ? (
              <Star className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}