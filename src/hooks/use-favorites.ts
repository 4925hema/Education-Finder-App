'use client'

import { useState, useEffect } from 'react'

export interface FavoriteItem {
  id: string
  type: 'institution' | 'course'
  name: string
  data: any
  addedAt: string
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])

  useEffect(() => {
    // Load favorites from localStorage on mount
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites)
        setFavorites(parsed)
      } catch (err) {
        console.error('Error parsing favorites:', err)
      }
    }
  }, [])

  const addToFavorites = (item: Omit<FavoriteItem, 'addedAt'>) => {
    setFavorites(prev => {
      // Check if item already exists
      const exists = prev.some(existing => existing.id === item.id)
      if (exists) {
        return prev
      }
      
      const newItem = {
        ...item,
        addedAt: new Date().toISOString()
      }
      
      const newFavorites = [...prev, newItem]
      
      // Save to localStorage
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  const removeFromFavorites = (id: string) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(item => item.id !== id)
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  const isFavorite = (id: string) => {
    return favorites.some(item => item.id === id)
  }

  const clearFavorites = () => {
    setFavorites([])
    localStorage.removeItem('favorites')
  }

  const getFavoritesCount = () => {
    return favorites.length
  }

  const getFavorites = () => {
    return favorites
  }

  const getFavoritesByType = (type: 'institution' | 'course') => {
    return favorites.filter(item => item.type === type)
  }

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
    getFavoritesCount,
    getFavorites,
    getFavoritesByType
  }
}