"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { RecipeCard } from "@/components/recipe-card"
import { getAllRecipes, getFeaturedRecipes, getAllCategories, type Recipe } from "@/lib/supabase"
import { motion } from "framer-motion"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RecipeListClient() {
  const router = useRouter()

  const [allRecipes, setAllRecipes] = useState<Recipe[]>([])
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [searchInput, setSearchInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false) 

  // Detection for client-side
  useEffect(() => {
    setIsClient(true)
  }, [])

  
  useEffect(() => {
    if (!isClient) return
    const params = new URLSearchParams(window.location.search)
    const categoryParam = params.get("category")
    const searchParam = params.get("search")
    
    if (categoryParam) setSelectedCategory(categoryParam)
    if (searchParam) {
      setSearchQuery(searchParam)
      setSearchInput(searchParam)
    }
  }, [isClient])

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

  const filteredRecipes = useMemo(() => {
    return allRecipes.filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      const matchesCategory =
        !selectedCategory ||
        recipe.category?.toLowerCase() === selectedCategory.toLowerCase()
      return matchesSearch && matchesCategory
    })
  }, [allRecipes, searchQuery, selectedCategory])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchInput.trim()) params.append("search", searchInput.trim())
    if (selectedCategory) params.append("category", selectedCategory)
    router.push(params.toString() ? `/?${params.toString()}` : "/")
  }

  const clearSearch = () => {
    setSearchInput("")
    router.push(selectedCategory ? `/?category=${encodeURIComponent(selectedCategory)}` : "/")
  }

  if (!isClient || isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-12 bg-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3,4].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
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
      {/* Search + Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-3 sm:space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search recipes..."
            className="w-full pl-10 pr-10 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary"
          />
          {searchInput && (
            <button onClick={clearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-card-foreground">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <Button onClick={handleSearch} className="w-full py-2">Search</Button>

        {categories.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant={selectedCategory === null ? "default" : "outline"} size="sm" onClick={() => router.push("/")}>All</Button>
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => router.push(`/?category=${encodeURIComponent(cat)}`)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Featured Recipes */}
      {featuredRecipes.length > 0 && !selectedCategory && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <h2 className="text-xl font-bold mb-4">Featured Recipes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredRecipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        </motion.div>
      )}

      {/* Recipe List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
        <h2 className="text-xl font-bold mb-4">{selectedCategory ? `${selectedCategory} Recipes` : "All Recipes"}</h2>
        {filteredRecipes.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 rounded bg-muted/50">
            {searchQuery ? `No recipes found for "${searchQuery}"` : "No recipes available in this category"}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        )}
      </motion.div>
    </div>
  )
}
