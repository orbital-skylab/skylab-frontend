/* eslint-disable @typescript-eslint/no-explicit-any */
import { Project } from "@/types/projects";
import { mount } from "cypress/react18";
import SubmitVotesModal from "./SubmitVotesModal";

describe("<SubmitVotesModal />", () => {
  let setOpenSpy: any;
  let mutateSpy: any;
  let candidates: Project[];
  const voteEventId = 1;

  // Mock internalVoter object
  const selectedCandidates = {
    ["1"]: true,
    ["2"]: false,
  };

  const projectIds = Object.entries(selectedCandidates)
    .filter(([, isSelected]) => isSelected)
    .map(([projectId]) => parseInt(projectId));

  beforeEach(() => {
    setOpenSpy = cy.spy().as("setOpenSpy");
    mutateSpy = cy.spy().as("mutateSpy");

    cy.fixture("projects").then((projects) => {
      candidates = Object.values(projects);
    });
  });

  it("should render opened modal", () => {
    // Mount the component
    mount(
      <SubmitVotesModal
        voteEventId={voteEventId}
        selectedCandidates={selectedCandidates}
        open={true}
        setOpen={setOpenSpy}
        candidates={candidates}
        mutate={mutateSpy}
      />
    );

    cy.get("#submit-votes-modal")
      .contains(
        `Total votes: ${projectIds.length} You have voted for the following projects:`
      )
      .should("be.visible");
    Object.entries(selectedCandidates).forEach(([projectId, isSelected]) => {
      if (isSelected) {
        cy.get("#submit-votes-modal")
          .contains(
            projectId +
              " - " +
              candidates.find(
                (candidate) => candidate.id === parseInt(projectId)
              )?.name
          )
          .should("be.visible");
      }
    });
    cy.get("#submit-votes-button").should("be.visible");
  });

  it("should render closed modal", () => {
    // Mount the component
    mount(
      <SubmitVotesModal
        voteEventId={voteEventId}
        selectedCandidates={selectedCandidates}
        open={false}
        setOpen={setOpenSpy}
        candidates={candidates}
        mutate={mutateSpy}
      />
    );

    cy.get("#submit-votes-button").should("not.exist");
  });

  it("should submit votes when submit button is clicked", () => {
    // Mount the component
    mount(
      <SubmitVotesModal
        voteEventId={voteEventId}
        selectedCandidates={selectedCandidates}
        open={true}
        candidates={candidates}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Intercept POST request
    cy.intercept("POST", `/api/vote-events/${voteEventId}/votes`, {
      statusCode: 200,
      body: {},
    }).as("submitVotes");

    // Click submit button
    cy.get("#submit-votes-button").click();

    cy.wait("@submitVotes");

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
    cy.get("@mutateSpy").should("be.calledOnce");
  });

  it("should not submit votes on cancellation", () => {
    // Mount the component
    mount(
      <SubmitVotesModal
        voteEventId={voteEventId}
        selectedCandidates={selectedCandidates}
        open={true}
        candidates={candidates}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Click return button
    cy.get("#submit-votes-return-button").click();

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
  });
});
