/* eslint-disable @typescript-eslint/no-explicit-any */
import VoteConfigTab from "@/components/tabs/voteEvent/VoteConfigTab/VoteConfigTab";
import { ERRORS } from "@/helpers/errors";
import { DEFAULT_RESULTS_FILTER } from "@/helpers/voteEvent";
import { DISPLAY_TYPES } from "@/types/voteEvents";
import { mount } from "cypress/react18";

describe("<VoteConfigTab />", () => {
  let mutateSpy: any;
  const voteEvent = {
    id: 1,
    title: "Test Vote Event",
    startTime: "2022-01-01T00:00:00Z",
    endTime: "2122-01-02T00:00:00Z",
    resultsFilter: DEFAULT_RESULTS_FILTER,
  };

  beforeEach(() => {
    mutateSpy = cy.spy().as("mutateSpy");

    cy.intercept("PUT", `/api/vote-events/${voteEvent.id}`, {
      statusCode: 200,
      body: {},
    }).as("editVoteEventRequest");
  });

  it("should render with default values if vote config has not been set", () => {
    // Mount the component
    mount(<VoteConfigTab voteEvent={voteEvent} mutate={mutateSpy} />);

    cy.get("#display-type-dropdown").should("have.value", "");
    cy.get("#min-votes-input").should("have.value", "1");
    cy.get("#max-votes-input").should("have.value", "1");
    cy.get("#instructions-input").should("have.value", "");
    cy.get("#random-order-checkbox").should("not.be.checked");
  });

  it("should render with vote config values if vote config has been set", () => {
    // Mount the component
    mount(
      <VoteConfigTab
        voteEvent={{
          ...voteEvent,
          voteConfig: {
            displayType: DISPLAY_TYPES.TABLE,
            minVotes: 2,
            maxVotes: 3,
            instructions: "vote instructions",
            isRandomOrder: true,
          },
        }}
        mutate={mutateSpy}
      />
    );

    cy.get("#display-type-dropdown").contains(DISPLAY_TYPES.TABLE);
    cy.get("#min-votes-input").should("have.value", "2");
    cy.get("#max-votes-input").should("have.value", "3");
    cy.get("#instructions-input").should("have.value", "vote instructions");
    cy.get("#random-order-checkbox").should("be.checked");
  });

  it("should submit form with valid data", () => {
    // Mount the component
    mount(<VoteConfigTab voteEvent={voteEvent} mutate={mutateSpy} />);

    // Set display type and submit the form
    cy.get("#display-type-dropdown").click();
    cy.get(`#${DISPLAY_TYPES.TABLE}-option`).click();
    cy.get("#save-vote-config-button").click();

    cy.wait("@editVoteEventRequest");
    cy.get("@mutateSpy").should("be.calledOnce");
  });

  it("should not submit form if display type is not selected", () => {
    // Mount the component
    mount(<VoteConfigTab voteEvent={voteEvent} mutate={mutateSpy} />);

    // Submit the form with empty display type
    cy.get("#save-vote-config-button").click();

    cy.get("#display-type-dropdown")
      .parent()
      .parent()
      .contains(ERRORS.REQUIRED)
      .should("be.visible");
    cy.get("@mutateSpy").should("not.be.called");
  });

  it("should not submit form if min and max votes are not valid", () => {
    // Mount the component
    mount(<VoteConfigTab voteEvent={voteEvent} mutate={mutateSpy} />);

    // min and max votes are not integers
    cy.get("#min-votes-input").clear().type("a");
    cy.get("#max-votes-input").clear().type("0.1");
    cy.get("#save-vote-config-button").click();

    cy.get("#min-votes-input")
      .parent()
      .parent()
      .contains("Minimum number of votes must be an integer")
      .should("be.visible");
    cy.get("#max-votes-input")
      .parent()
      .parent()
      .contains("Maximum number of votes must be an integer")
      .should("be.visible");

    // min and max votes empty
    cy.get("#min-votes-input").clear();
    cy.get("#max-votes-input").clear();
    cy.get("#save-vote-config-button").click();

    cy.get("#min-votes-input")
      .parent()
      .parent()
      .contains(ERRORS.REQUIRED)
      .should("be.visible");
    cy.get("#max-votes-input")
      .parent()
      .parent()
      .contains(ERRORS.REQUIRED)
      .should("be.visible");

    // min votes is greater than max votes
    cy.get("#min-votes-input").clear().type("3");
    cy.get("#max-votes-input").clear().type("2");
    cy.get("#save-vote-config-button").click();

    cy.get("#min-votes-input")
      .parent()
      .parent()
      .contains(
        "Minimum number of votes cannot be greater than Maximum number of votes"
      )
      .should("be.visible");

    // min cannot be less than 0 and max cannot be less than 1
    cy.get("#min-votes-input").clear().type("-1");
    cy.get("#max-votes-input").clear().type("0");
    cy.get("#save-vote-config-button").click();

    cy.get("#min-votes-input")
      .parent()
      .parent()
      .contains("Minimum number of votes vote cannot be less than 0")
      .should("be.visible");
    cy.get("#max-votes-input")
      .parent()
      .parent()
      .contains("Maximum number of votes cannot be less than 1")
      .should("be.visible");

    // check that mutate is not called
    cy.get("@mutateSpy").should("not.be.called");
  });
});
