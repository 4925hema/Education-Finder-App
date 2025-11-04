'use client'

import { useState, useEffect } from 'react'

export interface CompareItem {
  id: string
  type: 'institution' | 'course'
  name: string
  data: any
}

export function useCompare() {
  const [compareItems, setCompareItems] = useState<CompareItem[]>([])

  useEffect(() => {
    // Load comparison items from localStorage on mount
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

  const addToCompare = (item: CompareItem) => {
    setCompareItems(prev => {
      // Check if item already exists
      const exists = prev.some(existing => existing.id === item.id)
      if (exists) {
        return prev
      }
      
      // Limit to 4 items
      const newItems = [...prev, item]
      if (newItems.length > 4) {
        newItems.shift() // Remove oldest item
      }
      
      // Save to localStorage
      localStorage.setItem('compareItems', JSON.stringify(newItems))
      return newItems
    })
  }

  const removeFromCompare = (id: string) => {
    setCompareItems(prev => {
      const newItems = prev.filter(item => item.id !== id)
      localStorage.setItem('compareItems', JSON.stringify(newItems))
      return newItems
    })
  }

  const isInCompare = (id: string) => {
    return compareItems.some(item => item.id === id)
  }

  const clearCompare = () => {
    setCompareItems([])
    localStorage.removeItem('compareItems')
  }

  const getCompareCount = () => {
    return compareItems.length
  }

  const getCompareItems = () => {
    return compareItems
  }

  return {
    compareItems,
    addToCompare,
    removeFromCompare,
    isInCompare,
    clearCompare,
    getCompareCount,
    getCompareItems
  }
}