/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import DeleteVoteEventModal from "./DeleteVoteEventModal";
import { mount } from "cypress/react18";
import { DEFAULT_RESULTS_FILTER } from "@/helpers/voteEvent";

describe("<DeleteVoteEventModal />", () => {
  let setOpenSpy: any;
  let mutateSpy: any;

  // Mock voteEvent object
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
      <DeleteVoteEventModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#delete-vote-event-confirm-button").should("exist");
  });

  it("should render closed modal", () => {
    // Mount the component
    mount(
      <DeleteVoteEventModal
        voteEvent={voteEvent}
        open={false}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#delete-vote-event-confirm-button").should("not.exist");
  });

  it("should delete vote event on confirmation", () => {
    // Mount the component
    mount(
      <DeleteVoteEventModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Intercept DELETE request
    cy.intercept("DELETE", `/api/vote-events/${voteEvent.id}`, {
      statusCode: 200,
      body: {},
    }).as("deleteVoteEvent");

    // Click delete button
    cy.get("#delete-vote-event-confirm-button").click();

    cy.wait("@deleteVoteEvent");

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
    cy.get("@mutateSpy").should("be.calledOnce");
  });

  it("should not delete vote event on cancellation", () => {
    // Mount the component
    mount(
      <DeleteVoteEventModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Click cancel button
    cy.get("#delete-vote-event-cancel-button").click();

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
  });
});
