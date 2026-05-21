/**
 * API client for public gallery data fetching
 * Encapsulates all API interactions related to public projects.
 */

import { Project } from "@/types/projects";
import { getApiUrl, PAGE_SIZE } from "@/ssg/config/ssg";

/**
 * Response shape from GET /projects/public
 */
export interface PaginatedProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Response shape from GET /projects/public/count
 */
export interface ProjectsCountResponse {
  total: number;
  totalPages: number;
}

/**
 * Response shape from GET /projects/public/cohorts
 */
export interface PublicProjectCohortsResponse {
  cohortYears: number[];
}

/**
 * Response shape from GET /projects/:id
 */
export interface ProjectResponse {
  project: Project;
}

/**
 * Custom error class for API errors with status code
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function buildUrl(
  endpoint: string,
  queryParams: Record<string, string | number | undefined> = {}
) {
  const baseUrl = getApiUrl().replace(/\/$/, "");
  const url = new URL(`${baseUrl}${endpoint}`);

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

async function fetchJson<T>(
  endpoint: string,
  queryParams: Record<string, string | number | undefined> = {}
): Promise<T> {
  const url = buildUrl(endpoint, queryParams);
  const response = await fetch(url);

  if (!response.ok) {
    throw new ApiError(
      `Failed to fetch ${endpoint}: ${response.statusText}`,
      response.status,
      url
    );
  }

  return response.json();
}

/**
 * Fetch paginated public projects
 *
 * @param page - Page number (1-indexed)
 * @param limit - Number of projects per page
 * @param achievement - Optional achievement level filter (e.g., "ARTEMIS", "APOLLO")
 * @returns Paginated projects with metadata
 * @throws ApiError if request fails
 */
export async function fetchPublicProjects(
  page = 1,
  limit = PAGE_SIZE,
  achievement?: string,
  cohortYear?: number
): Promise<PaginatedProjectsResponse> {
  return fetchJson<PaginatedProjectsResponse>("/projects/public", {
    page,
    limit,
    achievement,
    cohortYear,
  });
}

/**
 * Fetch public projects count (metadata only)
 * Used by getStaticPaths to determine number of pages without fetching all projects
 *
 * @param limit - Page size for totalPages calculation
 * @param achievement - Optional achievement level filter (e.g., "artemis", "apollo")
 * @returns Total count and total pages
 * @throws ApiError if request fails
 */
export async function fetchPublicProjectsCount(
  limit: number = PAGE_SIZE,
  achievement?: string,
  cohortYear?: number
): Promise<ProjectsCountResponse> {
  return fetchJson<ProjectsCountResponse>("/projects/public/count", {
    limit,
    achievement,
    cohortYear,
  });
}

/**
 * Fetch cohort years that have public projects
 */
export async function fetchPublicProjectCohorts(): Promise<number[]> {
  const response = await fetchJson<PublicProjectCohortsResponse>(
    "/projects/public/cohorts"
  );
  return response.cohortYears;
}

/**
 * Fetch a single project by ID
 *
 * @param projectId - Project ID
 * @returns Project data
 * @throws ApiError if request fails or project not found
 */
export async function fetchProjectById(
  projectId: string | number
): Promise<ProjectResponse> {
  return fetchJson<ProjectResponse>(`/projects/${projectId}`);
}

/**
 * Fetch all public project IDs for static path generation
 * Iterates through all pages to collect complete project list
 *
 * @param pageSize - Page size for fetching (larger = fewer requests)
 * @returns Array of all project IDs
 * @throws ApiError if any request fails
 */
export async function fetchAllPublicProjectIds(
  pageSize = 100
): Promise<number[]> {
  const firstPageData = await fetchPublicProjects(1, pageSize);

  let allProjects = [...firstPageData.projects];
  const { totalPages } = firstPageData;

  // Fetch remaining pages if needed
  for (let page = 2; page <= totalPages; page++) {
    const pageData = await fetchPublicProjects(page, pageSize);
    allProjects = allProjects.concat(pageData.projects);
  }

  return allProjects.map((project) => project.id);
}
