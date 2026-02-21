"use client"

import { CookAlongPlayer } from "@/components/cook-along-player"
import { motion } from "framer-motion"

interface Recipe {
  id: string
  slug?: string
  title: string
  description: string | null
  total_time: string | null
  image_url?: string | null
  category?: string | null
  is_featured?: boolean | null
  ingredients: Array<{
    id?: string
    quantity?: string | null
    unit?: string | null
    name: string
    position?: number
  }>
  steps: Array<{
    id?: string
    step_number: number
    instruction: string
    duration_in_seconds: number | null
    video_url?: string | null
  }>
}

interface CookAlongPageClientProps {
  recipe: Recipe
}

export function CookAlongPageClient({ recipe }: CookAlongPageClientProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <CookAlongPlayer recipe={recipe} />
    </motion.div>
  )
}
