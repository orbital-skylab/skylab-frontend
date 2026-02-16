/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/**
 * Unit tests for SSG functions in pages/public-gallery/[level]/page/[page].tsx
 *
 * Tests getStaticPaths() and getStaticProps() for per-achievement paginated gallery pages:
 * - getStaticPaths: generates paths for each achievement level × page combination
 * - getStaticProps: fetches paginated project data filtered by achievement level
 */

// Mock React component dependencies to avoid import resolution issues
jest.mock("@/components/cards/ProjectCard/ProjectCard", () => {
  function MockProjectCard() {
    return null;
  }
  MockProjectCard.displayName = "MockProjectCard";
  return MockProjectCard;
});
jest.mock("@/components/layout/CustomHead", () => {
  function MockCustomHead() {
    return null;
  }
  MockCustomHead.displayName = "MockCustomHead";
  return MockCustomHead;
});
jest.mock("@/helpers/publicGallery", () => ({
  filterProjects: jest.fn(),
  extractCohortYears: jest.fn(() => []),
  getMostRecentCohort: jest.fn(() => ""),
}));
jest.mock("@/styles/constants", () => ({}));

// Mock SSG config
jest.mock("@/ssg/config/ssg", () => ({
  PAGE_SIZE: 28,
  MAX_PAGES_TO_PREBUILD: 10,
  DEFAULT_PAGE: 1,
  getApiUrl: () => "http://localhost:4000/api",
}));

// Mock the API module with inline ApiError class
const mockFetchPublicProjectsCountFn = jest.fn();
const mockFetchPublicProjectsFn = jest.fn();

jest.mock("@/lib/api/projectsApi", () => {
  class ApiError extends Error {
    statusCode: number;
    endpoint: string;
    constructor(message: string, statusCode: number, endpoint: string) {
      super(message);
      this.name = "ApiError";
      this.statusCode = statusCode;
      this.endpoint = endpoint;
    }
  }
  return {
    __esModule: true,
    fetchPublicProjectsCount: (...args: any[]) =>
      mockFetchPublicProjectsCountFn(...args),
    fetchPublicProjects: (...args: any[]) => mockFetchPublicProjectsFn(...args),
    ApiError,
  };
});

// Import after mocks are set up
import {
  getStaticPaths,
  getStaticProps,
} from "../../pages/public-gallery/[level]/page/[page]";
import { ApiError } from "@/lib/api/projectsApi";

beforeEach(() => {
  jest.clearAllMocks();
  // Suppress console.error for expected error scenarios
  jest.spyOn(console, "error").mockImplementation(() => null);
});

describe("getStaticPaths", () => {
  it("generates paths for each level and caps pages at MAX_PAGES_TO_PREBUILD", async () => {
    mockFetchPublicProjectsCountFn.mockResolvedValue({
      total: 500,
      totalPages: 18,
    });

    const result = await getStaticPaths({});

    // Should call fetchPublicProjectsCount for each of 4 levels (artemis, apollo, gemini, vostok)
    expect(mockFetchPublicProjectsCountFn).toHaveBeenCalledTimes(4);
    // Each level should have up to MAX_PAGES_TO_PREBUILD (10) pages
    expect(result.paths.length).toBe(40); // 4 levels × 10 pages
    expect(result.paths[0]).toEqual({
      params: { level: "artemis", page: "1" },
    });
    expect(result.paths[9]).toEqual({
      params: { level: "artemis", page: "10" },
    });
    expect(result.paths[10]).toEqual({
      params: { level: "apollo", page: "1" },
    });
    expect(result.fallback).toBe(false);
  });

  it("generates at least 1 page per level when totalPages is 0 (empty DB)", async () => {
    mockFetchPublicProjectsCountFn.mockResolvedValue({
      total: 0,
      totalPages: 0,
    });

    const result = await getStaticPaths({});

    expect(result.paths.length).toBe(4); // 4 levels × 1 page each
    expect(result.paths[0]).toEqual({
      params: { level: "artemis", page: "1" },
    });
    expect(result.paths[1]).toEqual({ params: { level: "apollo", page: "1" } });
  });

  it("falls back to single page per level on API error", async () => {
    mockFetchPublicProjectsCountFn.mockRejectedValue(
      new ApiError(
        "Server Error",
        500,
        "/projects/public/count?achievement=artemis"
      )
    );

    const result = await getStaticPaths({});

    expect(result.paths.length).toBe(4); // 4 levels × 1 page fallback each
    expect(result.paths[0]).toEqual({
      params: { level: "artemis", page: "1" },
    });
  });

  it("logs error with context on ApiError per level", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error");
    mockFetchPublicProjectsCountFn.mockRejectedValue(
      new ApiError(
        "Server Error",
        500,
        "/projects/public/count?achievement=artemis"
      )
    );

    await getStaticPaths({});

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("[SSG] Failed to fetch paths for"),
      expect.stringContaining("API Error (500)")
    );
  });

  it("logs error on unknown error per level", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error");
    mockFetchPublicProjectsCountFn.mockRejectedValue(
      new Error("Connection refused")
    );

    await getStaticPaths({});

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("[SSG] Failed to fetch paths for"),
      expect.stringContaining("Unknown error")
    );
  });
});

