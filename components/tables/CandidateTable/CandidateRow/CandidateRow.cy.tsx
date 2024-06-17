/* eslint-disable @typescript-eslint/no-explicit-any */
import CandidateRow from "@/components/tables/CandidateTable/CandidateRow/CandidateRow";
import { Project } from "@/types/projects";
import { mount } from "cypress/react18";

describe("<CandidateRow />", () => {
  let mutateSpy: any;
  let candidate: Project;
  const voteEventId = 1;

  beforeEach(() => {
    mutateSpy = cy.spy().as("mutateSpy");
    cy.fixture("projects").then((projects) => {
      candidate = projects.mockProject1;
    });
  });

  it("should render the candidate row", () => {
    mount(
      <CandidateRow
        voteEventId={voteEventId}
        candidate={candidate}
        mutate={mutateSpy}
      />
    );

    cy.get("tr").should("be.visible");
    cy.get("td").should("have.length", 5);
    cy.contains(candidate.id).should("be.visible");
    cy.contains(candidate.name).should("be.visible");
    cy.contains(candidate.cohortYear).should("be.visible");
    cy.contains(candidate.achievement).should("be.visible");
    cy.get("#delete-candidate-button").should("be.visible");
  });

  it("should open the delete modal when the delete button is clicked", () => {
    mount(
      <CandidateRow
        voteEventId={voteEventId}
        candidate={candidate}
        mutate={mutateSpy}
      />
    );

    cy.get("#delete-candidate-button").click();

    cy.contains("Delete Candidate").should("be.visible");
    cy.contains(
      `You are deleting the candidate with id ${candidate.id}.`
    ).should("be.visible");
    cy.get("#delete-candidate-confirm-button").should("be.visible");
  });
});
