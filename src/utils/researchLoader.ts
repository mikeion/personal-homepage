// Import the JSON data directly
import researchData from '@/data/research-areas.json';

// Define types for research data
export type ResearchTag = string;

export interface ResearchArea {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  startYear: number;
  tags: ResearchTag[];
  coreQuestions: string[];
  publications: string[];
}

export interface TimelineEvent {
  year: number;
  event: string;
  area: string;
  description: string;
}

export interface ResearchData {
  researchAreas: ResearchArea[];
  timelineEvents: TimelineEvent[];
  allTags: ResearchTag[];
}

/**
 * Get all research areas
 */
export function getResearchAreas(): ResearchArea[] {
  return researchData.researchAreas;
}

/**
 * Get a specific research area by ID
 */
export function getResearchAreaById(id: string): ResearchArea | undefined {
  return researchData.researchAreas.find(area => area.id === id);
}

/**
 * Get all timeline events sorted by year
 */
export function getTimelineEvents(): TimelineEvent[] {
  return [...researchData.timelineEvents].sort((a, b) => a.year - b.year);
}

/**
 * Get all tags used across research areas
 */
export function getAllTags(): ResearchTag[] {
  return researchData.allTags;
}

/**
 * Get research areas that contain a specific tag
 */
export function getResearchAreasByTag(tag: ResearchTag): ResearchArea[] {
  return researchData.researchAreas.filter(area => area.tags.includes(tag));
}

/**
 * Get timeline events for a specific research area
 */
export function getTimelineEventsByArea(areaId: string): TimelineEvent[] {
  return researchData.timelineEvents
    .filter(event => event.area === areaId)
    .sort((a, b) => a.year - b.year);
} 