describe("getStaticProps", () => {
  const mockProjectsResponse = {
    projects: [
      {
        id: 1,
        name: "Project 1",
        teamName: "Team 1",
        achievement: "Artemis",
        cohortYear: 2024,
        hasDropped: false,
      },
    ],
    total: 50,
    page: 1,
    pageSize: 28,
    totalPages: 2,
  };

  it("fetches projects for a level and returns props with correct structure", async () => {
    mockFetchPublicProjectsFn.mockResolvedValue(mockProjectsResponse);

    const result = await getStaticProps({
      params: { level: "artemis", page: "1" },
    } as any);

    expect(mockFetchPublicProjectsFn).toHaveBeenCalledWith(1, 28, "Artemis");
    expect(result).toEqual({
      props: {
        projects: mockProjectsResponse.projects,
        currentPage: 1,
        totalPages: 2,
        total: 50,
        level: "artemis",
      },
    });
  });

  it("returns notFound when page exceeds totalPages for a level", async () => {
    const response = { ...mockProjectsResponse, totalPages: 2 };
    mockFetchPublicProjectsFn.mockResolvedValue(response);

    const result = await getStaticProps({
      params: { level: "apollo", page: "5" },
    } as any);

    expect(result).toEqual({ notFound: true });
  });

  it("handles empty DB (totalPages = 0) gracefully for a level", async () => {
    const emptyResponse = {
      projects: [],
      total: 0,
      page: 1,
      pageSize: 28,
      totalPages: 0,
    };
    mockFetchPublicProjectsFn.mockResolvedValue(emptyResponse);

    const result = await getStaticProps({
      params: { level: "gemini", page: "1" },
    } as any);

    expect((result as any).props.projects).toBeDefined();
    expect((result as any).props.totalPages).toBeGreaterThanOrEqual(1);
    expect((result as any).props.level).toBe("gemini");
  });

  it("returns fallback props on API error for a level", async () => {
    mockFetchPublicProjectsFn.mockRejectedValue(
      new ApiError(
        "Internal Error",
        500,
        "/projects/public?page=1&limit=28&achievement=Artemis"
      )
    );
    const result = await getStaticProps({
      params: { level: "artemis", page: "1" },
    } as any);

    expect(result).toEqual({
      props: {
        projects: [],
        currentPage: 1,
        totalPages: 1,
        total: 0,
        level: "artemis",
      },
    });
  });

  it("logs error with context on ApiError for a level", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error");
    mockFetchPublicProjectsFn.mockRejectedValue(
      new ApiError(
        "Server Error",
        500,
        "/projects/public?page=1&limit=28&achievement=Apollo"
      )
    );

    await getStaticProps({
      params: { level: "apollo", page: "1" },
    } as any);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "[SSG] Failed to fetch apollo projects for page 1"
      ),
      expect.stringContaining("API Error (500)")
    );
  });

  it("logs error on unknown error for a level", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error");
    mockFetchPublicProjectsFn.mockRejectedValue(new Error("Timeout"));

    await getStaticProps({
      params: { level: "vostok", page: "3" },
    } as any);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "[SSG] Failed to fetch vostok projects for page 3"
      ),
      expect.stringContaining("Unknown error")
    );
  });

  it("defaults to page 1 and level artemis for invalid params", async () => {
    mockFetchPublicProjectsFn.mockResolvedValue(mockProjectsResponse);

    await getStaticProps({ params: {} } as any);

    expect(mockFetchPublicProjectsFn).toHaveBeenCalledWith(1, 28, "Artemis");
  });
});
