/* eslint-disable @typescript-eslint/no-explicit-any */
import VotingCard from "@/components/cards/VotingCard";
import { Project } from "@/types/projects";
import { mount } from "cypress/react18";

describe("<VotingCard />", () => {
  let setSelectedCandidatesSpy: any;
  let candidate: Project;

  beforeEach(() => {
    setSelectedCandidatesSpy = cy.spy().as("setSelectedCandidatesSpy");
    cy.fixture("projects").then((projects) => {
      candidate = projects.mockProject1;
    });
  });

  it("should display candidate detils correctly", () => {
    // Mount the component
    mount(
      <VotingCard
        isSelected={false}
        candidate={candidate}
        isDisabled={false}
        setSelectedCandidates={setSelectedCandidatesSpy}
      />
    );

    cy.get(`#${candidate.id}-candidate-card`).should("be.visible");
    cy.contains(candidate.id).should("be.visible");
    cy.contains(candidate.teamName).should("be.visible");

    // assert image
    cy.get("img").should("have.attr", "src", candidate.posterUrl);
  });

  it("should be able to toggle selected state", () => {
    // Mount the component
    mount(
      <VotingCard
        isSelected={false}
        candidate={candidate}
        isDisabled={false}
        setSelectedCandidates={setSelectedCandidatesSpy}
      />
    );

    cy.get(`#candidate-${candidate.id}-vote-button`).click();
    cy.get("@setSelectedCandidatesSpy").should("be.calledOnce");
  });

  it("should display correct button state based on if candidate is selected", () => {
    // Mount the selected component
    mount(
      <VotingCard
        isSelected={true}
        candidate={candidate}
        isDisabled={false}
        setSelectedCandidates={setSelectedCandidatesSpy}
      />
    );

    cy.get(`#candidate-${candidate.id}-vote-button`).should(
      "contain.text",
      "Voted"
    );

    // Mount the unselected component
    mount(
      <VotingCard
        isSelected={false}
        candidate={candidate}
        isDisabled={false}
        setSelectedCandidates={setSelectedCandidatesSpy}
      />
    );

    cy.get(`#candidate-${candidate.id}-vote-button`).should(
      "contain.text",
      "Vote"
    );
  });
});
