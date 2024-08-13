/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import ExternalVoterGenerationModal from "./ExternalVoterGenerationModal";

describe("<ExternalVoterGenerationModal />", () => {
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
      <ExternalVoterGenerationModal
        voteEventId={voteEventId}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#generate-voter-ids-button").should("exist");
  });

  it("should render closed modal", () => {
    // Mount the component
    mount(
      <ExternalVoterGenerationModal
        voteEventId={voteEventId}
        open={false}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#generate-voter-ids-button").should("not.exist");
  });

  it("should submit form with valid data", () => {
    // Mount the component
    mount(
      <ExternalVoterGenerationModal
        voteEventId={voteEventId}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Interact with form inputs
    cy.get("#voter-id-amount-input").type("100");
    cy.get("#voter-id-length-input").type("10");

    // Submit the form
    cy.intercept(
      "POST",
      `/api/vote-events/${voteEventId}/voter-management/external-voters/generate`,
      {
        statusCode: 200,
        body: {},
      }
    ).as("generateVoterIds");
    cy.get("#generate-voter-ids-button").click();

    cy.wait("@generateVoterIds");

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
    cy.get("@mutateSpy").should("be.calledOnce");
    cy.get("@handleCloseMenuSpy").should("be.calledOnce");
  });

  it("should not submit form with empty fields", () => {
    // Mount the component
    mount(
      <ExternalVoterGenerationModal
        voteEventId={voteEventId}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // voterIdAmount and voterIdLength are empty
    cy.get("#generate-voter-ids-button").click();

    cy.get("@setOpenSpy").should("not.be.called");
    cy.get("@mutateSpy").should("not.be.called");
    cy.get("@handleCloseMenuSpy").should("not.be.called");
    cy.contains("Amount of voter IDs is required.").should("be.visible");
    cy.contains("Length of voter IDs is required.").should("be.visible");
  });

  it("should not submit form if amount is not between 1 and 1000", () => {
    // Mount the component
    mount(
      <ExternalVoterGenerationModal
        voteEventId={voteEventId}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#voter-id-length-input").type("10");

    // voterIdAmount is below 1
    cy.get("#voter-id-amount-input").type("0");
    cy.get("#generate-voter-ids-button").click();
    cy.contains("Amount of voter IDs must be at least 1.").should("be.visible");

    // voterIdAmount is above 1000
    cy.get("#voter-id-amount-input").clear().type("1001");
    cy.get("#generate-voter-ids-button").click();
    cy.contains("Amount of voter IDs cannot exceed 1000.").should("be.visible");

    cy.get("@setOpenSpy").should("not.be.called");
    cy.get("@mutateSpy").should("not.be.called");
    cy.get("@handleCloseMenuSpy").should("not.be.called");
  });

  it("should not submit form if length is not between 5 and 20", () => {
    // Mount the component
    mount(
      <ExternalVoterGenerationModal
        voteEventId={voteEventId}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#voter-id-amount-input").type("100");

    // voterIdLength is below 5
    cy.get("#voter-id-length-input").type("4");
    cy.get("#generate-voter-ids-button").click();
    cy.contains("Length of voter IDs must be at least 5.").should("be.visible");

    // voterIdLength is above 20
    cy.get("#voter-id-length-input").clear().type("21");
    cy.get("#generate-voter-ids-button").click();
    cy.contains("Length of voter IDs cannot exceed 20.").should("be.visible");

    cy.get("@setOpenSpy").should("not.be.called");
    cy.get("@mutateSpy").should("not.be.called");
    cy.get("@handleCloseMenuSpy").should("not.be.called");
  });

  it("should not submit form if amount and length are not integers", () => {
    // Mount the component
    mount(
      <ExternalVoterGenerationModal
        voteEventId={voteEventId}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // voterIdAmount and voterIdLength are not integers
    cy.get("#voter-id-amount-input").type("1.5");
    cy.get("#voter-id-length-input").type("a");
    cy.get("#generate-voter-ids-button").click();
    cy.contains("Amount of voter IDs must be an integer.").should("be.visible");
    cy.contains("Length of voter IDs must be an integer.").should("be.visible");

    cy.get("@setOpenSpy").should("not.be.called");
    cy.get("@mutateSpy").should("not.be.called");
    cy.get("@handleCloseMenuSpy").should("not.be.called");
  });

  it("Should have a functioning return button", () => {
    // Mount the component
    mount(
      <ExternalVoterGenerationModal
        voteEventId={voteEventId}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Click the return button
    cy.get("#generate-voter-ids-return-button").click();

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
    cy.get("@mutateSpy").should("not.be.called");
    cy.get("@handleCloseMenuSpy").should("be.calledOnce");
  });
});
