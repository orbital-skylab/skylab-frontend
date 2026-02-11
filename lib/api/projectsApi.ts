/**
 * API client for public gallery data fetching
 * Encapsulates all API interactions related to public projects.
 */

import { Project } from "@/types/projects";
import { PAGE_SIZE } from "@/ssg/config/ssg";
import { ApiServiceBuilder } from "@/helpers/api";
import { HTTP_METHOD } from "@/types/api";

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
  achievement?: string
): Promise<PaginatedProjectsResponse> {
  const queryParams: Record<string, string | number> = { page, limit };
  if (achievement) {
    queryParams.achievement = achievement;
  }

  const apiService = new ApiServiceBuilder({
    method: HTTP_METHOD.GET,
    endpoint: "/projects/public",
    queryParams,
  }).build();

  const response = await apiService();

  if (!response.ok) {
    throw new ApiError(
      `Failed to fetch public projects: ${response.statusText}`,
      response.status,
      `/projects/public?page=${page}&limit=${limit}${
        achievement ? `&achievement=${achievement}` : ""
      }`
    );
  }

  return response.json();
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
  achievement?: string
): Promise<ProjectsCountResponse> {
  const queryParams: Record<string, string | number> = { limit };
  if (achievement) {
    queryParams.achievement = achievement;
  }

  const apiService = new ApiServiceBuilder({
    method: HTTP_METHOD.GET,
    endpoint: "/projects/public/count",
    queryParams,
  }).build();

  const response = await apiService();

  if (!response.ok) {
    throw new ApiError(
      `Failed to fetch projects count: ${response.statusText}`,
      response.status,
      `/projects/public/count?limit=${limit}`
    );
  }

  return response.json();
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
  const apiService = new ApiServiceBuilder({
    method: HTTP_METHOD.GET,
    endpoint: `/projects/${projectId}`,
  }).build();

  const response = await apiService();

  if (!response.ok) {
    throw new ApiError(
      `Failed to fetch project ${projectId}: ${response.statusText}`,
      response.status,
      `/projects/${projectId}`
    );
  }

  return response.json();
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
