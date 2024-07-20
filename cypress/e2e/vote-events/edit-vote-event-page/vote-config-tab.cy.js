/* eslint-disable no-undef */

describe("Testing vote event vote config tab", () => {
  const voteEventId = 4; // vote event with votes
  const noVoteConfigVoteEventId = 1; // vote event with no vote config
  let voteEvent = {};

  const navigateToVoteConfigTab = (voteEventId) => {
    cy.intercept("GET", `/api/vote-events/${voteEventId}`, (req) => {
      delete req.headers["if-none-match"];
      req.continue((res) => {
        voteEvent = res.body.voteEvent;
      });
    }).as("getVoteEvent");

    cy.visit(`http://localhost:3000/vote-events/${voteEventId}/edit`);
    cy.get(`#vote-config-tab`).click();
  };

  before(() => {
    cy.login("admin@skylab.com", "Password123");
  });

  beforeEach(() => {
    navigateToVoteConfigTab(voteEventId);
  });

  after(() => {
    cy.get("#nav-sign-out").click();
  });

  it("Should navigate to vote event vote config tab from home page", () => {
    cy.visit("http://localhost:3000/");
    cy.get("#nav-vote-events").click();
    cy.location("pathname").should("include", "vote-events");
    cy.get(`#edit-vote-event-${voteEventId}-button`).click();
    cy.location("pathname").should(
      "include",
      `vote-events/${voteEventId}/edit`
    );
    cy.get(`#vote-config-tab`).click();

    // Check if the vote config tab is active
    cy.get("#vote-config-modal-button").should("be.visible");
  });

  it("Should only display config button if vote config is not set", () => {
    navigateToVoteConfigTab(noVoteConfigVoteEventId);
    cy.get("#votes-header").should("not.exist");
    cy.get("#vote-config-modal-button").should("be.visible");
  });

  it("Should display the vote event votes if there are votes", () => {
    cy.get("#votes-header").should("be.visible");
    cy.get("#votes-table").should("be.visible");
  });

  it("Should be able to set vote config for the first time", () => {
    cy.request("POST", "http://localhost:4000/api/vote-events", {
      voteEvent: {
        title: "Vote config tab test vote event",
        startTime: new Date("2022-12-11T12:00").toISOString(),
        endTime: new Date("2022-12-12T12:00").toISOString(),
      },
    }).then((response) => {
      voteEvent = response.body.voteEvent;
      navigateToVoteConfigTab(voteEvent.id);

      cy.get("#vote-config-modal-button").click();
      cy.get("#vote-config-modal").should("be.visible");

      cy.get("#display-type-dropdown").click();
      cy.get(`#Table-option`).click();

      cy.get("#min-votes-input").clear().type(1);
      cy.get("#max-votes-input").clear().type(2);
      cy.get("#random-order-checkbox").uncheck();
      cy.get("#instructions-input").clear().type("Test instructions");
      cy.get("#save-vote-config-button").click();

      cy.get("#success-alert").should("be.visible");
      cy.get("#vote-config-modal").should("not.exist");
      cy.get("#votes-header").should("be.visible");
      cy.contains("No votes found").should("be.visible");
      cy.get("#votes-table").should("not.exist");

      cy.request(
        "DELETE",
        `http://localhost:4000/api/vote-events/${voteEvent.id}`
      );
    });
  });

  it("Should be able to edit existing vote config", () => {
    const voteConfig = voteEvent.voteConfig;
    cy.get("#vote-config-modal-button").click();
    cy.get("#vote-config-modal").should("be.visible");

    cy.get("#display-type-dropdown")
      .contains(voteConfig.displayType)
      .should("be.visible");
    cy.get("#min-votes-input")
      .should("have.value", voteConfig.minVotes)
      .clear()
      .type(2);
    cy.get("#max-votes-input")
      .should("have.value", voteConfig.maxVotes)
      .clear()
      .type(2);
    cy.get("#random-order-checkbox").should(
      voteConfig.isRandomOrder ? "be.checked" : "not.be.checked"
    );
    cy.get("#instructions-input")
      .should("have.value", voteConfig.instructions)
      .clear()
      .type("Test instructions edited");
    cy.get("#save-vote-config-button").click();

    cy.get("#success-alert").should("be.visible");
    cy.get("#vote-config-modal").should("not.exist");

    cy.get("#vote-config-modal-button").click();
    cy.get("#instructions-input").should(
      "have.value",
      "Test instructions edited"
    );
  });

  it("Should be able to delete a vote", () => {
    let votes = [];
    cy.request(
      "GET",
      `http://localhost:4000/api/vote-events/${voteEventId}/votes/all`
    ).then((req) => {
      votes = req.body.votes;
      cy.get(`#delete-vote-${votes[0].id}-button`).click();
      cy.get("#delete-vote-modal").should("be.visible");
      cy.get("#delete-vote-confirm-button").click();

      cy.get("#success-alert").should("be.visible");
      cy.get("#delete-vote-modal").should("not.exist");
      cy.get("tbody")
        .find("tr")
        .should("have.length", votes.length - 1);
    });
  });
});
