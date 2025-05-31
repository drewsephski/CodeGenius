"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Tab = {
  id: string
  title: string
  content: string
}

type Card = {
  id: number
  title: string
  tabs: Tab[]
}

type TabCardProps = {
  card: Card
}

export function TabCard({ card }: TabCardProps) {
  const [activeTab, setActiveTab] = useState(card.tabs[0].id)

  return (
    <motion.div
      className="bg-black/60 backdrop-blur-md border border-purple-500/20 rounded-xl overflow-hidden h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Card Header */}
      <div className="p-6 border-b border-purple-500/20">
        <motion.h3
          className="text-2xl md:text-3xl font-bold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {card.title}
        </motion.h3>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-purple-500/20">
        {card.tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`px-6 py-4 text-sm font-medium relative ${
              activeTab === tab.id ? "text-purple-400" : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.title}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                layoutId="activeTab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 h-[300px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {card.tabs.map(
            (tab) =>
              activeTab === tab.id && (
                <motion.div
                  key={tab.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-center max-w-2xl"
                >
                  <p className="text-lg text-gray-200 leading-relaxed">{tab.content}</p>

                  {/* Interactive Element */}
                  <motion.button
                    className="mt-8 px-6 py-3 bg-purple-600/30 hover:bg-purple-600/50 text-white rounded-full border border-purple-500/30 backdrop-blur-sm"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(139, 92, 246, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              ),
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
