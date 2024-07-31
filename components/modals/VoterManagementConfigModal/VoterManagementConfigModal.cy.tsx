/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEFAULT_RESULTS_FILTER } from "@/helpers/voteEvent";
import { mount } from "cypress/react18";
import VoterManagementConfigModal from "./VoterManagementConfigModal";

describe("<VoterManagementConfigModal />", () => {
  let setOpenSpy: any;
  let mutateSpy: any;
  const voterManagement = {
    isRegistrationOpen: false,
    hasInternalList: false,
    hasExternalList: false,
  };
  const voteEvent = {
    id: 1,
    title: "Test Vote Event Title",
    startTime: "2022-01-01T00:00:00.000Z",
    endTime: "2022-03-01T23:59:59.000Z",
    resultsFilter: DEFAULT_RESULTS_FILTER,
  };

  beforeEach(() => {
    setOpenSpy = cy.spy().as("setOpenSpy");
    mutateSpy = cy.spy().as("mutateSpy");
  });

  it("should render opened modal", () => {
    // Mount the component
    mount(
      <VoterManagementConfigModal
        voteEvent={voteEvent}
        voterManagement={voterManagement}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Test the existence of elements
    cy.get("#confirm-edit-voter-management-config-button").should("exist");
    cy.get("input[name='hasInternalList']").should("not.be.checked");
    cy.get("input[name='hasExternalList']").should("not.be.checked");
  });

  it("should render close modal", () => {
    // Mount the component
    mount(
      <VoterManagementConfigModal
        voteEvent={voteEvent}
        voterManagement={voterManagement}
        open={false}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Test the existence of elements
    cy.get("#confirm-edit-voter-management-config-button").should("not.exist");
  });

  it("should not handle form submission if voter management has been configured before", () => {
    const configuredVoterManagement = {
      ...voterManagement,
      hasInternalList: true,
      hasExternalList: true,
    };
    const configuredVoteEvent = {
      ...voteEvent,
      voterManagement: configuredVoterManagement,
    };

    // Mount the component
    mount(
      <VoterManagementConfigModal
        voteEvent={configuredVoteEvent}
        voterManagement={configuredVoterManagement}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Intercept PUT request
    cy.intercept(
      "PUT",
      `/api/vote-events/${voteEvent.id}`,
      cy.spy().as("myRequest")
    ).as("setVoterManagement");

    // check presence of elements due to configured voter management
    cy.get("#copy-internal-voters-dropdown").should("exist");
    cy.get("#copy-external-voters-dropdown").should("exist");

    cy.get("#internal-list-checkbox").should("be.checked");
    cy.get("#external-list-checkbox").should("be.checked");

    // Click the save button
    cy.get("#confirm-edit-voter-management-config-button").click();

    cy.get("@myRequest").should("not.have.been.called");
    cy.get("@mutateSpy").should("not.have.been.called");
    cy.get("@setOpenSpy").should("be.calledOnce");
  });

  it("should handle form submission if voter management has not been configured before", () => {
    // Mount the component
    mount(
      <VoterManagementConfigModal
        voteEvent={voteEvent}
        voterManagement={voterManagement}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Intercept PUT request
    cy.intercept("PUT", `/api/vote-events/${voteEvent.id}`, {
      statusCode: 200,
      body: {},
    }).as("setVoterManagement");

    // Click the save button
    cy.get("#confirm-edit-voter-management-config-button").click();

    cy.wait("@setVoterManagement");

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@mutateSpy").should("be.calledOnce");
  });

  it("should hide and display additional options base on what is selected", () => {
    // Mount the component
    mount(
      <VoterManagementConfigModal
        voteEvent={voteEvent}
        voterManagement={voterManagement}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // check if the additional options are hidden
    cy.get("#copy-internal-voters-dropdown").should("not.exist");
    cy.get("#copy-external-voters-dropdown").should("not.exist");

    // check if the additional options are displayed
    cy.get("#internal-list-checkbox").click();
    cy.get("#copy-internal-voters-dropdown").should("exist");

    cy.get("#external-list-checkbox").click();
    cy.get("#copy-external-voters-dropdown").should("exist");
  });

  it("should have a working cancel button", () => {
    // Mount the component
    mount(
      <VoterManagementConfigModal
        voteEvent={voteEvent}
        voterManagement={voterManagement}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Click the cancel button
    cy.get("#cancel-edit-voter-management-config-button").click();

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@mutateSpy").should("not.have.been.called");
  });
});
