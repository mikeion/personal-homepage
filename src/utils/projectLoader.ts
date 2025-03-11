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

// Hard-coded project data to avoid needing fs on the client
const projectsData: ProjectsData = {
  projects: [
    {
      id: "simulated-teaching",
      title: "Simulated Teaching and Learning at Scale",
      shortDescription: "Developing frameworks to evaluate AI-generated educational dialogues along two critical dimensions: simulation fidelity and interaction effectiveness.",
      fullDescription: "Developing frameworks to evaluate AI-generated educational dialogues along two critical dimensions: simulation fidelity (how realistically LLMs mimic student behavior) and interaction effectiveness (whether these exchanges produce meaningful learning). This research helps distinguish between LLMs that merely \"sound like\" students versus those that facilitate genuine educational progress.",
      image: "https://picsum.photos/seed/simulated-teaching/800/600",
      slug: "simulated-teaching-learning-scale",
      category: "AI in Education",
      status: "In Progress",
      startDate: "2023-09",
      team: [
        {
          name: "Michael Ion",
          role: "Principal Investigator",
          affiliation: "University of Michigan"
        },
        {
          name: "Kevyn Collins-Thompson",
          role: "Co-Investigator",
          affiliation: "University of Michigan"
        },
        {
          name: "Sumit Asthana",
          role: "Research Assistant",
          affiliation: "University of Michigan"
        }
      ],
      relatedPublications: [
        "Simulated Teaching and Learning at Scale: Balancing Fidelity and Effectiveness in Tutoring Interactions"
      ],
      grants: [
        "Academic Innovation Fund (2024)"
      ],
      tags: ["AI", "education", "dialogue systems", "LLMs", "teaching", "learning"]
    },
    {
      id: "technical-interviews",
      title: "AI-Enhanced Technical Interview Preparation",
      shortDescription: "Creating scalable, personalized technical interview practice for data science students by combining expert human interviews with AI simulation.",
      fullDescription: "Creating scalable, personalized technical interview practice for data science students by combining expert human interviews with AI simulation. This project identifies effective interviewing patterns through real student interactions, then develops an adaptive AI platform that helps students articulate technical concepts, improve communication skills, and prepare for industry positions at their own pace.",
      image: "https://picsum.photos/seed/technical-interviews/800/600",
      slug: "ai-enhanced-technical-interviews",
      category: "AI Applications",
      status: "Active",
      startDate: "2024-01",
      team: [
        {
          name: "Michael Ion",
          role: "Co-Principal Investigator",
          affiliation: "University of Michigan"
        },
        {
          name: "Kevyn Collins-Thompson",
          role: "Co-Principal Investigator",
          affiliation: "University of Michigan"
        }
      ],
      relatedPublications: [
        "Learning Through Technical Interviews: Combining Data Science Mentorship with AI-Powered Practice"
      ],
      grants: [
        "Academic Innovation Fund (2024): $12,435"
      ],
      tags: ["AI", "technical interviews", "data science", "education", "mentorship"]
    }
  ]
};

/**
 * Load all projects
 * @returns Array of project objects
 */
export function getProjects(): Project[] {
  return projectsData.projects;
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