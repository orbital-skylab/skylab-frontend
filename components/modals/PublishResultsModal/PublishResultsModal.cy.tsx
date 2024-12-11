/* eslint-disable @typescript-eslint/no-explicit-any */
import PublishResultsModal from "@/components/modals/PublishResultsModal/PublishResultsModal";
import { ERRORS } from "@/helpers/errors";
import { DEFAULT_RESULTS_FILTER } from "@/helpers/voteEvent";
import { VoteEvent } from "@/types/voteEvents";
import { mount } from "cypress/react18";

describe("<PublishResultsModal />", () => {
  let setOpenSpy: any;
  let mutateSpy: any;
  const voteEvent: VoteEvent = {
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
      <PublishResultsModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#display-limit-input").should(
      "have.value",
      DEFAULT_RESULTS_FILTER.displayLimit
    );
    cy.get("#show-rank-checkbox").should(
      DEFAULT_RESULTS_FILTER.showRank ? "be.checked" : "not.be.checked"
    );
    cy.get("#show-votes-checkbox").should(
      DEFAULT_RESULTS_FILTER.showVotes ? "be.checked" : "not.be.checked"
    );
    cy.get("#show-points-checkbox").should(
      DEFAULT_RESULTS_FILTER.showPoints ? "be.checked" : "not.be.checked"
    );
    cy.get("#show-percentage-checkbox").should(
      DEFAULT_RESULTS_FILTER.showPercentage ? "be.checked" : "not.be.checked"
    );

    cy.get("#publish-results-button").should(
      "contain",
      DEFAULT_RESULTS_FILTER.areResultsPublished
        ? "Unpublish Results"
        : "Publish Results"
    );
  });

  it("should render closed modal", () => {
    // Mount the component
    mount(
      <PublishResultsModal
        voteEvent={voteEvent}
        open={false}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#publish-results-button").should("not.exist");
  });

  it("should submit form with valid data", () => {
    // Mount the component
    mount(
      <PublishResultsModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Interact with form inputs
    cy.get("#display-limit-input").clear().type("10");
    cy.get("#show-rank-checkbox").uncheck();
    cy.get("#show-votes-checkbox").uncheck();
    cy.get("#show-points-checkbox").uncheck();
    cy.get("#show-percentage-checkbox").uncheck();

    // Submit the form
    cy.intercept("PUT", `/api/vote-events/${voteEvent.id}`, {
      statusCode: 200,
      body: {},
    }).as("editResultsFilter");
    cy.get("#publish-results-button").click();

    cy.wait("@editResultsFilter");

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
    cy.get("@mutateSpy").should("be.calledOnce");
  });

  it("should not submit form with empty display limit", () => {
    // Mount the component
    mount(
      <PublishResultsModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Submit the form with empty display limit
    cy.get("#display-limit-input").clear();
    cy.get("#publish-results-button").click();

    cy.get("@setOpenSpy").should("not.be.called");
    cy.get("@mutateSpy").should("not.be.called");
    cy.get("#display-limit-input")
      .parent()
      .parent()
      .should("contain", ERRORS.REQUIRED);
  });

  it("should not submit form with non integer display limit", () => {
    // Mount the component
    mount(
      <PublishResultsModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Submit form with non integer display limit
    cy.get("#display-limit-input").clear().type("abc");
    cy.get("#publish-results-button").click();

    cy.get("@setOpenSpy").should("not.be.called");
    cy.get("@mutateSpy").should("not.be.called");
    cy.get("#display-limit-input")
      .parent()
      .parent()
      .should("contain", "Display limit must be an integer");
  });

  it("should not submit form with negative display limit", () => {
    // Mount the component
    mount(
      <PublishResultsModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Submit form with negative display limit
    cy.get("#display-limit-input").clear().type("-4");
    cy.get("#publish-results-button").click();

    cy.get("@setOpenSpy").should("not.be.called");
    cy.get("@mutateSpy").should("not.be.called");
    cy.get("#display-limit-input")
      .parent()
      .parent()
      .should("contain", "Display limit cannot be less than 0");
  });

  it("should have a functioning return button", () => {
    // Mount the component
    mount(
      <PublishResultsModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Click the return button
    cy.get("#publish-results-return-button").click();

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
  });
});
