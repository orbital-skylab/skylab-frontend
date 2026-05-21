/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/**
 * Unit tests for cohort-aware SSG functions in
 * pages/public-gallery/[cohortYear]/[level]/page/[page].tsx
 */

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
jest.mock("@/styles/constants", () => ({}));

jest.mock("@/ssg/config/ssg", () => ({
  PAGE_SIZE: 28,
  PUBLIC_GALLERY_BUILD_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
  getApiUrl: () => "http://localhost:4000/api",
  isPublicGallerySsgOffline: () =>
    process.env.PUBLIC_GALLERY_SSG_OFFLINE === "true",
}));

const mockFetchPublicProjectCohortsFn = jest.fn();
const mockFetchPublicProjectsCountFn = jest.fn();
const mockFetchPublicProjectsFn = jest.fn();

jest.mock("@/lib/api/projectsApi", () => ({
  __esModule: true,
  fetchPublicProjectCohorts: (...args: any[]) =>
    mockFetchPublicProjectCohortsFn(...args),
  fetchPublicProjectsCount: (...args: any[]) =>
    mockFetchPublicProjectsCountFn(...args),
  fetchPublicProjects: (...args: any[]) => mockFetchPublicProjectsFn(...args),
}));

import {
  getStaticPaths,
  getStaticProps,
} from "../../pages/public-gallery/[cohortYear]/[level]/page/[page]";
import { getStaticProps as getIndexStaticProps } from "../../pages/public-gallery";

beforeEach(() => {
  delete process.env.PUBLIC_GALLERY_SSG_OFFLINE;
  jest.clearAllMocks();
});

afterEach(() => {
  delete process.env.PUBLIC_GALLERY_SSG_OFFLINE;
});

describe("getStaticPaths", () => {
  it("generates all paths for each public cohort, level, and page", async () => {
    mockFetchPublicProjectCohortsFn.mockResolvedValue([2026, 2025]);
    mockFetchPublicProjectsCountFn.mockResolvedValue({
      total: 336,
      totalPages: 12,
    });

    const result = await getStaticPaths({});

    expect(mockFetchPublicProjectCohortsFn).toHaveBeenCalledTimes(1);
    expect(mockFetchPublicProjectsCountFn).toHaveBeenCalledTimes(8);
    expect(mockFetchPublicProjectsCountFn).toHaveBeenCalledWith(
      28,
      "artemis",
      2026
    );
    expect(result.paths).toContainEqual({
      params: { cohortYear: "2026", level: "artemis", page: "1" },
    });
    expect(result.paths).toContainEqual({
      params: { cohortYear: "2025", level: "vostok", page: "12" },
    });
    expect(result.paths.length).toBe(96);
    expect(result.fallback).toBe(false);
  });

  it("generates at least one page for empty cohort-level combinations", async () => {
    mockFetchPublicProjectCohortsFn.mockResolvedValue([2026]);
    mockFetchPublicProjectsCountFn.mockResolvedValue({
      total: 0,
      totalPages: 0,
    });

    const result = await getStaticPaths({});

    expect(result.paths.length).toBe(4);
    expect(result.paths[0]).toEqual({
      params: { cohortYear: "2026", level: "artemis", page: "1" },
    });
  });

  it("fails the build when cohort discovery fails", async () => {
    mockFetchPublicProjectCohortsFn.mockRejectedValue(
      new Error("Connection refused")
    );

    await expect(getStaticPaths({})).rejects.toThrow("Connection refused");
  });

  it("returns no paths in offline SSG mode without API calls", async () => {
    process.env.PUBLIC_GALLERY_SSG_OFFLINE = "true";

    const result = await getStaticPaths({});

    expect(mockFetchPublicProjectCohortsFn).not.toHaveBeenCalled();
    expect(mockFetchPublicProjectsCountFn).not.toHaveBeenCalled();
    expect(result).toEqual({
      paths: [],
      fallback: false,
    });
  });
});

