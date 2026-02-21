"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Play } from "lucide-react"
import { motion } from "framer-motion"

interface Recipe {
  id: string
  slug?: string
  title: string
}

interface CookAlongButtonProps {
  recipe: Recipe
}

export function CookAlongButton({ recipe }: CookAlongButtonProps) {
  const router = useRouter()

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full md:w-auto">
      <Button
        size="lg"
        className="w-full md:w-auto text-lg h-14 px-8 relative overflow-hidden group"
        onClick={() => router.push(`/cook-along/${recipe.slug || recipe.id}`)}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        <Play className="w-5 h-5 mr-2" />
        Start Cook-Along Mode
      </Button>
    </motion.div>
  )
}
