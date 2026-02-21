'use client'

import { RequestRecipeForm } from '@/components/request-recipe-form'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSelector } from '@/components/language-selector'
import { AnimatedLogo } from '@/components/animated-logo'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function RequestRecipePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <AnimatedLogo />
              <span className="hidden sm:inline font-bold text-lg text-primary">Cook Along</span>
            </motion.div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Recipes
        </Link>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-card-foreground mb-3 sm:mb-4">
            Request a Recipe
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Can't find the recipe you're looking for? Let us know what you'd like to cook, and we'll do our best to add it to our collection!
          </p>
        </motion.div>

        {/* Form */}
        <div className="mb-16">
          <RequestRecipeForm />
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-muted/50 rounded-lg sm:rounded-xl p-6 sm:p-8 max-w-2xl mx-auto"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-4">How it works</h3>
          <ul className="space-y-3 text-sm sm:text-base text-muted-foreground">
            <li className="flex gap-3">
              <span className="font-semibold text-primary flex-shrink-0">1.</span>
              <span>Fill out the recipe request form with the recipe name and details.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-primary flex-shrink-0">2.</span>
              <span>Complete the CAPTCHA to verify you're human (spam prevention).</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-primary flex-shrink-0">3.</span>
              <span>You can submit up to 3 recipe requests per hour.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-primary flex-shrink-0">4.</span>
              <span>Our team will review your request and add the recipe if it matches our criteria.</span>
            </li>
          </ul>
        </motion.div>
      </main>
    </div>
  )
}
