/* eslint-disable no-undef */

const navigateToVoteConfigTab = (voteEventId) => {
  cy.visit(`http://localhost:3000/vote-events/${voteEventId}/edit`);
  cy.get(`#vote-config-tab`).click();
};

describe("Testing vote event vote config tab", () => {
  const voteEventId = 4; // vote event with votes
  const noVotesVoteEventId = 5; // vote event with no votes

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

  it("Should display the vote event votes if there are votes", () => {
    cy.get("#votes-header").should("be.visible");
    cy.get("#votes-table").should("be.visible");
  });

  it("Should display a no votes message if there are no votes", () => {
    navigateToVoteConfigTab(noVotesVoteEventId);

    cy.contains("No votes found").should("be.visible");
    cy.get("#votes-table").should("not.exist");
  });
});
