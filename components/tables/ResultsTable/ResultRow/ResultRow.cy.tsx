/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import ResultRow from "./ResultRow";
import { LEVELS_OF_ACHIEVEMENT, Project } from "@/types/projects";

const assertRowElements = (
  rank: number | null,
  project: Project,
  votes: number | null,
  points: number | null,
  percentage: number | null
) => {
  let cellCount = 0;
  if (rank) {
    cy.get("td").eq(0).contains(rank).should("be.visible");
    cellCount++;
  }
  cy.get("td").eq(cellCount).contains(project.id).should("be.visible");
  cy.get("td")
    .eq(cellCount + 1)
    .contains(project.name)
    .should("be.visible");
  cellCount += 2;
  if (votes) {
    cy.get("td").eq(cellCount).contains(votes).should("be.visible");
    cellCount++;
  }
  if (points) {
    cy.get("td").eq(cellCount).contains(points).should("be.visible");
    cellCount++;
  }
  if (percentage) {
    cy.get("td").eq(cellCount).contains(percentage).should("be.visible");
    cellCount++;
  }
  cy.get("tr").should("be.visible");
  cy.get("td").should("have.length", cellCount);
};

describe("<ResultRow />", () => {
  // pairwaise test cases
  const testCases = [
    { rank: null, votes: 1, points: null, percentage: 100 },
    { rank: 1, votes: 1, points: 1, percentage: 100 },
    { rank: 1, votes: null, points: null, percentage: 100 },
    { rank: null, votes: null, points: null, percentage: null },
    { rank: 1, votes: null, points: 1, percentage: null },
    { rank: null, votes: null, points: 1, percentage: 100 },
  ];
  const project = {
    id: 1,
    name: "Project 1",
    achievement: "Artemis" as LEVELS_OF_ACHIEVEMENT,
    cohortYear: 2024,
    proposalPdf: "https://www.google.com",
    posterUrl: "https://loremflickr.com/640/480",
    videoUrl: "https://www.youtube.com/watch?v=6n3pFFPSlW4",
    teamName: "Team 1",
    hasDropped: false,
    students: [],
  };

  testCases.forEach(({ rank, votes, points, percentage }) => {
    it(`should render with rank=${rank}, votes=${votes}, points=${points}, percentage=${percentage}`, () => {
      const result = {
        rank,
        project: project,
        votes,
        points,
        percentage,
      };

      mount(
        <ResultRow
          rank={result.rank}
          project={result.project}
          votes={result.votes}
          points={result.points}
          percentage={result.percentage}
        />
      );

      assertRowElements(
        result.rank,
        result.project,
        result.votes,
        result.points,
        result.percentage
      );
    });
  });
});
