/* eslint-disable @typescript-eslint/no-explicit-any */
import VoteConfigModal from "@/components/modals/VoteConfigModal/VoteConfigModal";
import { ERRORS } from "@/helpers/errors";
import { DEFAULT_RESULTS_FILTER } from "@/helpers/voteEvent";
import { DISPLAY_TYPES, VoteEvent } from "@/types/voteEvents";
import { mount } from "cypress/react18";

const assertMinMaxVotesError = (errorText: string) => {
  cy.get("#min-votes-input")
    .parent()
    .parent()
    .contains(errorText)
    .should("be.visible");
  cy.get("#max-votes-input")
    .parent()
    .parent()
    .contains(errorText)
    .should("be.visible");
};

const assertFormNotSubmitted = () => {
  cy.get("@setOpenSpy").should("not.be.called");
  cy.get("@mutateSpy").should("not.be.called");
};

describe("<VoteConfigModal />", () => {
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

  it("should render opened modal with default values if vote config has not been set", () => {
    // Mount the component
    mount(
      <VoteConfigModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#display-type-dropdown").should("have.value", "");
    cy.get("#min-votes-input").should("have.value", "1");
    cy.get("#max-votes-input").should("have.value", "1");
    cy.get("#instructions-input").should("have.value", "");
    cy.get("#random-order-checkbox").should("not.be.checked");

    cy.get("#save-vote-config-button").should("exist");
  });

  it("should render opened modal with vote config values if vote config has been set", () => {
    const voteConfig = {
      displayType: DISPLAY_TYPES.TABLE,
      minVotes: 2,
      maxVotes: 3,
      instructions: "vote instructions",
      isRandomOrder: true,
    };

    // Mount the component
    mount(
      <VoteConfigModal
        voteEvent={{
          ...voteEvent,
          voteConfig: voteConfig,
        }}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#display-type-dropdown").contains(DISPLAY_TYPES.TABLE);
    cy.get("#min-votes-input").should("have.value", voteConfig.minVotes);
    cy.get("#max-votes-input").should("have.value", voteConfig.maxVotes);
    cy.get("#instructions-input").should("have.value", voteConfig.instructions);
    cy.get("#random-order-checkbox").should(
      voteConfig.isRandomOrder ? "be.checked" : "not.be.checked"
    );

    cy.get("#save-vote-config-button").should("exist");
  });

  it("should render closed modal", () => {
    // Mount the component
    mount(
      <VoteConfigModal
        voteEvent={voteEvent}
        open={false}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#save-vote-config-button").should("not.exist");
  });

  it("should submit form with valid data", () => {
    // Mount the component
    mount(
      <VoteConfigModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Interact with form inputs
    cy.get("#display-type-dropdown").click();
    cy.get(`#${DISPLAY_TYPES.TABLE}-option`).click();

    // Submit the form
    cy.intercept("PUT", `/api/vote-events/${voteEvent.id}`, {
      statusCode: 200,
      body: {},
    }).as("editVoteConfig");
    cy.get("#save-vote-config-button").click();

    cy.wait("@editVoteConfig");

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
    cy.get("@mutateSpy").should("be.calledOnce");
  });

  it("should not submit form if display type is not selected", () => {
    // Mount the component
    mount(
      <VoteConfigModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Submit the form with empty display type
    cy.get("#save-vote-config-button").click();

    cy.get("#display-type-dropdown")
      .parent()
      .parent()
      .contains(ERRORS.REQUIRED)
      .should("be.visible");
    assertFormNotSubmitted();
  });

  it("should not submit form if min and max votes are not integers", () => {
    // Mount the component
    mount(
      <VoteConfigModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // min and max votes are not integers
    cy.get("#min-votes-input").clear().type("a");
    cy.get("#max-votes-input").clear().type("0.1");
    cy.get("#save-vote-config-button").click();

    assertFormNotSubmitted();
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
  });

  it("should not submit form if min and max votes are empty", () => {
    // Mount the component
    mount(
      <VoteConfigModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // min and max votes empty
    cy.get("#min-votes-input").clear();
    cy.get("#max-votes-input").clear();
    cy.get("#save-vote-config-button").click();

    assertFormNotSubmitted();
    assertMinMaxVotesError(ERRORS.REQUIRED);
  });

  it("should not submit form if min vote is greater than max vote", () => {
    // Mount the component
    mount(
      <VoteConfigModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

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
    assertFormNotSubmitted();
  });

  it("should not submit form if min or max votes are less than 1", () => {
    // Mount the component
    mount(
      <VoteConfigModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // min and max cannot be less than 1
    cy.get("#min-votes-input").clear().type("-1");
    cy.get("#max-votes-input").clear().type("0");
    cy.get("#save-vote-config-button").click();

    cy.get("#min-votes-input")
      .parent()
      .parent()
      .contains("Minimum number of votes cannot be less than 1")
      .should("be.visible");
    cy.get("#max-votes-input")
      .parent()
      .parent()
      .contains("Maximum number of votes cannot be less than 1")
      .should("be.visible");
    assertFormNotSubmitted();
  });

  it("should have a functioning return button", () => {
    // Mount the component
    mount(
      <VoteConfigModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Click the return button
    cy.get("#vote-config-return-button").click();

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
  });
});
