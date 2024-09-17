/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEFAULT_REGISTRATION_PERIOD } from "@/helpers/voteEvent";
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
    ...DEFAULT_REGISTRATION_PERIOD,
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

  it("should be able to set registration period", () => {
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

    cy.get("#registration-start-time").should(
      "have.value",
      voterManagement.registrationStartTime
    );
    cy.get("#registration-end-time").should(
      "have.value",
      voterManagement.registrationEndTime
    );

    // set new start time
    cy.get("#registration-start-time").clear().type("2022-01-01T00:00");
    // set new end time
    cy.get("#registration-end-time").clear().type("2022-02-01T00:00");

    cy.get("#save-registration-period-button").click();
    cy.wait("@toggleRegistration");

    cy.get("@mutateSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@handleCloseMenuSpy").should("be.calledOnce");
  });

  it("should not save if start time is greater than end time", () => {
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

    // set end time to be less than start time
    cy.get("#registration-start-time").clear().type("2022-03-01T00:00");
    cy.get("#registration-end-time").clear().type("2022-01-01T00:00");
    cy.get("#save-registration-period-button").click();

    cy.get("@mutateSpy").should("not.be.called");
    cy.get("@setOpenSpy").should("not.be.called");
    cy.contains("End time must be greater than start time").should("exist");
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
