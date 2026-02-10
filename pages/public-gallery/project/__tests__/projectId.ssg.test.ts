/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/**
 * Unit tests for SSG functions in pages/public-gallery/project/[projectId].tsx
 *
 * Tests getStaticPaths() and getStaticProps() for the individual project detail page:
 * - getStaticPaths: fetches all public project IDs for path generation
 * - getStaticProps: fetches single project data by ID
 */

// Mock React component dependencies to avoid import resolution issues
jest.mock("@/components/layout/CustomHead", () => () => null);
jest.mock("@/components/typography/Attribute", () => () => null);
jest.mock("@/components/typography/UsersName", () => () => null);
jest.mock("@/helpers/errors", () => ({
  getImageOrDefault: jest.fn((url: string) => url),
}));
jest.mock("@/styles/constants", () => ({}));

// Mock the API module
const mockFetchAllPublicProjectIds = jest.fn();
const mockFetchProjectById = jest.fn();

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
    fetchAllPublicProjectIds: (...args: any[]) =>
      mockFetchAllPublicProjectIds(...args),
    fetchProjectById: (...args: any[]) => mockFetchProjectById(...args),
    ApiError,
  };
});

// Mock SSG config
jest.mock("@/ssg/config/ssg", () => ({
  PROJECT_PATHS_PAGE_SIZE: 100,
  PAGE_SIZE: 28,
  MAX_PAGES_TO_PREBUILD: 10,
  DEFAULT_PAGE: 1,
  getApiUrl: () => "http://localhost:4000/api",
}));

import { getStaticPaths, getStaticProps } from "../[projectId]";
import { ApiError } from "@/lib/api/projectsApi";

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => null);
});

describe("getStaticPaths", () => {
  it("generates paths for all public project IDs", async () => {
    mockFetchAllPublicProjectIds.mockResolvedValue([1, 2, 3, 5, 10]);

    const result = await getStaticPaths({});

    expect(mockFetchAllPublicProjectIds).toHaveBeenCalledWith(100); // PROJECT_PATHS_PAGE_SIZE
    expect(result.paths).toEqual([
      { params: { projectId: "1" } },
      { params: { projectId: "2" } },
      { params: { projectId: "3" } },
      { params: { projectId: "5" } },
      { params: { projectId: "10" } },
    ]);
    expect(result.fallback).toBe(false);
  });

  it("returns empty paths when no public projects exist", async () => {
    mockFetchAllPublicProjectIds.mockResolvedValue([]);

    const result = await getStaticPaths({});

    expect(result.paths).toEqual([]);
    expect(result.fallback).toBe(false);
  });

  it("returns empty paths on API error", async () => {
    mockFetchAllPublicProjectIds.mockRejectedValue(
      new ApiError("Server Error", 500, "/projects/public")
    );

    const result = await getStaticPaths({});

    expect(result.paths).toEqual([]);
  });

  it("logs error with context on ApiError", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error");
    mockFetchAllPublicProjectIds.mockRejectedValue(
      new ApiError("Server Error", 500, "/projects/public")
    );

    await getStaticPaths({});

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[SSG] Failed to fetch project paths:",
      expect.stringContaining("API Error (500)")
    );
  });

  it("logs error on unknown error", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error");
    mockFetchAllPublicProjectIds.mockRejectedValue(
      new Error("Network timeout")
    );

    await getStaticPaths({});

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[SSG] Failed to fetch project paths:",
      expect.stringContaining("Unknown error")
    );
  });
});

describe("getStaticProps", () => {
  const mockProject = {
    id: 1,
    name: "Test Project",
    teamName: "Team Test",
    achievement: "Artemis",
    cohortYear: 2024,
    hasDropped: false,
    students: [],
    adviser: null,
    mentor: null,
    posterUrl: "https://example.com/poster.jpg",
    videoUrl: null,
    proposalPdf: null,
  };

  it("fetches project by ID and returns props", async () => {
    mockFetchProjectById.mockResolvedValue({ project: mockProject });

    const result = await getStaticProps({
      params: { projectId: "1" },
    } as any);

    expect(mockFetchProjectById).toHaveBeenCalledWith("1");
    expect(result).toEqual({
      props: {
        project: mockProject,
      },
    });
  });

  it("returns notFound for dropped projects", async () => {
    const droppedProject = { ...mockProject, hasDropped: true };
    mockFetchProjectById.mockResolvedValue({ project: droppedProject });

    const result = await getStaticProps({
      params: { projectId: "6" },
    } as any);

    expect(result).toEqual({ notFound: true });
  });

  it("returns notFound when project is missing or null", async () => {
    mockFetchProjectById.mockResolvedValue({ project: null });

    const result = await getStaticProps({
      params: { projectId: "999" },
    } as any);

    expect(result).toEqual({ notFound: true });
  });

  it("returns notFound on API error", async () => {
    mockFetchProjectById.mockRejectedValue(
      new ApiError("Not Found", 404, "/projects/999")
    );

    const result = await getStaticProps({
      params: { projectId: "999" },
    } as any);

    expect(result).toEqual({ notFound: true });
  });

  it("logs error with context on ApiError", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error");
    mockFetchProjectById.mockRejectedValue(
      new ApiError("Server Error", 500, "/projects/1")
    );

    await getStaticProps({ params: { projectId: "1" } } as any);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("[SSG] Failed to fetch project 1"),
      expect.stringContaining("API Error (500)")
    );
  });

  it("logs error on unknown error", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error");
    mockFetchProjectById.mockRejectedValue(new Error("Timeout"));

    await getStaticProps({ params: { projectId: "42" } } as any);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("[SSG] Failed to fetch project 42"),
      expect.stringContaining("Unknown error")
    );
  });

  it("preserves all project fields in props", async () => {
    const fullProject = {
      ...mockProject,
      posterUrl: "https://example.com/poster.jpg",
      videoUrl: "https://example.com/video",
      proposalPdf: "https://example.com/proposal.pdf",
      students: [
        { id: 1, name: "Student One" },
        { id: 2, name: "Student Two" },
      ],
      adviser: { adviserId: 1, name: "Adviser One" },
      mentor: { mentorId: 1, name: "Mentor One" },
    };
    mockFetchProjectById.mockResolvedValue({ project: fullProject });

    const result = await getStaticProps({
      params: { projectId: "1" },
    } as any);

    expect((result as any).props.project).toEqual(fullProject);
  });
});
