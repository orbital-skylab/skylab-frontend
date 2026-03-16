/* eslint-disable no-undef */
import { describe, expect, it } from "@jest/globals";
import { LEVELS_OF_ACHIEVEMENT, Project } from "@/types/projects";
import {
  filterProjects,
  filterProjectsByLevel,
  extractCohortYears,
  getMostRecentCohort,
} from "./publicGallery";
import { DeepPartial } from "./types";

/** Helper function to generate a mock project */
const generateMockProject = (overrides: DeepPartial<Project> = {}): Project => {
  return {
    id: 1,
    name: "Test Project",
    teamName: "Test Team",
    proposalPdf: "http://example.com/proposal.pdf",
    videoUrl: "http://example.com/video",
    posterUrl: "http://example.com/poster.jpg",
    students: [],
    achievement: LEVELS_OF_ACHIEVEMENT.ARTEMIS,
    cohortYear: 2024,
    hasDropped: false,
    ...overrides,
  } as Project;
};

describe("Public Gallery Helpers", () => {
  describe("#filterProjects", () => {
    const mockProjects: Project[] = [
      generateMockProject({
        id: 1,
        achievement: LEVELS_OF_ACHIEVEMENT.ARTEMIS,
        cohortYear: 2024,
      }),
      generateMockProject({
        id: 2,
        achievement: LEVELS_OF_ACHIEVEMENT.APOLLO,
        cohortYear: 2024,
      }),
      generateMockProject({
        id: 3,
        achievement: LEVELS_OF_ACHIEVEMENT.ARTEMIS,
        cohortYear: 2023,
      }),
      generateMockProject({
        id: 4,
        achievement: LEVELS_OF_ACHIEVEMENT.GEMINI,
        cohortYear: 2024,
      }),
      generateMockProject({
        id: 5,
        achievement: LEVELS_OF_ACHIEVEMENT.VOSTOK,
        cohortYear: 2022,
      }),
      generateMockProject({
        id: 6,
        achievement: LEVELS_OF_ACHIEVEMENT.ARTEMIS,
        cohortYear: 2024,
        hasDropped: true,
      }),
    ];

    it("filters by achievement level only when cohort is empty", () => {
      const result = filterProjects(
        mockProjects,
        LEVELS_OF_ACHIEVEMENT.ARTEMIS,
        ""
      );
      expect(result).toHaveLength(2);
      expect(
        result.every((p) => p.achievement === LEVELS_OF_ACHIEVEMENT.ARTEMIS)
      ).toBe(true);
    });

    it("filters by both achievement level and cohort year", () => {
      const result = filterProjects(
        mockProjects,
        LEVELS_OF_ACHIEVEMENT.ARTEMIS,
        2024
      );
      expect(result).toMatchObject([{ id: 1 }]);
    });

    it("excludes dropped projects", () => {
      const result = filterProjects(
        mockProjects,
        LEVELS_OF_ACHIEVEMENT.ARTEMIS,
        2024
      );
      expect(result.some((p) => p.hasDropped)).toBe(false);
    });

    it("returns empty array when no projects match", () => {
      const result = filterProjects(
        mockProjects,
        LEVELS_OF_ACHIEVEMENT.VOSTOK,
        2024
      );
      expect(result).toHaveLength(0);
    });

    it("handles empty projects array", () => {
      const result = filterProjects([], LEVELS_OF_ACHIEVEMENT.ARTEMIS, 2024);
      expect(result).toHaveLength(0);
    });

    it("filters Apollo projects correctly", () => {
      const result = filterProjects(
        mockProjects,
        LEVELS_OF_ACHIEVEMENT.APOLLO,
        ""
      );
      expect(result).toMatchObject([{ id: 2 }]);
    });

    it("filters Gemini projects correctly", () => {
      const result = filterProjects(
        mockProjects,
        LEVELS_OF_ACHIEVEMENT.GEMINI,
        2024
      );
      expect(result).toMatchObject([{ id: 4 }]);
    });

    it("filters Vostok projects correctly", () => {
      const result = filterProjects(
        mockProjects,
        LEVELS_OF_ACHIEVEMENT.VOSTOK,
        2022
      );
      expect(result).toMatchObject([{ id: 5 }]);
    });
  });

  describe("#filterProjectsByLevel", () => {
    const mockProjects: Project[] = [
      generateMockProject({
        id: 1,
        achievement: LEVELS_OF_ACHIEVEMENT.ARTEMIS,
        cohortYear: 2024,
      }),
      generateMockProject({
        id: 2,
        achievement: LEVELS_OF_ACHIEVEMENT.ARTEMIS,
        cohortYear: 2023,
      }),
      generateMockProject({
        id: 3,
        achievement: LEVELS_OF_ACHIEVEMENT.APOLLO,
        cohortYear: 2024,
      }),
      generateMockProject({
        id: 4,
        achievement: LEVELS_OF_ACHIEVEMENT.ARTEMIS,
        hasDropped: true,
      }),
    ];

    it("filters by achievement level ignoring cohort", () => {
      const result = filterProjectsByLevel(
        mockProjects,
        LEVELS_OF_ACHIEVEMENT.ARTEMIS
      );
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id)).toEqual([1, 2]);
    });

    it("excludes dropped projects", () => {
      const result = filterProjectsByLevel(
        mockProjects,
        LEVELS_OF_ACHIEVEMENT.ARTEMIS
      );
      expect(result.some((p) => p.hasDropped)).toBe(false);
    });

    it("returns empty array when no projects match", () => {
      const result = filterProjectsByLevel(
        mockProjects,
        LEVELS_OF_ACHIEVEMENT.GEMINI
      );
      expect(result).toHaveLength(0);
    });
  });

  describe("#extractCohortYears", () => {
    it("extracts unique years sorted descending", () => {
      const projects: Project[] = [
        generateMockProject({ cohortYear: 2022 }),
        generateMockProject({ cohortYear: 2024 }),
        generateMockProject({ cohortYear: 2023 }),
        generateMockProject({ cohortYear: 2024 }),
      ];
      const result = extractCohortYears(projects);
      expect(result).toEqual([2024, 2023, 2022]);
    });

    it("returns empty array for empty projects", () => {
      const result = extractCohortYears([]);
      expect(result).toEqual([]);
    });

    it("handles single cohort year", () => {
      const projects: Project[] = [
        generateMockProject({ cohortYear: 2024 }),
        generateMockProject({ cohortYear: 2024 }),
      ];
      const result = extractCohortYears(projects);
      expect(result).toEqual([2024]);
    });
  });

  describe("#getMostRecentCohort", () => {
    it("returns the most recent (highest) cohort year", () => {
      const projects: Project[] = [
        generateMockProject({ cohortYear: 2022 }),
        generateMockProject({ cohortYear: 2024 }),
        generateMockProject({ cohortYear: 2023 }),
      ];
      const result = getMostRecentCohort(projects);
      expect(result).toBe(2024);
    });

    it("returns empty string for empty projects", () => {
      const result = getMostRecentCohort([]);
      expect(result).toBe("");
    });

    it("returns the only year when single project exists", () => {
      const projects: Project[] = [generateMockProject({ cohortYear: 2021 })];
      const result = getMostRecentCohort(projects);
      expect(result).toBe(2021);
    });
  });
});
