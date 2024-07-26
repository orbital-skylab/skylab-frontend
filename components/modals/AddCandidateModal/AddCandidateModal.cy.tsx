/* eslint-disable @typescript-eslint/no-explicit-any */
import AddCandidateModal from "@/components/modals/AddCandidateModal/AddCandidateModal";
import { mount } from "cypress/react18";

describe("<AddCandidateModal />", () => {
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
      <AddCandidateModal
        voteEventId={voteEventId}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#add-candidate-button").should("exist");
  });

  it("should render closed modal", () => {
    // Mount the component
    mount(
      <AddCandidateModal
        voteEventId={voteEventId}
        open={false}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#add-candidate-button").should("not.exist");
  });

  it("should submit form with valid data", () => {
    // Mount the component
    mount(
      <AddCandidateModal
        voteEventId={voteEventId}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Interact with form inputs
    cy.get("#project-id-input").type("444");

    // Submit the form
    cy.intercept("POST", `/api/vote-events/${voteEventId}/candidates`, {
      statusCode: 200,
      body: {},
    }).as("addCandidate");
    cy.get("#add-candidate-button").click();

    cy.wait("@addCandidate");

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
    cy.get("@mutateSpy").should("be.calledOnce");
    cy.get("@handleCloseMenuSpy").should("be.calledOnce");
  });

  it("should not submit form with invalid data", () => {
    // Mount the component
    mount(
      <AddCandidateModal
        voteEventId={voteEventId}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Submit the form with empty field
    cy.get("#add-candidate-button").click();

    cy.get("@setOpenSpy").should("not.be.called");
    cy.get("@mutateSpy").should("not.be.called");
    cy.get("@handleCloseMenuSpy").should("not.be.called");
    cy.contains("This field is required").should("exist");

    // Submit form with invalid project id
    cy.get("#project-id-input").type("invalid-project-id");
    cy.get("#add-candidate-button").click();

    cy.get("@setOpenSpy").should("not.be.called");
    cy.get("@mutateSpy").should("not.be.called");
    cy.get("@handleCloseMenuSpy").should("not.be.called");
    cy.contains("Project ID must be an integer").should("exist");
  });

  it("should have a functioning return button", () => {
    // Mount the component
    mount(
      <AddCandidateModal
        voteEventId={voteEventId}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Click the return button
    cy.get("#add-candidate-return-button").click();

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
  });
});
