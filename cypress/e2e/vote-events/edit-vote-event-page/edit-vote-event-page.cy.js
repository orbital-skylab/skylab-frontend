/* eslint-disable no-undef */

const navigateToPage = (voteEventId) => {
  cy.intercept("GET", `/api/vote-events/${voteEventId}`).as("getVoteEvent");
  cy.visit(`http://localhost:3000/vote-events/${voteEventId}/edit`);

  cy.wait("@getVoteEvent");
};

describe("Testing edit vote event page", () => {
  const voteEventId = 1; // any vote event

  before(() => {
    cy.login("admin@skylab.com", "Password123");
  });

  after(() => {
    cy.get("#nav-sign-out").click();
  });

  it("Should navigate to edit vote event page from home page", () => {
    cy.visit("http://localhost:3000/");
    cy.get("#nav-vote-events").click();
    cy.location("pathname").should("include", "vote-events");
    cy.get(`#edit-vote-event-${voteEventId}-button`).click();
    cy.location("pathname").should(
      "include",
      `vote-events/${voteEventId}/edit`
    );

    // Check if the edit vote event page is active
    cy.get("#vote-event-tabs").should("be.visible");
  });

  it("Should display a message if the vote event does not exist", () => {
    const nonExistenceVoteEventId = 9999999999; // vote event that does not exist

    navigateToPage(nonExistenceVoteEventId);
    cy.contains("No such vote event found").should("be.visible");
  });

  it("Should not be accessible to the public", () => {
    cy.get("#nav-sign-out").click();
    navigateToPage(voteEventId);
    cy.contains("Unauthorized").should("be.visible");
  });

  it("Should not be accessible to the students", () => {
    cy.login("student@skylab.com", "Password123");
    navigateToPage(voteEventId);
    cy.contains("Unauthorized").should("be.visible");
  });

  it("Should not be accessible to the mentors", () => {
    cy.login("mentor@skylab.com", "Password123");
    navigateToPage(voteEventId);
    cy.contains("Unauthorized").should("be.visible");
  });

  it("Should not be accessible to the advisers", () => {
    cy.login("adviser@skylab.com", "Password123");
    navigateToPage(voteEventId);
    cy.contains("Unauthorized").should("be.visible");
  });
});
