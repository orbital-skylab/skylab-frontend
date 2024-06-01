/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import AddInternalVoterModal from "./AddInternalVoterModal";
import { mount } from "cypress/react18";

describe("<AddInternalVoterModal />", () => {
  let setOpenSpy: any;
  let mutateSpy: any;
  const voteEventId = 1;

  beforeEach(() => {
    setOpenSpy = cy.spy().as("setOpenSpy");
    mutateSpy = cy.spy().as("mutateSpy");
  });

  it("should render opened modal", () => {
    // Mount the component
    mount(
      <AddInternalVoterModal
        voteEventId={voteEventId}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#add-internal-voter-button").should("exist");
  });

  it("should render closed modal", () => {
    // Mount the component
    mount(
      <AddInternalVoterModal
        voteEventId={voteEventId}
        open={false}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#add-internal-voter-button").should("not.exist");
  });

  it("should submit form with valid data", () => {
    // Mount the component
    mount(
      <AddInternalVoterModal
        voteEventId={voteEventId}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Interact with form inputs
    cy.get("#email-input").type("test@example.com");

    // Submit the form
    cy.intercept(
      "PUT",
      `/api/vote-events/${voteEventId}/voter-management/internal-voters`,
      {
        statusCode: 200,
        body: {},
      }
    ).as("addInternalVoter");
    cy.get("#add-internal-voter-button").click();

    cy.wait("@addInternalVoter");

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
    cy.get("@mutateSpy").should("be.calledOnce");
  });

  it("should have a functioning return button", () => {
    // Mount the component
    mount(
      <AddInternalVoterModal
        voteEventId={voteEventId}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Click the return button
    cy.get("#add-internal-voter-return-button").click();

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
  });
});
