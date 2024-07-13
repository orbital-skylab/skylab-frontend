/* eslint-disable no-undef */

const navigateToResultsTab = (voteEventId) => {
  cy.intercept("GET", `/api/vote-events/${voteEventId}`).as("getVoteEvent");
  cy.visit(`http://localhost:3000/vote-events/${voteEventId}/edit`);

  cy.wait("@getVoteEvent");
  cy.get(`#results-tab`).click();
};

const assertResultsNotPublished = (voteEventId) => {
  cy.visit(`http://localhost:3000/vote-events/${voteEventId}/results`);
  cy.contains("Results Not published!").should("be.visible");
  cy.visit("http://localhost:3000/vote-events");
  cy.get(`#edit-vote-event-${voteEventId}-button`).should("exist");
  cy.get(`#vote-event-${voteEventId}-results-button`).should("not.exist");
};

const unPublishResults = (voteEventId) => {
  navigateToResultsTab(voteEventId);
  cy.get("#publish-results-modal-button").click();
  cy.get("#publish-results-button").click();
  cy.get("#success-alert").should("be.visible");
};

describe("Testing vote event results tab", () => {
  const voteEventId = 6; // vote event with results but not published
  const noResultsVoteEventId = 5; // vote event with no results (published)

  before(() => {
    cy.login("admin@skylab.com", "Password123");
  });

  beforeEach(() => {
    navigateToResultsTab(voteEventId);
  });

  after(() => {
    cy.get("#nav-sign-out").click();
  });

  it("Should navigate to vote event results tab from home page", () => {
    cy.visit("http://localhost:3000/");
    cy.get("#nav-vote-events").click();
    cy.location("pathname").should("include", "vote-events");
    cy.get(`#edit-vote-event-${voteEventId}-button`).click();
    cy.location("pathname").should(
      "include",
      `vote-events/${voteEventId}/edit`
    );
    cy.get(`#results-tab`).click();

    // Check if the results tab is active
    cy.get("#results-header").should("be.visible");
  });

  it("Should display the vote event results if there are votes", () => {
    cy.get("#results-header").should("be.visible");
    cy.get("#results-table").should("be.visible");
  });

  it("Should display a no results message if there are no votes", () => {
    navigateToResultsTab(noResultsVoteEventId);

    cy.contains("No results found").should("be.visible");
    cy.get("#results-table").should("not.exist");
  });

  it("should be able to set role weights", () => {
    cy.get("#role-weights-modal-button").click();
    cy.get("#administrator-weight-input").clear().type("10");
    cy.get("#mentor-weight-input").clear().type("10");
    cy.get("#adviser-weight-input").clear().type("10");
    cy.get("#student-weight-input").clear().type("10");
    cy.get("#public-weight-input").clear().type("10");
    cy.get("#save-role-weights-button").click();

    cy.get("#success-alert").should("be.visible");
    cy.get("#role-weights-modal").should("not.exist");

    // Check if the weights are saved
    cy.get("#role-weights-modal-button").click();
    cy.get("#administrator-weight-input").should("have.value", "10");
    cy.get("#mentor-weight-input").should("have.value", "10");
    cy.get("#adviser-weight-input").should("have.value", "10");
    cy.get("#student-weight-input").should("have.value", "10");
    cy.get("#public-weight-input").should("have.value", "10");
  });

  it("should be able to publish and unpublish results", () => {
    // Check if the results are not published
    assertResultsNotPublished(voteEventId);

    // Publish the results
    navigateToResultsTab(voteEventId);
    cy.get("#publish-results-modal-button").click();
    cy.get("#publish-results-button").click();
    cy.get("#success-alert").should("be.visible");
    cy.get("#publish-results-modal").should("not.exist");

    // Check if the results are published
    cy.visit(`http://localhost:3000/vote-events/${voteEventId}/results`);
    cy.get("#results-table").should("be.visible");
    cy.visit("http://localhost:3000/vote-events");
    cy.get(`#vote-event-${voteEventId}-results-button`).should("be.visible");

    // Unpublish the results
    unPublishResults(voteEventId);

    // Check if the results are not published
    assertResultsNotPublished(voteEventId);
  });

  it("should be to limit the number of results displayed", () => {
    const limit = 1;

    // limit displayed results to 1
    cy.get("#publish-results-modal-button").click();
    cy.get("#display-limit-input").clear().type(limit);
    cy.get("#publish-results-button").click();

    // Check if only 1 row of result is displayed
    cy.visit(`http://localhost:3000/vote-events/${voteEventId}/results`);
    cy.get("tbody").find("tr").should("have.length", limit);

    // Reset the limit
    navigateToResultsTab(voteEventId);
    cy.get("#publish-results-modal-button").click();
    cy.get("#display-limit-input").clear().type("0");
    cy.get("#publish-results-button").click();
    cy.get("#publish-results-modal-button").click();
    cy.get("#display-limit-input").should("have.value", "0");
    cy.get("#publish-results-button").click();

    // Check if all results are displayed
    cy.visit(`http://localhost:3000/vote-events/${voteEventId}/results`);
    cy.get("tbody").find("tr").should("have.length", 3);

    unPublishResults(voteEventId);
  });

  it("should be able to show or hide deifferent result columns", () => {
    cy.get("#publish-results-modal-button").click();
    cy.get("#show-rank-checkbox").uncheck();
    cy.get("#show-votes-checkbox").uncheck();
    cy.get("#show-points-checkbox").check();
    cy.get("#show-percentage-checkbox").uncheck();
    cy.get("#publish-results-button").click();

    // Check if the columns are hidden
    cy.visit(`http://localhost:3000/vote-events/${voteEventId}/results`);
    cy.get("thead").find("th").should("have.length", 3);
    cy.get("thead").find("th").eq(0).should("contain", "Project ID");
    cy.get("thead").find("th").eq(1).should("contain", "Project Name");
    cy.get("thead").find("th").eq(2).should("contain", "Point");
    cy.get("tr").eq(1).find("td").should("have.length", 3);

    // Reset the columns
    navigateToResultsTab(voteEventId);
    cy.get("#publish-results-modal-button").click();
    cy.get("#show-rank-checkbox").check();
    cy.get("#show-votes-checkbox").check();
    cy.get("#show-percentage-checkbox").check();
    cy.get("#publish-results-button").click();
    cy.get("#success-alert").should("be.visible");
  });
});
