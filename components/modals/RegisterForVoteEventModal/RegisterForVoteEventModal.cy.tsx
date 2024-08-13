/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEFAULT_RESULTS_FILTER } from "@/helpers/voteEvent";
import { mount } from "cypress/react18";
import RegisterForVoteEventModal from "./RegisterForVoteEventModal";

describe("<RegisterForVoteEventModal />", () => {
  let setOpenSpy: any;
  let mutateSpy: any;

  const voteEvent = {
    id: 1,
    title: "Test Vote Event",
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    resultsFilter: DEFAULT_RESULTS_FILTER,
  };

  beforeEach(() => {
    setOpenSpy = cy.spy().as("setOpenSpy");
    mutateSpy = cy.spy().as("mutateSpy");
  });

  it("should render opened modal", () => {
    // Mount the component
    mount(
      <RegisterForVoteEventModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#register-for-vote-event-confirm-button").should("exist");
  });

  it("should render closed modal", () => {
    // Mount the component
    mount(
      <RegisterForVoteEventModal
        voteEvent={voteEvent}
        open={false}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#register-for-vote-event-confirm-button").should("not.exist");
  });

  it("should register the user", () => {
    // Mount the component
    mount(
      <RegisterForVoteEventModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Register the user
    cy.intercept("POST", `/api/vote-events/${voteEvent.id}/register`, {
      statusCode: 200,
      body: {},
    }).as("register");
    cy.get("#register-for-vote-event-confirm-button").click();

    cy.wait("@register");

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
    cy.get("@mutateSpy").should("be.calledOnce");
  });

  it("should have a functioning cancel button", () => {
    // Mount the component
    mount(
      <RegisterForVoteEventModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Click the cancel button
    cy.get("#register-for-vote-event-cancel-button").click();

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
  });
});
