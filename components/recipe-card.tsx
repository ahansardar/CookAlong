"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock, ChefHat } from "lucide-react"
import { motion } from "framer-motion"

interface Recipe {
  id: string
  title: string
  description: string | null
  total_time: string | null
  slug: string
  category: string | null
  is_featured: boolean | null
  image_url?: string | null
  steps?: { step_number: number }[]
}

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-card border border-border rounded-lg sm:rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg group relative flex flex-col h-full"
    >
      {/* Recipe Image */}
      {recipe.image_url && (
        <div className="relative w-full h-40 sm:h-48 overflow-hidden bg-muted">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {recipe.is_featured && (
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-primary text-primary-foreground px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold shadow-lg">
              Featured
            </div>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        {!recipe.image_url && recipe.is_featured && (
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-primary text-primary-foreground px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
        
        <motion.h3
          className="text-lg sm:text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors pr-20 sm:pr-24 line-clamp-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {recipe.title}
        </motion.h3>
      
      {recipe.category && (
        <div className="mb-2">
          <span className="inline-block bg-muted text-muted-foreground px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium">
            {recipe.category}
          </span>
        </div>
      )}
      
      <p className="text-muted-foreground text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed line-clamp-2">{recipe.description || 'Delicious recipe'}</p>

      <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 flex-wrap">
        {recipe.total_time && (
          <motion.div
            className="flex items-center gap-1 sm:gap-2 bg-muted/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full"
            whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.1)" }}
          >
            <Clock className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
            <span className="truncate">{recipe.total_time}</span>
          </motion.div>
        )}
        {recipe.steps && recipe.steps.length > 0 && (
          <motion.div
            className="flex items-center gap-1 sm:gap-2 bg-muted/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap"
            whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.1)" }}
          >
            <ChefHat className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
            <span>{recipe.steps.length} steps</span>
          </motion.div>
        )}
      </div>

        <Link href={`/recipe/${recipe.slug || recipe.id}`} className="mt-auto">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="w-full text-sm sm:text-base" size="default">
              View Recipe
            </Button>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  )
}
