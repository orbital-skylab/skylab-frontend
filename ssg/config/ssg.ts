/**
 * Configuration constants for Static Site Generation (SSG)
 *
 * Centralized configuration following Single Source of Truth principle.
 * All SSG-related constants are defined here for easy maintainability.
 */

/**
 * Number of projects to display per page in the public gallery
 * Chosen to fit a 4-column grid (7 rows × 4 columns = 28 items)
 */
export const PAGE_SIZE = 28;

/**
 * Maximum number of pages to prebuild during static generation
 * Limits build time while covering most projects (10 pages × 28 = 280 projects)
 */
export const MAX_PAGES_TO_PREBUILD = 10;

/**
 * Page size used when fetching all project IDs for detail page generation
 * Larger size reduces API calls during build
 */
export const PROJECT_PATHS_PAGE_SIZE = 100;

/**
 * Default page number when none is specified
 */
export const DEFAULT_PAGE = 1;

/**
 * API base URL for backend requests
 * Uses environment variable with fallback for local development
 */
export const getApiUrl = (): string => {
  return (
    process.env.NEXT_PUBLIC_BASE_DEV_API_URL || "http://localhost:4000/api"
  );
};
