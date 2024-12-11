/* eslint-disable @typescript-eslint/no-explicit-any */
import VoteCandidateRow from "@/components/tables/VoteCandidateTable/VoteCandidateRow";
import { Project } from "@/types/projects";
import { mount } from "cypress/react18";

describe("<VoteCandidateRow />", () => {
  let setSelectedCandidatesSpy: any;
  let candidate: Project;

  beforeEach(() => {
    setSelectedCandidatesSpy = cy.spy().as("setSelectedCandidatesSpy");
    cy.fixture("projects").then((projects) => {
      candidate = projects.mockProject1;
    });
  });

  it("should render the candidate with button selected based on props", () => {
    mount(
      <VoteCandidateRow
        candidate={candidate}
        isSelected={true}
        isDisabled={false}
        setSelectedCandidates={setSelectedCandidatesSpy}
      />
    );

    cy.get("tr").should("be.visible");
    cy.get("td").should("have.length", 3);
    cy.contains(candidate.id).should("be.visible");
    cy.contains(candidate.name).should("be.visible");
    cy.get(`#candidate-${candidate.id}-vote-button`).contains("Voted");
  });

  it("should be able to call the select function when button is clicked", () => {
    mount(
      <VoteCandidateRow
        candidate={candidate}
        isSelected={false}
        isDisabled={false}
        setSelectedCandidates={setSelectedCandidatesSpy}
      />
    );

    // initailly not selected
    cy.get(`#candidate-${candidate.id}-vote-button`).contains("Vote");

    // select
    cy.get(`#candidate-${candidate.id}-vote-button`).click();
    cy.get("@setSelectedCandidatesSpy").should("be.calledOnce");
  });
});
