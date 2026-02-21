"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CookAlongButton } from "@/components/cook-along-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { AnimatedLogo } from "@/components/animated-logo"
import { Clock, ChefHat, ArrowLeft } from "lucide-react"
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

interface RecipePageClientProps {
  recipe: Recipe
}

export function RecipePageClient({ recipe }: RecipePageClientProps) {
  return (
    <div className="min-h-screen bg-background">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-10"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </motion.div>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <AnimatedLogo />
              <span className="font-bold text-foreground hidden sm:inline">Cook-Along</span>
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Recipe Image */}
        {recipe.image_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 rounded-lg overflow-hidden bg-muted h-80 md:h-96"
          >
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance"
          >
            {recipe.title}
          </motion.h1>
          {recipe.description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground mb-6 leading-relaxed"
            >
              {recipe.description}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-6 text-sm text-muted-foreground mb-6"
          >
            {recipe.total_time && (
              <motion.div
                className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full"
                whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.1)" }}
              >
                <Clock className="w-4 h-4" />
                <span>{recipe.total_time}</span>
              </motion.div>
            )}
            {recipe.steps.length > 0 && (
              <motion.div
                className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full"
                whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.1)" }}
              >
                <ChefHat className="w-4 h-4" />
                <span>{recipe.steps.length} steps</span>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <CookAlongButton recipe={recipe} />
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="md:col-span-1"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">Ingredients</h2>
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
            >
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-primary mt-1">•</span>
                    <span className="text-card-foreground leading-relaxed">
                      {ingredient.quantity && ingredient.unit
                        ? `${ingredient.quantity} ${ingredient.unit} `
                        : ingredient.quantity
                          ? `${ingredient.quantity} `
                          : ""}
                      {ingredient.name}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="md:col-span-2"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">Instructions</h2>
            <div className="space-y-4">
              {recipe.steps.map((step, index) => (
                <motion.div
                  key={step.step_number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.01, borderColor: "hsl(var(--primary) / 0.5)" }}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm"
                    >
                      {step.step_number}
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-card-foreground leading-relaxed mb-2">{step.instruction}</p>
                      {step.duration_in_seconds && step.duration_in_seconds > 0 && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full w-fit"
                        >
                          <Clock className="w-4 h-4" />
                          <span>
                            {step.duration_in_seconds >= 60
                              ? `${Math.floor(step.duration_in_seconds / 60)} min ${step.duration_in_seconds % 60 > 0 ? `${step.duration_in_seconds % 60} sec` : ""}`
                              : `${step.duration_in_seconds} sec`}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
