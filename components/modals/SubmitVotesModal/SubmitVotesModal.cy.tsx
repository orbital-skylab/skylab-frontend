/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import SubmitVotesModal from "./SubmitVotesModal";
import { mount } from "cypress/react18";

describe("<SubmitVotesModal />", () => {
  let setOpenSpy: any;
  let mutateSpy: any;
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
  });

  it("should render opened modal", () => {
    // Mount the component
    mount(
      <SubmitVotesModal
        voteEventId={voteEventId}
        selectedCandidates={selectedCandidates}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#submit-votes-modal")
      .contains(
        `Total votes: ${
          projectIds.length
        } You have voted for the following project IDs: ${projectIds.join(
          ", "
        )}`
      )
      .should("be.visible");
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
