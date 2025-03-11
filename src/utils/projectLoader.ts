// Define the Project type
export type ProjectTeamMember = {
  name: string;
  role: string;
  affiliation: string;
};

export type Project = {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  slug: string;
  category: string;
  status: string;
  startDate: string;
  team: ProjectTeamMember[];
  relatedPublications: string[];
  grants: string[];
  tags: string[];
};

type ProjectsData = {
  projects: Project[];
};

import fs from 'fs';
import path from 'path';

/**
 * Load all projects from the JSON file
 * @returns Array of project objects
 */
export function getProjects(): Project[] {
  try {
    const dataDirectory = path.join(process.cwd(), 'src', 'data');
    const filePath = path.join(dataDirectory, 'projects.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data: ProjectsData = JSON.parse(fileContents);
    return data.projects;
  } catch (error) {
    console.error('Error loading projects data:', error);
    return [];
  }
}

/**
 * Get a project by its slug
 * @param slug The project slug to find
 * @returns The project object or null if not found
 */
export function getProjectBySlug(slug: string): Project | null {
  const projects = getProjects();
  return projects.find(project => project.slug === slug) || null;
}

/**
 * Get projects by category
 * @param category The category to filter by
 * @returns Array of projects in the specified category
 */
export function getProjectsByCategory(category: string): Project[] {
  const projects = getProjects();
  return projects.filter(project => project.category === category);
} 