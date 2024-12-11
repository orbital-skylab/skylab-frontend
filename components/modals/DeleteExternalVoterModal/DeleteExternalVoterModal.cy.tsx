/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import DeleteExternalVoterModal from "./DeleteExternalVoterModal";
import { mount } from "cypress/react18";

describe("<DeleteExternalVoterModal />", () => {
  let setOpenSpy: any;
  let mutateSpy: any;

  // Mock externalVoter object
  const externalVoter = { id: "testID", voteEventId: 1 };

  beforeEach(() => {
    setOpenSpy = cy.spy().as("setOpenSpy");
    mutateSpy = cy.spy().as("mutateSpy");
  });

  it("should render opened modal", () => {
    // Mount the component
    mount(
      <DeleteExternalVoterModal
        externalVoter={externalVoter}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#delete-external-voter-confirm-button").should("exist");
  });

  it("should render closed modal", () => {
    // Mount the component
    mount(
      <DeleteExternalVoterModal
        externalVoter={externalVoter}
        open={false}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#delete-external-voter-confirm-button").should("not.exist");
  });

  it("should delete external voter on confirmation and close the modal", () => {
    // Mount the component
    mount(
      <DeleteExternalVoterModal
        externalVoter={externalVoter}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Intercept DELETE request
    cy.intercept(
      "DELETE",
      `/api/vote-events/${externalVoter.voteEventId}/voter-management/external-voters/${externalVoter.id}`,
      {
        statusCode: 200,
        body: {},
      }
    ).as("deleteExternalVoter");

    // Click delete button
    cy.get("#delete-external-voter-confirm-button").click();

    cy.wait("@deleteExternalVoter");

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
    cy.get("@mutateSpy").should("be.calledOnce");
  });

  it("should not delete external voter on cancellation", () => {
    // Mount the component
    mount(
      <DeleteExternalVoterModal
        externalVoter={externalVoter}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Click cancel button
    cy.get("#delete-external-voter-cancel-button").click();

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
  });
});
