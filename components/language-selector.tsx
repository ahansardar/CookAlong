'use client'

import { useLanguage, type Language } from '@/context/LanguageContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const languages: { code: Language; label: string; nativeLabel: string; inProgress?: boolean }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  // Indian Languages (22 languages)
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी', inProgress: true },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', inProgress: true },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', inProgress: true },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', inProgress: true },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം', inProgress: true },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી', inProgress: true },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', inProgress: true },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', inProgress: true },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ', inProgress: true },
  { code: 'ur', label: 'Urdu', nativeLabel: 'اردو', inProgress: true },
  { code: 'or', label: 'Odia', nativeLabel: 'ଓଡ଼ିଆ', inProgress: true },
  { code: 'as', label: 'Assamese', nativeLabel: 'অসমীয়া', inProgress: true },
  { code: 'sa', label: 'Sanskrit', nativeLabel: 'संस्कृत', inProgress: true },
  { code: 'ko', label: 'Konkani', nativeLabel: 'कोंकणी', inProgress: true },
  { code: 'mn', label: 'Manipuri', nativeLabel: 'মৈতৈ', inProgress: true },
  { code: 'ne', label: 'Nepali', nativeLabel: 'नेपाली', inProgress: true },
  { code: 'si', label: 'Sindhi', nativeLabel: 'سنڌي', inProgress: true },
  { code: 'dg', label: 'Dogri', nativeLabel: 'डोगरी', inProgress: true },
  { code: 'ks', label: 'Kashmiri', nativeLabel: 'کٲشُر', inProgress: true },
  { code: 'br', label: 'Bodo', nativeLabel: 'बड़ो', inProgress: true },
  { code: 'mt', label: 'Maithili', nativeLabel: 'मैथिली', inProgress: true },
  { code: 'st', label: 'Santali', nativeLabel: 'ᱥᱟᱱᱛᱟᱲᱤ', inProgress: true },
]

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [showDevAlert, setShowDevAlert] = useState(false)

  const currentLanguage = languages.find((lang) => lang.code === language)

  const handleLanguageSelect = (lang: typeof languages[0]) => {
    if (lang.inProgress && lang.code !== 'en') {
      setShowDevAlert(true)
      setTimeout(() => setShowDevAlert(false), 2000)
    } else {
      setLanguage(lang.code)
    }
  }

  return (
    <div className="relative">
      <DropdownMenu>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-border hover:bg-accent bg-transparent text-xs sm:text-sm"
            >
              <Globe className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline truncate max-w-[100px]">{currentLanguage?.nativeLabel}</span>
              <span className="sm:hidden">{currentLanguage?.code.toUpperCase()}</span>
            </Button>
          </DropdownMenuTrigger>
        </motion.div>
        <DropdownMenuContent align="end" className="w-56 max-h-64 overflow-y-auto">
          {languages.map((lang) => (
            <motion.div key={lang.code} whileHover={{ x: 4 }}>
              <DropdownMenuItem
                onClick={() => handleLanguageSelect(lang)}
                disabled={lang.inProgress && lang.code !== 'en'}
                className={`cursor-pointer text-sm ${
                  language === lang.code ? 'bg-primary/10' : ''
                } ${lang.inProgress && lang.code !== 'en' ? 'opacity-60' : ''}`}
              >
                <div className="flex-1">
                  <span className="font-medium">{lang.nativeLabel}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{lang.label}</span>
                </div>
                {lang.inProgress && lang.code !== 'en' && (
                  <span className="ml-2 text-xs bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded">
                    Soon
                  </span>
                )}
              </DropdownMenuItem>
            </motion.div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Development In Progress Alert */}
      {showDevAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-12 right-0 bg-amber-500/20 border border-amber-300 dark:border-amber-600 text-amber-800 dark:text-amber-200 px-3 py-2 rounded-lg text-xs whitespace-nowrap z-50 shadow-lg"
        >
          🚀 Development in Progress
        </motion.div>
      )}
    </div>
  )
}
