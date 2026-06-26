/* eslint-disable no-undef */
import { describe, expect } from "@jest/globals";
import { generateRoundRobinRelations } from "./relations";
import { LEVELS_OF_ACHIEVEMENT, Project } from "@/types/projects";

const createProject = (id: number, hasDropped = false): Project => ({
  id,
  name: `Project ${id}`,
  teamName: `Team ${id}`,
  proposalPdf: "",
  videoUrl: "",
  posterUrl: "",
  hasDropped,
  achievement: LEVELS_OF_ACHIEVEMENT.ARTEMIS,
  cohortYear: 2026,
  students: [],
});

describe("#generateRoundRobinRelations", () => {
  it("can generate round robin relations for active teams", () => {
    const relations = generateRoundRobinRelations([
      createProject(1),
      createProject(2),
      createProject(3),
    ]);

    expect(
      relations.map(({ fromProjectId, toProjectId }) => ({
        fromProjectId,
        toProjectId,
      }))
    ).toEqual([
      { fromProjectId: 1, toProjectId: 2 },
      { fromProjectId: 1, toProjectId: 3 },
      { fromProjectId: 2, toProjectId: 3 },
      { fromProjectId: 2, toProjectId: 1 },
      { fromProjectId: 3, toProjectId: 1 },
      { fromProjectId: 3, toProjectId: 2 },
    ]);
  });

  it("does not create relations for dropped teams", () => {
    const relations = generateRoundRobinRelations([
      createProject(1),
      createProject(2, true),
      createProject(3),
      createProject(4),
    ]);

    expect(relations).toHaveLength(6);
    expect(
      relations.some(
        ({ fromProjectId, toProjectId }) =>
          fromProjectId === 2 || toProjectId === 2
      )
    ).toBe(false);
  });
});
