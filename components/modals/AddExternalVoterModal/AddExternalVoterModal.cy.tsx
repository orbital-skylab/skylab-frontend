/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import AddExternalVoterModal from "./AddExternalVoterModal";
import { mount } from "cypress/react18";

describe("<AddExternalVoterModal />", () => {
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
      <AddExternalVoterModal
        voteEventId={voteEventId}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#add-external-voter-button").should("exist");
  });

  it("should render closed modal", () => {
    // Mount the component
    mount(
      <AddExternalVoterModal
        voteEventId={voteEventId}
        open={false}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#add-external-voter-button").should("not.exist");
  });

  it("should submit form with valid data", () => {
    // Mount the component
    mount(
      <AddExternalVoterModal
        voteEventId={voteEventId}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Interact with form inputs
    cy.get("#voterId-input").type("external-voter-id");

    // Submit the form
    cy.intercept(
      "POST",
      `/api/vote-events/${voteEventId}/voter-management/external-voters`,
      {
        statusCode: 200,
        body: {},
      }
    ).as("addExternalVoter");
    cy.get("#add-external-voter-button").click();

    cy.wait("@addExternalVoter");

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
    cy.get("@mutateSpy").should("be.calledOnce");
  });

  it("should have a functioning return button", () => {
    // Mount the component
    mount(
      <AddExternalVoterModal
        voteEventId={voteEventId}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Click the return button
    cy.get("#add-external-voter-return-button").click();

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
  });
});
