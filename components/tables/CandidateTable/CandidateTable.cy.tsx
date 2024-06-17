/* eslint-disable @typescript-eslint/no-explicit-any */
import CandidateTable from "@/components/tables/CandidateTable/CandidateTable";
import { FETCH_STATUS } from "@/hooks/useFetch";
import { Project } from "@/types/projects";
import { mount } from "cypress/react18";

describe("<InternalVoterTable />", () => {
  let mutateSpy: any;
  let candidates: Project[];
  const voteEventId = 1;

  beforeEach(() => {
    mutateSpy = cy.spy().as("mutateSpy");

    cy.fixture("projects").then((projects) => {
      candidates = Object.values(projects);
    });
  });

  it("should render the candidate table with correct headings and rows", () => {
    mount(
      <CandidateTable
        voteEventId={voteEventId}
        candidates={candidates}
        status={FETCH_STATUS.FETCHED}
        mutate={mutateSpy}
      />
    );

    // Check column headings
    cy.get("thead").contains("Project ID").should("be.visible");
    cy.get("thead").contains("Name").should("be.visible");
    cy.get("thead").contains("Cohort").should("be.visible");
    cy.get("thead").contains("Achievement").should("be.visible");
    cy.get("thead").contains("Actions").should("be.visible");

    // Check rows
    cy.get("tbody").find("tr").should("have.length", candidates.length);
    candidates.forEach((candidate) => {
      cy.get("tbody").contains(candidate.id).should("be.visible");
      cy.get("tbody").contains(candidate.name).should("be.visible");
      cy.get("tbody").contains(candidate.cohortYear).should("be.visible");
      cy.get("tbody").contains(candidate.achievement).should("be.visible");
    });
  });

  it("should be loading when data is being fetched", () => {
    mount(
      <CandidateTable
        voteEventId={voteEventId}
        candidates={candidates}
        status={FETCH_STATUS.FETCHING}
        mutate={mutateSpy}
      />
    );

    cy.get("#loading-wrapper").should("exist");
  });

  it("should not display any table if there is no data", () => {
    mount(
      <CandidateTable
        voteEventId={voteEventId}
        candidates={[]}
        status={FETCH_STATUS.FETCHED}
        mutate={mutateSpy}
      />
    );

    cy.contains("No candidates found").should("be.visible");
  });
});
