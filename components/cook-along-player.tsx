"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, SkipForward, X, Youtube, Maximize, Minimize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface Step {
  step_number: number
  instruction: string
  duration_in_seconds: number | null
  video_url?: string | null
  // Support both old and new field names for backwards compatibility
  stepNumber?: number
  durationInSeconds?: number
  videoUrl?: string
}

interface Recipe {
  id: string
  slug?: string
  title: string
  steps: Step[]
}

interface CookAlongPlayerProps {
  recipe: Recipe
}

export function CookAlongPlayer({ recipe }: CookAlongPlayerProps) {
  const router = useRouter()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(
    recipe.steps[0]?.duration_in_seconds ?? recipe.steps[0]?.durationInSeconds ?? 0
  )
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [showIntervalAlert, setShowIntervalAlert] = useState(false)
  const [showVideoPlayer, setShowVideoPlayer] = useState(false) // State for video player visibility
  const [isFullscreen, setIsFullscreen] = useState(false) // Added fullscreen state

  const audioContextRef = useRef<AudioContext | null>(null)
  const lastIntervalAlarmRef = useRef<number>(0)
  const hasPlayedWarningRef = useRef<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null) // Added ref for fullscreen container

  const currentStep = recipe.steps[currentStepIndex]
  const duration = currentStep.duration_in_seconds ?? currentStep.durationInSeconds ?? 0
  const progress = duration > 0 && timeRemaining !== undefined ? ((duration - timeRemaining) / duration) * 100 : 0
  
  // Use slug for navigation, fallback to id
  const recipeRoute = recipe.slug || recipe.id

  const playBeep = useCallback(
    (frequency: number, duration: number, volume: number, type: "warning" | "complete" | "interval") => {
      if (typeof window === "undefined") return

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      const context = audioContextRef.current
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(context.destination)

      oscillator.frequency.value = frequency
      oscillator.type = "triangle" // Triangle wave is louder and more attention-grabbing

      gainNode.gain.setValueAtTime(volume, context.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration)

      oscillator.start(context.currentTime)
      oscillator.stop(context.currentTime + duration)
    },
    [],
  )

  const playWarningSound = useCallback(() => {
    setShowWarning(true)
    setTimeout(() => setShowWarning(false), 3000)

    // Five loud ascending beeps with much longer duration for kitchen noise
    playBeep(700, 0.7, 0.6, "warning")
    setTimeout(() => playBeep(800, 0.7, 0.65, "warning"), 850)
    setTimeout(() => playBeep(900, 0.7, 0.65, "warning"), 1750)
    setTimeout(() => playBeep(1000, 0.8, 0.7, "warning"), 2700)
    setTimeout(() => playBeep(1100, 0.9, 0.75, "warning"), 3750)
  }, [playBeep])

  const playCompleteSound = useCallback(() => {
    // Extended celebratory melody - 6 notes with longer sustain
    playBeep(523, 0.6, 0.5, "complete") // C
    setTimeout(() => playBeep(659, 0.6, 0.55, "complete"), 700) // E
    setTimeout(() => playBeep(784, 0.7, 0.6, "complete"), 1500) // G
    setTimeout(() => playBeep(1047, 0.9, 0.65, "complete"), 2400) // High C
    setTimeout(() => playBeep(988, 0.6, 0.6, "complete"), 3500) // B
    setTimeout(() => playBeep(1047, 1.2, 0.7, "complete"), 4300) // Final High C (long)
  }, [playBeep])

  const playIntervalAlarm = useCallback(() => {
    setShowIntervalAlert(true)
    setTimeout(() => setShowIntervalAlert(false), 3500)

    // Triple beep pattern with longer duration and higher volume
    playBeep(850, 0.7, 0.6, "interval")
    setTimeout(() => playBeep(850, 0.7, 0.6, "interval"), 900)
    setTimeout(() => playBeep(750, 0.6, 0.55, "interval"), 1800)
    setTimeout(() => playBeep(950, 0.8, 0.65, "interval"), 2600)
  }, [playBeep])

  const goToNextStep = useCallback(() => {
    setCompletedSteps((prev) => [...prev, currentStepIndex])

    if (currentStepIndex < recipe.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
      const nextStep = recipe.steps[currentStepIndex + 1]
      const nextDuration = nextStep.duration_in_seconds ?? nextStep.durationInSeconds ?? 0
      setTimeRemaining(nextDuration)
      setIsPlaying(false)
      hasPlayedWarningRef.current = false
      lastIntervalAlarmRef.current = 0
    } else {
      setIsComplete(true)
      setIsPlaying(false)
    }
  }, [currentStepIndex, recipe.steps])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1

          if (newTime === 10 && !hasPlayedWarningRef.current) {
            playWarningSound()
            hasPlayedWarningRef.current = true
          }

          if (newTime <= 0) {
            playCompleteSound()
            goToNextStep()
            return 0
          }

          if (duration > 600) {
            // 10 minutes
            const elapsed = duration - newTime
            const currentInterval = Math.floor(elapsed / 300) // Every 5 minutes (300 seconds)

            if (currentInterval > lastIntervalAlarmRef.current && currentInterval > 0) {
              playIntervalAlarm()
              lastIntervalAlarmRef.current = currentInterval
            }
          }

          return newTime
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [
    isPlaying,
    timeRemaining,
    goToNextStep,
    duration,
    playWarningSound,
    playCompleteSound,
    playIntervalAlarm,
  ])

  useEffect(() => {
    hasPlayedWarningRef.current = false
    lastIntervalAlarmRef.current = 0
    setShowVideoPlayer(false) // Hide video player when step changes
  }, [currentStepIndex])

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const videoUrl = currentStep.video_url ?? currentStep.videoUrl
  const videoId = videoUrl ? getYouTubeVideoId(videoUrl) : null

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const skipStep = () => {
    goToNextStep()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const exitCookAlong = () => {
    router.push(`/recipe/${recipeRoute}`)
  }

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        // Safari
        ;(containerRef.current as any).webkitRequestFullscreen()
      } else if ((containerRef.current as any).mozRequestFullScreen) {
        // Firefox
        ;(containerRef.current as any).mozRequestFullScreen()
      } else if ((containerRef.current as any).msRequestFullscreen) {
        // IE/Edge
        ;(containerRef.current as any).msRequestFullscreen()
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        ;(document as any).webkitExitFullscreen()
      } else if ((document as any).mozCancelFullScreen) {
        ;(document as any).mozCancelFullScreen()
      } else if ((document as any).msExitFullscreen) {
        ;(document as any).msExitFullscreen()
      }
    }
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.addEventListener("mozfullscreenchange", handleFullscreenChange)
    document.addEventListener("MSFullscreenChange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange)
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange)
    }
  }, [])

  if (isComplete) {
    return (
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      >
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: -20,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              y: window.innerHeight + 20,
              rotate: Math.random() * 720 - 360,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 0.5,
              ease: "easeIn",
            }}
            className="absolute w-3 h-3 rounded-full"
            style={{
              backgroundColor: ["#f59e0b", "#ef4444", "#10b981", "#3b82f6", "#8b5cf6"][Math.floor(Math.random() * 5)],
            }}
          />
        ))}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute w-96 h-96 bg-success/30 rounded-full blur-3xl"
        />
        <div className="max-w-2xl w-full text-center space-y-6 relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{
              scale: [0, 1.3, 1],
              rotate: [0, 360, 360],
            }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
              times: [0, 0.6, 1],
            }}
            className="w-28 h-28 bg-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
            >
              <X className="w-14 h-14 text-primary-foreground" />
            </motion.div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl md:text-6xl font-bold text-foreground"
          >
            🎉 Cooking Complete! 🎉
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl md:text-2xl text-muted-foreground"
          >
            Amazing work! Your {recipe.title} is ready to enjoy.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              scale: [0, 1.2, 1],
              rotate: [0, 10, -10, 10, 0],
            }}
            transition={{
              duration: 1,
              delay: 0.8,
              rotate: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.5,
                ease: "easeInOut",
              },
            }}
            className="text-6xl"
          >
            👨‍🍳
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex gap-4 justify-center pt-8"
          >
            <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" onClick={exitCookAlong} className="shadow-lg">
                Back to Recipe
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" onClick={() => router.push("/")} className="shadow-lg">
                Browse More Recipes
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-background">
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-destructive/30 pointer-events-none z-50 flex items-center justify-center backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: [0, 1.3, 1],
                rotate: [0, 10, -10, 0],
              }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.6 }}
              className="bg-destructive text-destructive-foreground px-10 py-6 rounded-2xl text-2xl font-bold shadow-2xl relative"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
              >
                ⏰ Almost Done! 10 seconds left ⏰
              </motion.div>
              <motion.div
                className="absolute inset-0 border-4 border-destructive-foreground rounded-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0, 1],
                }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIntervalAlert && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-accent text-accent-foreground px-8 py-4 rounded-2xl shadow-2xl"
          >
            <motion.div
              animate={{
                rotate: [-10, 10, -10, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 0.5, repeat: 3 }}
              className="flex items-center gap-3"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8 }}
                className="text-3xl"
              >
                🔔
              </motion.div>
              <span className="font-bold text-lg">Check your cooking!</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-card border-b border-border p-4"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex-1">
            <h2 className="font-semibold text-card-foreground">{recipe.title}</h2>
            <p className="text-sm text-muted-foreground">
              Step {currentStepIndex + 1} of {recipe.steps.length}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" onClick={toggleFullscreen} title="Toggle Fullscreen">
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" onClick={exitCookAlong}>
                <X className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-card border-b border-border px-4 pb-4"
      >
        <div className="container mx-auto">
          <Progress value={((currentStepIndex + 1) / recipe.steps.length) * 100} className="h-2" />
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
        <div className="max-w-3xl w-full space-y-8">
          {/* Step Instruction */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4"
              >
                {currentStep.stepNumber}
              </motion.div>
              <p className="text-2xl md:text-4xl font-medium text-foreground leading-relaxed text-balance px-4">
                {currentStep.instruction}
              </p>

              {videoId && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6 space-y-4"
                >
                  {!showVideoPlayer ? (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="lg"
                        variant="outline"
                        className="gap-2 bg-red-500 text-white hover:bg-red-600 hover:text-white border-red-500"
                        onClick={() => setShowVideoPlayer(true)}
                      >
                        <Youtube className="w-5 h-5" />
                        Watch Video Tutorial
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl"
                    >
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
                        title="Step video tutorial"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowVideoPlayer(false)}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Timer Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`bg-timer-bg text-timer-fg rounded-2xl p-8 text-center space-y-4 ${
              timeRemaining <= 10 && timeRemaining > 0 ? "animate-pulse-warning" : ""
            } ${showIntervalAlert ? "animate-glow-pulse" : ""}`}
          >
            <motion.div
              key={timeRemaining}
              initial={{ scale: 1.1 }}
              animate={{
                scale: timeRemaining <= 10 && timeRemaining > 0 ? [1, 1.1, 1] : 1,
                color: timeRemaining <= 10 && timeRemaining > 0 ? ["#ffffff", "#ef4444", "#ffffff"] : "#ffffff",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                ...(timeRemaining <= 10 &&
                  timeRemaining > 0 && {
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 0.5,
                  }),
              }}
              className="text-6xl md:text-8xl font-bold font-mono"
            >
              {formatTime(timeRemaining)}
            </motion.div>
            <Progress value={progress} className="h-3 bg-timer-fg/20" />
            {duration > 600 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-timer-fg/70">
                You'll hear a reminder every 5 minutes
              </motion.p>
            )}
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-transparent" onClick={skipStep}>
                <SkipForward className="w-5 h-5 mr-2" />
                Skip Step
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={isPlaying ? { scale: [1, 1.05, 1] } : {}}
              transition={isPlaying ? { repeat: Number.POSITIVE_INFINITY, duration: 1 } : {}}
            >
              <Button size="lg" className="h-16 w-16 rounded-full" onClick={togglePlayPause}>
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Sticky Bottom - Completed Steps */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-card border-t border-border p-4"
      >
        <div className="container mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {recipe.steps.map((step, index) => (
              <motion.div
                key={step.step_number ?? index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ scale: 1.1 }}
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  completedSteps.includes(index)
                    ? "bg-success text-primary-foreground"
                    : index === currentStepIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {completedSteps.includes(index) ? <X className="w-5 h-5" /> : (step.step_number ?? step.stepNumber ?? index + 1)}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
