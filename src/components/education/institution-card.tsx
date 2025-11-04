import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Clock, Users, BookOpen, Plus, Heart } from "lucide-react"
import Link from "next/link"
import { useCompare } from "@/hooks/use-compare"
import { useFavorites } from "@/hooks/use-favorites"

interface InstitutionCardProps {
  institution: {
    id: string
    name: string
    description: string
    type: string
    city: string
    state: string
    country: string
    rating: number
    reviewCount: number
    imageUrl?: string
    courseCount?: number
    studentCount?: number
  }
}

export function InstitutionCard({ institution }: InstitutionCardProps) {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  
  const location = [institution.city, institution.state, institution.country]
    .filter(Boolean)
    .join(", ")

  const handleCompare = () => {
    const compareItem = {
      id: institution.id,
      type: 'institution' as const,
      name: institution.name,
      data: institution
    }
    
    if (isInCompare(institution.id)) {
      removeFromCompare(institution.id)
    } else {
      addToCompare(compareItem)
    }
  }

  const handleFavorite = () => {
    const favoriteItem = {
      id: institution.id,
      type: 'institution' as const,
      name: institution.name,
      data: institution
    }
    
    if (isFavorite(institution.id)) {
      removeFromFavorites(institution.id)
    } else {
      addToFavorites(favoriteItem)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
        {institution.imageUrl ? (
          <img 
            src={institution.imageUrl} 
            alt={institution.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
        )}
      </div>
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-1">{institution.name}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              <span className="text-xs">{location}</span>
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            {institution.type.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">
          {institution.description}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{institution.rating.toFixed(1)}</span>
            <span className="text-gray-500">({institution.reviewCount})</span>
          </div>
          
          {institution.courseCount && (
            <div className="flex items-center gap-1 text-gray-600">
              <BookOpen className="h-4 w-4" />
              <span>{institution.courseCount} courses</span>
            </div>
          )}
        </div>
        
        {institution.studentCount && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{institution.studentCount.toLocaleString()} students</span>
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1" asChild>
            <Link href={`/institutions/${institution.id}`}>
              View Details
            </Link>
          </Button>
          <Button 
            size="sm" 
            variant={isFavorite(institution.id) ? "default" : "outline"}
            onClick={handleFavorite}
            className={isFavorite(institution.id) ? "bg-red-600 hover:bg-red-700" : ""}
          >
            <Heart className={`h-4 w-4 ${isFavorite(institution.id) ? "fill-current" : ""}`} />
          </Button>
          <Button 
            size="sm" 
            variant={isInCompare(institution.id) ? "default" : "outline"}
            onClick={handleCompare}
            className={isInCompare(institution.id) ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isInCompare(institution.id) ? (
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