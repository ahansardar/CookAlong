"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export function AnimatedLogo() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial="hidden"
      animate="visible"
    >
      {/* Chef Hat */}
      <motion.path
        d="M8 16C8 12.6863 10.6863 10 14 10C14.7403 10 15.4463 10.1396 16.0922 10.3944C17.1308 8.33481 19.3176 7 21.8333 7C24.3491 7 26.5359 8.33481 27.5745 10.3944C28.2204 10.1396 28.9264 10 29.6667 10C33.3486 10 36.3333 12.9848 36.3333 16.6667C36.3333 17.2189 36.2639 17.7553 36.1331 18.2667L33 30H11L7.86688 18.2667C7.73607 17.7553 7.66667 17.2189 7.66667 16.6667C7.66667 16.4438 7.67925 16.2238 7.70387 16.0075"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: 1,
          opacity: 1,
          rotate: isHovered ? [0, -5, 5, 0] : 0,
        }}
        transition={{
          pathLength: { duration: 1, ease: "easeOut" },
          opacity: { duration: 0.5 },
          rotate: { duration: 0.6, ease: "easeInOut" },
        }}
      />
      <motion.line
        x1="11"
        y1="30"
        x2="11"
        y2="33"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      <motion.line
        x1="33"
        y1="30"
        x2="33"
        y2="33"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />

      {/* Steam Lines - Animated */}
      {[
        { d: "M15 8C15 8 15.5 5 16 4", delay: 0.4 },
        { d: "M20 6C20 6 20.5 3 21 2", delay: 0.5 },
        { d: "M25 8C25 8 25.5 5 26 4", delay: 0.6 },
      ].map((steam, index) => (
        <motion.path
          key={index}
          d={steam.d}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
          initial={{ y: 20, opacity: 0 }}
          animate={{
            y: [0, -3, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            y: {
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: steam.delay,
            },
            opacity: {
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: steam.delay,
            },
          }}
        />
      ))}

      {/* Spoon */}
      <motion.ellipse
        cx="22"
        cy="36"
        rx="3"
        ry="2"
        fill="currentColor"
        opacity="0.8"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 0.8,
          rotate: isHovered ? [0, -10, 0] : 0,
          x: isHovered ? [0, -2, 2, 0] : 0,
        }}
        transition={{
          scale: { duration: 0.6, delay: 0.5 },
          opacity: { duration: 0.4, delay: 0.5 },
          rotate: { duration: 0.8 },
          x: { duration: 0.8 },
        }}
      />
      <motion.line
        x1="22"
        y1="34"
        x2="22"
        y2="30"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: 1,
          opacity: 0.8,
          rotate: isHovered ? [0, -10, 0] : 0,
          x: isHovered ? [0, -2, 2, 0] : 0,
        }}
        transition={{
          pathLength: { duration: 0.6, delay: 0.6 },
          opacity: { duration: 0.4, delay: 0.6 },
          rotate: { duration: 0.8 },
          x: { duration: 0.8 },
        }}
      />
    </motion.svg>
  )
}
