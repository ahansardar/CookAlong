'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { RecipeCard } from '@/components/recipe-card'
import { getAllRecipes, getFeaturedRecipes, getAllCategories, type Recipe } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function RecipeListClient() {
  const searchParams = useSearchParams()
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([])
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Get category and search from URL on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const searchParam = searchParams.get('search')
    
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
    if (searchParam) {
      setSearchQuery(searchParam)
      setSearchInput(searchParam)
    }
  }, [searchParams])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      const [recipes, featured, cats] = await Promise.all([
        getAllRecipes(),
        getFeaturedRecipes(),
        getAllCategories(),
      ])
      
      setAllRecipes(recipes)
      setFeaturedRecipes(featured)
      setCategories(cats)
      setIsLoading(false)
    }

    loadData()
  }, [])

  // Filter recipes based on search and category
  const filteredRecipes = useMemo(() => {
    return allRecipes.filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

      // Case-insensitive category matching
      const matchesCategory = !selectedCategory || 
        (recipe.category?.toLowerCase() === selectedCategory.toLowerCase())

      return matchesSearch && matchesCategory
    })
  }, [allRecipes, searchQuery, selectedCategory])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchInput.trim()) {
      params.append('search', searchInput.trim())
    }
    if (selectedCategory) {
      params.append('category', selectedCategory)
    }
    const queryString = params.toString()
    window.location.href = queryString ? `/?${queryString}` : '/'
  }

  const clearSearch = () => {
    setSearchInput('')
    window.location.href = selectedCategory ? `/?category=${encodeURIComponent(selectedCategory)}` : '/'
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-12 bg-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-6 animate-pulse"
            >
              <div className="h-6 bg-muted rounded mb-2 w-3/4" />
              <div className="h-4 bg-muted rounded mb-4 w-full" />
              <div className="h-8 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-3 sm:space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Search recipes..."
            aria-label="Search recipes"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
            className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2 sm:py-3 text-sm sm:text-base rounded-lg border border-border bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput('')
                window.location.href = selectedCategory ? `/?category=${encodeURIComponent(selectedCategory)}` : '/'
              }}
              aria-label="Clear search"
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-card-foreground transition-colors flex-shrink-0"
            >
              <X className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
          )}
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="w-full text-sm sm:text-base py-2 sm:py-3"
          size="default"
        >
          Search
        </Button>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground">Filter by Category</h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => window.location.href = '/'}
                className="rounded-full text-xs sm:text-sm px-2 sm:px-4"
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => window.location.href = `/?category=${encodeURIComponent(category)}`}
                  className="rounded-full text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Featured Recipes Section - Only show when no category filter is selected */}
      {featuredRecipes.length > 0 && !selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 sm:mt-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-card-foreground mb-3 sm:mb-4">Featured Recipes</h2>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
          >
            {featuredRecipes.map((recipe) => (
              <motion.div
                key={recipe.id}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.5,
                      ease: 'easeOut',
                    },
                  },
                }}
              >
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Recipe List Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 sm:mt-12"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-card-foreground mb-3 sm:mb-4">
          {selectedCategory ? `${selectedCategory} Recipes` : 'All Recipes'}
        </h2>

        {filteredRecipes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 sm:py-12 bg-muted/50 rounded-lg"
          >
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg px-4">
              {searchQuery
                ? `No recipes found matching "${searchQuery}"`
                : 'No recipes available in this category'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
          >
            {filteredRecipes.map((recipe) => (
              <motion.div
                key={recipe.id}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.5,
                      ease: 'easeOut',
                    },
                  },
                }}
              >
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
