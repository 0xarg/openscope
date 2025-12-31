"use client"

import { motion } from "framer-motion"

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <motion.div
        className="flex items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="h-2 w-2 rounded-full bg-accent"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
        />
        <motion.div
          className="h-2 w-2 rounded-full bg-accent"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, delay: 0.15 }}
        />
        <motion.div
          className="h-2 w-2 rounded-full bg-accent"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
        />
      </motion.div>
    </div>
  )
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-1">
          <span className="brand-text text-2xl">Dev</span>
          <span className="brand-text brand-text-accent text-2xl">Lens</span>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.div
            className="h-2 w-2 rounded-full bg-accent"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
          />
          <motion.div
            className="h-2 w-2 rounded-full bg-accent"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, delay: 0.15 }}
          />
          <motion.div
            className="h-2 w-2 rounded-full bg-accent"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
          />
        </div>
      </motion.div>
    </div>
  )
}
