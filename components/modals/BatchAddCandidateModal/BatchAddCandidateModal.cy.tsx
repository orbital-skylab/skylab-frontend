/* eslint-disable @typescript-eslint/no-explicit-any */
import BatchAddCandidateModal from "@/components/modals/BatchAddCandidateModal/BatchAddCandidateModal";
import { mount } from "cypress/react18";

describe("<BatchAddCandidateModal />", () => {
  let setOpenSpy: any;
  let mutateSpy: any;
  let handleCloseMenuSpy: any;
  const voteEventId = 1;
  const cohorts = [
    { startDate: "ignore", endDate: "ignore", academicYear: "2024" },
    { startDate: "ignore", endDate: "ignore", academicYear: "2023" },
    { startDate: "ignore", endDate: "ignore", academicYear: "2022" },
  ];

  beforeEach(() => {
    setOpenSpy = cy.spy().as("setOpenSpy");
    mutateSpy = cy.spy().as("mutateSpy");
    handleCloseMenuSpy = cy.spy().as("handleCloseMenuSpy");

    cy.intercept("GET", `/api/cohorts`, {
      statusCode: 200,
      body: {
        cohorts: cohorts,
      },
    }).as("cohortsRequest");
  });

  it("should render opened modal", () => {
    // Mount the component
    mount(
      <BatchAddCandidateModal
        voteEventId={voteEventId}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#batch-add-candidate-button").should("exist");
  });

  it("should render closed modal", () => {
    // Mount the component
    mount(
      <BatchAddCandidateModal
        voteEventId={voteEventId}
        open={false}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#batch-add-candidate-button").should("not.exist");
  });

  it("should submit form with valid data", () => {
    // Mount the component
    mount(
      <BatchAddCandidateModal
        voteEventId={voteEventId}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Interact with form inputs
    cy.wait("@cohortsRequest");
    cy.get("#cohort-dropdown").click();
    cy.get("#2024-option").click();
    cy.get("#achievement-dropdown").click();
    cy.get("#Artemis-option").click();

    // Submit the form
    cy.intercept("POST", `/api/vote-events/${voteEventId}/candidates/batch`, {
      statusCode: 200,
      body: {},
    }).as("batchAddCandidate");
    cy.get("#batch-add-candidate-button").click();

    cy.wait("@batchAddCandidate");

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
    cy.get("@mutateSpy").should("be.calledOnce");
    cy.get("@handleCloseMenuSpy").should("be.calledOnce");
  });

  it("should not submit form with invalid data", () => {
    // Mount the component
    mount(
      <BatchAddCandidateModal
        voteEventId={voteEventId}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Submit the form with empty fields
    cy.wait("@cohortsRequest");
    cy.get("#batch-add-candidate-button").click();

    cy.get("@setOpenSpy").should("not.be.called");
    cy.get("@mutateSpy").should("not.be.called");
    cy.get("@handleCloseMenuSpy").should("not.be.called");
    cy.contains("This field is required").should("exist");
  });

  it("should have a functioning return button", () => {
    // Mount the component
    mount(
      <BatchAddCandidateModal
        voteEventId={voteEventId}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Click the return button
    cy.get("#batch-add-candidate-return-button").click();

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
  });
});
