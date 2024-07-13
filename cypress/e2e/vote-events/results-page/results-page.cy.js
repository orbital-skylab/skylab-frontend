/* eslint-disable no-undef */

const assertError = (message) => {
  cy.get("#results-table").should("not.exist");
  cy.contains(message).should("be.visible");
};

const navigateToResultsPage = (voteEventId) => {
  cy.intercept("GET", `/api/vote-events/${voteEventId}/results`).as(
    "getResults"
  );
  cy.intercept("GET", `/api/vote-events/${voteEventId}`).as("getVoteEvent");

  cy.visit(`http://localhost:3000/vote-events/${voteEventId}/results`);
  cy.wait(["@getResults", "@getVoteEvent"]);
};

describe("Testing vote event results page", () => {
  const voteEventId = 4; // vote event with published results
  const notYetStartedVoteEventId = 1; // vote event that has not started
  const nonPublishedVoteEventId = 6; // vote event with results but not published
  const noResultsVoteEventId = 5; // vote event with no results (published)
  const nonExistenceVoteEventId = 9999999999; // vote event that does not exist
  before(() => {
    cy.login("admin@skylab.com", "Password123");
  });

  after(() => {
    cy.get("#nav-sign-out").click();
  });

  it("Should be able to navigate to vote event results page from home page", () => {
    cy.intercept("GET", `/api/vote-events/${voteEventId}/results`).as(
      "getResults"
    );
    cy.intercept("GET", `/api/vote-events/${voteEventId}`).as("getVoteEvent");

    cy.visit("http://localhost:3000/");
    cy.get("#nav-vote-events").click();
    cy.location("pathname").should("include", "vote-events");
    cy.get(`#vote-event-${voteEventId}-results-button`).click();

    // Check if the results page is displayed
    cy.wait(["@getResults", "@getVoteEvent"]);
    cy.get("#results-header").should("be.visible");
  });

  it("Should display the vote event results if there are votes", () => {
    navigateToResultsPage(voteEventId);
    //cy.get("#results-header").should("be.visible");
    cy.get("#results-table").should("be.visible");
  });

  it("Should display a no results message if there are no votes", () => {
    navigateToResultsPage(noResultsVoteEventId);
    cy.contains("No results found").should("be.visible");
  });

  it("Should display a message if the vote event does not exist", () => {
    navigateToResultsPage(nonExistenceVoteEventId);
    assertError("No such vote event found!");
  });

  it("Should display a message if the vote event has not started", () => {
    navigateToResultsPage(notYetStartedVoteEventId);
    assertError("Vote event has not started!");
  });

  it("Should display a message if the vote event results are not published", () => {
    navigateToResultsPage(nonPublishedVoteEventId);
    assertError("Results Not published!");
  });
});
