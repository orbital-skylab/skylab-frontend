/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import AddExternalVoterModal from "./AddExternalVoterModal";
import { mount } from "cypress/react18";

describe("<AddExternalVoterModal />", () => {
  let setOpenSpy: any;
  let mutateSpy: any;
  let handleCloseMenuSpy: any;
  const voteEventId = 1;

  beforeEach(() => {
    setOpenSpy = cy.spy().as("setOpenSpy");
    mutateSpy = cy.spy().as("mutateSpy");
    handleCloseMenuSpy = cy.spy().as("handleCloseMenuSpy");
  });

  it("should render opened modal", () => {
    // Mount the component
    mount(
      <AddExternalVoterModal
        voteEventId={voteEventId}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
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
        handleCloseMenu={handleCloseMenuSpy}
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
        handleCloseMenu={handleCloseMenuSpy}
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
    cy.get("@handleCloseMenuSpy").should("be.calledOnce");
  });

  it("should not submit form with invalid data", () => {
    // Mount the component
    mount(
      <AddExternalVoterModal
        voteEventId={voteEventId}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Submit the form
    cy.get("#add-external-voter-button").click();

    cy.get("@setOpenSpy").should("not.be.called");
    cy.get("@mutateSpy").should("not.be.called");
    cy.get("@handleCloseMenuSpy").should("not.be.called");
    cy.contains("This field is required").should("exist");
  });

  it("should have a functioning return button", () => {
    // Mount the component
    mount(
      <AddExternalVoterModal
        voteEventId={voteEventId}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
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