describe("getStaticProps", () => {
  const page1Response = {
    projects: [
      {
        id: 1,
        name: "Project 1",
        teamName: "Team 1",
        achievement: "Artemis",
        cohortYear: 2026,
        hasDropped: false,
      },
    ],
    total: 50,
    page: 1,
    pageSize: 100,
    totalPages: 2,
  };

  const page2Response = {
    projects: [
      {
        id: 2,
        name: "Project 2",
        teamName: "Team 2",
        achievement: "Artemis",
        cohortYear: 2026,
        hasDropped: false,
      },
    ],
    total: 50,
    page: 2,
    pageSize: 100,
    totalPages: 2,
  };

  it("fetches backend-filtered projects for a cohort and level", async () => {
    mockFetchPublicProjectCohortsFn.mockResolvedValue([2026, 2025]);
    mockFetchPublicProjectsFn
      .mockResolvedValueOnce(page1Response)
      .mockResolvedValueOnce(page2Response);

    const result = await getStaticProps({
      params: { cohortYear: "2026", level: "artemis", page: "1" },
    } as any);

    expect(mockFetchPublicProjectsFn).toHaveBeenCalledTimes(2);
    expect(mockFetchPublicProjectsFn).toHaveBeenNthCalledWith(
      1,
      1,
      100,
      "Artemis",
      2026
    );
    expect(mockFetchPublicProjectsFn).toHaveBeenNthCalledWith(
      2,
      2,
      100,
      "Artemis",
      2026
    );
    expect(result).toEqual({
      props: {
        projects: [page1Response.projects[0], page2Response.projects[0]],
        currentPage: 1,
        totalPages: 2,
        total: 50,
        level: "artemis",
        cohortYear: 2026,
        cohortYears: [2026, 2025],
      },
    });
  });

  it("returns notFound when requested page exceeds cohort-level total pages", async () => {
    mockFetchPublicProjectCohortsFn.mockResolvedValue([2026]);
    mockFetchPublicProjectsFn.mockResolvedValue({
      ...page1Response,
      totalPages: 2,
    });

    const result = await getStaticProps({
      params: { cohortYear: "2026", level: "apollo", page: "5" },
    } as any);

    expect(result).toEqual({ notFound: true });
  });

  it("returns notFound for invalid cohort year params", async () => {
    const result = await getStaticProps({
      params: { cohortYear: "invalid", level: "gemini", page: "1" },
    } as any);

    expect(result).toEqual({ notFound: true });
    expect(mockFetchPublicProjectsFn).not.toHaveBeenCalled();
  });

  it("returns notFound for invalid page params", async () => {
    const result = await getStaticProps({
      params: { cohortYear: "2026", level: "gemini", page: "-1" },
    } as any);

    expect(result).toEqual({ notFound: true });
    expect(mockFetchPublicProjectsFn).not.toHaveBeenCalled();
  });

  it("fails the build when public project fetching fails", async () => {
    mockFetchPublicProjectCohortsFn.mockResolvedValue([2026]);
    mockFetchPublicProjectsFn.mockRejectedValue(new Error("Backend down"));

    await expect(
      getStaticProps({
        params: { cohortYear: "2026", level: "vostok", page: "1" },
      } as any)
    ).rejects.toThrow("Backend down");
  });
});

describe("index getStaticProps", () => {
  const project = {
    id: 1,
    name: "Project 1",
    teamName: "Team 1",
    achievement: "Artemis",
    cohortYear: 2026,
    hasDropped: false,
  };

  it("renders the latest cohort Artemis gallery as static props", async () => {
    mockFetchPublicProjectCohortsFn.mockResolvedValue([2026, 2025]);
    mockFetchPublicProjectsFn.mockResolvedValue({
      projects: [project],
      total: 1,
      page: 1,
      pageSize: 100,
      totalPages: 1,
    });

    const result = await getIndexStaticProps({} as any);

    expect(mockFetchPublicProjectCohortsFn).toHaveBeenCalledTimes(1);
    expect(mockFetchPublicProjectsFn).toHaveBeenCalledWith(
      1,
      100,
      "Artemis",
      2026
    );
    expect(result).toEqual({
      props: {
        galleryProps: {
          projects: [project],
          currentPage: 1,
          totalPages: 1,
          total: 1,
          level: "artemis",
          cohortYear: 2026,
          cohortYears: [2026, 2025],
        },
      },
    });
  });

  it("renders a static empty state when no public cohorts exist", async () => {
    mockFetchPublicProjectCohortsFn.mockResolvedValue([]);

    const result = await getIndexStaticProps({} as any);

    expect(mockFetchPublicProjectsFn).not.toHaveBeenCalled();
    expect(result).toEqual({
      props: {
        galleryProps: null,
      },
    });
  });

  it("renders a static empty state in offline SSG mode without API calls", async () => {
    process.env.PUBLIC_GALLERY_SSG_OFFLINE = "true";

    const result = await getIndexStaticProps({} as any);

    expect(mockFetchPublicProjectCohortsFn).not.toHaveBeenCalled();
    expect(mockFetchPublicProjectsFn).not.toHaveBeenCalled();
    expect(result).toEqual({
      props: {
        galleryProps: null,
      },
    });
  });
});
