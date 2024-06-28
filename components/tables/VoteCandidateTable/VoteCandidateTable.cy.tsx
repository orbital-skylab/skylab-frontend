/* eslint-disable @typescript-eslint/no-explicit-any */
import VoteCandidateTable from "@/components/tables/VoteCandidateTable/VoteCandidateTable";
import { FETCH_STATUS } from "@/hooks/useFetch";
import { Project } from "@/types/projects";
import { mount } from "cypress/react18";

describe("<VoteCandidateTable />", () => {
  let setSelectedCandidatesSpy: any;
  let candidates: Project[];

  beforeEach(() => {
    setSelectedCandidatesSpy = cy.spy().as("setSelectedCandidatesSpy");

    cy.fixture("projects").then((projects) => {
      candidates = Object.values(projects);
    });
  });

  it("should render the candidate table with correct headings and rows", () => {
    const selectedCandidates = {
      [candidates[0].id]: true,
      [candidates[1].id]: false,
    };
    mount(
      <VoteCandidateTable
        selectedCandidates={selectedCandidates}
        candidates={candidates}
        status={FETCH_STATUS.FETCHED}
        setSelectedCandidates={setSelectedCandidatesSpy}
      />
    );

    // Check column headings
    cy.get("thead").contains("Project ID").should("be.visible");
    cy.get("thead").contains("Name").should("be.visible");
    cy.get("thead").contains("Vote").should("be.visible");

    // Check rows
    cy.get("tbody").find("tr").should("have.length", candidates.length);
    candidates.forEach((candidate) => {
      cy.get("tbody").contains(candidate.id).should("be.visible");
      cy.get("tbody").contains(candidate.name).should("be.visible");
      cy.get(`#candidate-${candidate.id}-vote-button`).contains(
        selectedCandidates[candidate.id] ? "Voted" : "Vote"
      );
    });
  });

  it("should be loading when data is being fetched", () => {
    mount(
      <VoteCandidateTable
        selectedCandidates={{}}
        candidates={[]}
        status={FETCH_STATUS.FETCHING}
        setSelectedCandidates={setSelectedCandidatesSpy}
      />
    );

    cy.get("#loading-wrapper").should("exist");
  });

  it("should not display any table if there is no data", () => {
    mount(
      <VoteCandidateTable
        selectedCandidates={{}}
        candidates={[]}
        status={FETCH_STATUS.FETCHED}
        setSelectedCandidates={setSelectedCandidatesSpy}
      />
    );

    cy.contains("No candidates found").should("be.visible");
  });
});
