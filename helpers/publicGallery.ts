import { LEVELS_OF_ACHIEVEMENT, Project } from "@/types/projects";

export type PublicGalleryPageProps = {
  projects: Project[];
  currentPage: number;
  totalPages: number;
  total: number;
  level: string;
  cohortYear: number;
  cohortYears: number[];
};

export const slugToLevel = (slug: string): LEVELS_OF_ACHIEVEMENT => {
  const pascalCase = slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
  const matchingLevel = Object.values(LEVELS_OF_ACHIEVEMENT).find(
    (level) => level === pascalCase
  );
  return matchingLevel || LEVELS_OF_ACHIEVEMENT.ARTEMIS;
};

export const levelToSlug = (level: LEVELS_OF_ACHIEVEMENT): string => {
  return level.toLowerCase();
};

/**
 * Filters projects by achievement level and cohort year for public gallery display
 */
export const filterProjects = (
  projects: Project[],
  selectedLevel: LEVELS_OF_ACHIEVEMENT,
  selectedCohort: number | ""
): Project[] => {
  return projects.filter((project) => {
    const matchesLevel = project.achievement === selectedLevel;
    const matchesCohort =
      selectedCohort === "" || project.cohortYear === selectedCohort;
    return matchesLevel && matchesCohort && !project.hasDropped;
  });
};

/**
 * Filters projects by achievement level only (no cohort filter)
 */
export const filterProjectsByLevel = (
  projects: Project[],
  selectedLevel: LEVELS_OF_ACHIEVEMENT
): Project[] => {
  return projects.filter(
    (project) => project.achievement === selectedLevel && !project.hasDropped
  );
};

/**
 * Extracts unique cohort years from projects, sorted descending (newest first)
 */
export const extractCohortYears = (projects: Project[]): number[] => {
  return Array.from(new Set(projects.map((p) => p.cohortYear))).sort(
    (a, b) => b - a
  );
};

/**
 * Gets the most recent cohort year from a list of projects
 */
export const getMostRecentCohort = (projects: Project[]): number | "" => {
  const years = extractCohortYears(projects);
  return years.length > 0 ? years[0] : "";
};
