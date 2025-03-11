'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { getTimelineEvents, getResearchAreaById } from '@/utils/researchLoader';

export default function ResearchTimeline() {
  const events = getTimelineEvents().sort((a, b) => a.year - b.year);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">Research Timeline</h2>
      
      <div className="relative border-l-2 border-slate-200 dark:border-slate-700 pl-8 ml-4 space-y-10">
        {events.map((event, index) => {
          const area = getResearchAreaById(event.area);
          
          return (
            <TimelineItem 
              key={`${event.year}-${index}`}
              event={event}
              index={index}
              areaColor={area?.color || 'blue'}
            />
          );
        })}
      </div>
    </div>
  );
}

interface TimelineItemProps {
  event: {
    year: number;
    event: string;
    area: string;
    description: string;
  };
  index: number;
  areaColor: string;
}

// Color mapping for timeline bullets
const bulletColorMap: Record<string, string> = {
  'blue': 'bg-blue-500 dark:bg-blue-400',
  'purple': 'bg-purple-500 dark:bg-purple-400',
  'green': 'bg-green-500 dark:bg-green-400',
  'orange': 'bg-orange-500 dark:bg-orange-400',
  'red': 'bg-red-500 dark:bg-red-400'
};

// Text color mapping for year labels
const textColorMap: Record<string, string> = {
  'blue': 'text-blue-600 dark:text-blue-300',
  'purple': 'text-purple-600 dark:text-purple-300',
  'green': 'text-green-600 dark:text-green-300',
  'orange': 'text-orange-600 dark:text-orange-300',
  'red': 'text-red-600 dark:text-red-300'
};

function TimelineItem({ event, index, areaColor }: TimelineItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative"
    >
      {/* Bullet point */}
      <div className={`absolute -left-11 w-5 h-5 rounded-full ${bulletColorMap[areaColor]}`} />
      
      {/* Year label */}
      <div className={`text-xl font-bold mb-2 ${textColorMap[areaColor]}`}>
        {event.year}
      </div>
      
      {/* Event title */}
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
        {event.event}
      </h3>
      
      {/* Description */}
      <p className="text-slate-600 dark:text-slate-300">
        {event.description}
      </p>
    </motion.div>
  );
} 