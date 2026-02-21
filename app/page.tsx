"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { AnimatedLogo } from "@/components/animated-logo"
import { useLanguage } from "@/context/LanguageContext"
import { RecipeListClient } from "@/components/recipe-list-client"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-10"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <AnimatedLogo />
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
              Cook-Along
            </h1>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/request-recipe">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="sm" className="gap-2 text-xs sm:text-sm">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Request Recipe</span>
                  <span className="sm:hidden">Request</span>
                </Button>
              </motion.div>
            </Link>
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mb-12"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance"
          >
            {t('home.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            {t('home.description')}
          </motion.p>
        </motion.div>

        <RecipeListClient />
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="border-t border-border mt-16 py-8"
      >
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>
            Made by <span className="text-primary font-semibold">Ahan Sardar</span> with love
          </p>
        </div>
      </motion.footer>
    </div>
  )
}
