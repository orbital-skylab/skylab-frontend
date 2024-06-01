/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import AddVoteEventModal from "./AddVoteEventModal";
import { mount } from "cypress/react18";

describe("<AddVoteEventModal />", () => {
  let setOpenSpy: any;
  let mutateSpy: any;

  beforeEach(() => {
    setOpenSpy = cy.spy().as("setOpenSpy");
    mutateSpy = cy.spy().as("mutateSpy");
  });

  it("should render opened modal", () => {
    // Mount the component
    mount(
      <AddVoteEventModal open={true} setOpen={setOpenSpy} mutate={mutateSpy} />
    );

    cy.get("#add-vote-event-title-input").should("exist");
  });

  it("should render closed modal", () => {
    // Mount the component
    mount(
      <AddVoteEventModal open={false} setOpen={setOpenSpy} mutate={mutateSpy} />
    );

    cy.get("#add-vote-event-title-input").should("not.exist");
  });

  it("should submit form with valid data", () => {
    // Mount the component
    mount(
      <AddVoteEventModal open={true} setOpen={setOpenSpy} mutate={mutateSpy} />
    );

    // Interact with form inputs
    cy.get("#add-vote-event-title-input").type("Test Title");
    cy.get("#add-vote-event-start-time-input").type("2024-06-01T08:00");
    cy.get("#add-vote-event-end-time-input").type("2024-06-05T18:00");

    // Submit the form
    cy.intercept("POST", "/api/vote-events", {
      statusCode: 200,
      body: {},
    }).as("addVoteEvent");
    cy.get("#add-vote-event-button").click();

    cy.wait("@addVoteEvent");

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
    cy.get("@mutateSpy").should("be.calledOnce");
  });

  it("should have a functioning cancel button", () => {
    // Mount the component
    mount(
      <AddVoteEventModal open={true} setOpen={setOpenSpy} mutate={mutateSpy} />
    );

    // Click the cancel button
    cy.get("#cancel-add-vote-event-button").click();

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
  });

  it("should not submit form with empty title", () => {
    // Mount the component
    mount(
      <AddVoteEventModal open={true} setOpen={setOpenSpy} mutate={mutateSpy} />
    );

    // Submit the form
    cy.get("#add-vote-event-button").click();

    cy.get("@setOpenSpy").should("not.be.called");
    cy.get("@mutateSpy").should("not.be.called");
    cy.contains("This field is required").should("exist");
  });

  it("should not submit if start time is equal to or greater than end time", () => {
    // Mount the component
    mount(
      <AddVoteEventModal open={true} setOpen={setOpenSpy} mutate={mutateSpy} />
    );

    // Interact with form inputs
    cy.get("#add-vote-event-title-input").type("Test Title");
    cy.get("#add-vote-event-start-time-input").type("2024-07-01T08:00");
    cy.get("#add-vote-event-end-time-input").type("2024-06-01T08:00");

    // Submit the form
    cy.get("#add-vote-event-button").click();

    cy.get("@setOpenSpy").should("not.be.called");
    cy.get("@mutateSpy").should("not.be.called");
    cy.contains("End date time must be greater than start date time").should(
      "exist"
    );
  });
});
