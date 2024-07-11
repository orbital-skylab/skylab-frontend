/* eslint-disable @typescript-eslint/no-explicit-any */
import ResultsTable from "@/components/tables/ResultsTable/ResultsTable";
import { FETCH_STATUS } from "@/hooks/useFetch";
import { LEVELS_OF_ACHIEVEMENT } from "@/types/projects";
import { mount } from "cypress/react18";

describe("<ResultsTable />", () => {
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

  const results = [
    {
      rank: 1,
      project: {
        ...project,
        id: 1,
        name: "Project 1",
      },
      votes: 5,
      points: 5,
      percentage: 50,
    },
    {
      rank: 2,
      project: {
        ...project,
        id: 2,
        name: "Project 2",
      },
      votes: 3,
      points: 3,
      percentage: 30,
    },
    {
      rank: 3,
      project: {
        ...project,
        id: 3,
        name: "Project 3",
      },
      votes: 2,
      points: 2,
      percentage: 20,
    },
  ];

  it("should render the vote event table with correct headings and rows", () => {
    mount(<ResultsTable results={results} status={FETCH_STATUS.FETCHED} />);

    // Check column headings
    cy.get("thead").find("th").should("have.length", 6);
    cy.get("thead").contains("Rank").should("be.visible");
    cy.get("thead").contains("Project ID").should("be.visible");
    cy.get("thead").contains("Project Name").should("be.visible");
    cy.get("thead").contains("Votes").should("be.visible");
    cy.get("thead").contains("Points").should("be.visible");
    cy.get("thead").contains("Points Percentage").should("be.visible");

    // Check rows
    cy.get("tbody").find("tr").should("have.length", results.length);
    results.forEach((result) => {
      cy.get("tbody").contains(result.rank).should("be.visible");
      cy.get("tbody").contains(result.project.id).should("be.visible");
      cy.get("tbody").contains(result.project.name).should("be.visible");
      cy.get("tbody").contains(result.votes).should("be.visible");
      cy.get("tbody").contains(result.points).should("be.visible");
      cy.get("tbody").contains(result.percentage).should("be.visible");
    });
  });

  it("should be loading when data is being fetched", () => {
    mount(<ResultsTable results={results} status={FETCH_STATUS.FETCHING} />);

    cy.get("#loading-wrapper").should("exist");
  });

  it("should not display any table if there is no data", () => {
    mount(<ResultsTable results={[]} status={FETCH_STATUS.FETCHED} />);

    cy.contains("No results found").should("be.visible");
  });
});
