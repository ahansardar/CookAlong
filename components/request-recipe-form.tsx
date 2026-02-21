'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface FormData {
  recipeName: string
  description: string
  ingredients: string
  email: string
  name: string
}

export function RequestRecipeForm() {
  const [formData, setFormData] = useState<FormData>({
    recipeName: '',
    description: '',
    ingredients: '',
    email: '',
    name: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const captchaRef = useRef<HCaptcha>(null)

  // Check spam prevention on mount
  useEffect(() => {
    const checkSpamLimit = () => {
      const now = Date.now()
      const requestsKey = 'recipe_requests'
      const requests = JSON.parse(localStorage.getItem(requestsKey) || '[]') as number[]
      
      // Remove requests older than 1 hour
      const recentRequests = requests.filter(time => now - time < 3600000)
      
      if (recentRequests.length >= 3) {
        setError('Rate Limit Exceeded: You can make up to 3 recipe requests per hour. Please try again later.')
      }
    }

    checkSpamLimit()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate CAPTCHA
    if (!captchaToken) {
      setError('CAPTCHA Required: Please complete the CAPTCHA verification.')
      return
    }

    // Check spam prevention
    const now = Date.now()
    const requestsKey = 'recipe_requests'
    const requests = JSON.parse(localStorage.getItem(requestsKey) || '[]') as number[]
    const recentRequests = requests.filter(time => now - time < 3600000)

    if (recentRequests.length >= 3) {
      setError('Rate Limit Exceeded: You can make up to 3 recipe requests per hour. Please try again later.')
      return
    }

    // Validate form data
    if (!formData.recipeName.trim() || !formData.email.trim() || !formData.name.trim()) {
      setError('Missing Fields: Please fill in all required fields.')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Invalid Email: Please enter a valid email address.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/request-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          captchaToken,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit recipe request')
      }

      // Update spam prevention
      recentRequests.push(now)
      localStorage.setItem(requestsKey, JSON.stringify(recentRequests))

      // Reset form
      setFormData({
        recipeName: '',
        description: '',
        ingredients: '',
        email: '',
        name: '',
      })
      setCaptchaToken(null)
      if (captchaRef.current) {
        captchaRef.current.resetCaptcha()
      }

      setShowSuccess(true)
      setError(null)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border rounded-lg sm:rounded-xl p-6 sm:p-8 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-2">Request a Recipe</h2>
      <p className="text-muted-foreground text-sm sm:text-base mb-6">
        Have a recipe in mind? Let us know and we'll consider adding it to our collection!
      </p>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-700 dark:text-red-300 text-sm flex items-start gap-2"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </motion.div>
      )}

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-700 dark:text-green-300 text-sm flex items-start gap-2"
        >
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>Recipe request submitted successfully!</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Recipe Name */}
        <div>
          <label htmlFor="recipeName" className="block text-sm font-medium text-card-foreground mb-2">
            Recipe Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="recipeName"
            name="recipeName"
            value={formData.recipeName}
            onChange={handleChange}
            placeholder="e.g., Butter Chicken"
            required
            className="w-full px-4 py-2 rounded-lg border border-border bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm sm:text-base"
          />
        </div>

        {/* Your Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-2">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
            className="w-full px-4 py-2 rounded-lg border border-border bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm sm:text-base"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            className="w-full px-4 py-2 rounded-lg border border-border bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm sm:text-base"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-card-foreground mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell us more about this recipe..."
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-border bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none text-sm sm:text-base"
          />
        </div>

        {/* Ingredients */}
        <div>
          <label htmlFor="ingredients" className="block text-sm font-medium text-card-foreground mb-2">
            Key Ingredients (Optional)
          </label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            placeholder="List key ingredients separated by commas..."
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-border bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none text-sm sm:text-base"
          />
        </div>

        {/* CAPTCHA */}
        <div className="flex justify-center py-4">
          <HCaptcha
            ref={captchaRef}
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ''}
            onVerify={(token) => setCaptchaToken(token)}
            theme="dark"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || !captchaToken}
          className="w-full text-sm sm:text-base py-2 sm:py-3"
          size="lg"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Recipe Request'}
        </Button>
      </form>
    </motion.div>
  )
}
