"use client"

import { motion } from "framer-motion"

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto max-w-6xl">
        <div className="mb-12 space-y-4">
          <div className="h-12 w-64 bg-muted rounded-lg animate-pulse" />
          <div className="h-6 w-96 bg-muted rounded-lg animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="h-6 w-48 bg-muted rounded-lg animate-pulse mb-4" />
              <div className="h-4 w-full bg-muted rounded-lg animate-pulse mb-2" />
              <div className="h-4 w-3/4 bg-muted rounded-lg animate-pulse mb-4" />
              <div className="flex gap-4 mb-4">
                <div className="h-8 w-24 bg-muted rounded-full animate-pulse" />
                <div className="h-8 w-24 bg-muted rounded-full animate-pulse" />
              </div>
              <div className="h-12 w-full bg-primary/20 rounded-lg animate-pulse" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
