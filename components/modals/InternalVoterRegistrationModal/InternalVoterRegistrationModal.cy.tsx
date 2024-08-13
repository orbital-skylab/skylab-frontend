/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import InternalVoterRegistrationModal from "./InternalVoterRegistrationModal";

describe("<InternalVoterRegistrationModal />", () => {
  let setOpenSpy: any;
  let mutateSpy: any;
  let handleCloseMenuSpy: any;
  const voteEventId = 1;
  const voterManagement = {
    hasInternalList: true,
    hasExternalList: false,
    isRegistrationOpen: false,
  };

  beforeEach(() => {
    setOpenSpy = cy.spy().as("setOpenSpy");
    mutateSpy = cy.spy().as("mutateSpy");
    handleCloseMenuSpy = cy.spy().as("handleCloseMenuSpy");

    cy.intercept("PUT", `/api/vote-events/${voteEventId}`, {
      statusCode: 200,
      body: {},
    }).as("toggleRegistration");
  });

  it("should render opened modal", () => {
    // Mount the component
    mount(
      <InternalVoterRegistrationModal
        voteEventId={voteEventId}
        voterManagement={voterManagement}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#registration-return-button").should("exist");
  });

  it("should render closed modal", () => {
    // Mount the component
    mount(
      <InternalVoterRegistrationModal
        voteEventId={voteEventId}
        voterManagement={voterManagement}
        open={false}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#registration-return-button").should("not.exist");
  });

  it("should open registration", () => {
    // Mount the component
    mount(
      <InternalVoterRegistrationModal
        voteEventId={voteEventId}
        voterManagement={voterManagement}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // open registration
    cy.get("#open-registration-button").click();

    cy.wait("@toggleRegistration");

    cy.get("@mutateSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@handleCloseMenuSpy").should("be.calledOnce");
  });

  it("should close registration", () => {
    // Mount the component
    mount(
      <InternalVoterRegistrationModal
        voteEventId={voteEventId}
        voterManagement={{
          ...voterManagement,
          isRegistrationOpen: true,
        }}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // close registration
    cy.get("#close-registration-button").click();

    cy.wait("@toggleRegistration");

    cy.get("@mutateSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@handleCloseMenuSpy").should("be.calledOnce");
  });

  it("should have a functioning return button", () => {
    // Mount the component
    mount(
      <InternalVoterRegistrationModal
        voteEventId={voteEventId}
        voterManagement={voterManagement}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Click the return button
    cy.get("#registration-return-button").click();

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
    cy.get("@handleCloseMenuSpy").should("be.calledOnce");
  });
});
