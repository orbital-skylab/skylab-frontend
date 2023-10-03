/* eslint-disable no-undef */

describe("Testing mentor dashboard feature", () => {
  before(() => {
    cy.login("mentor@skylab.com", "Password123");
    cy.visit("http://localhost:3000/");
  });

  after(() => {
    cy.get("#nav-sign-out").click();
  });

  it("Views teams and submissions as a mentor", () => {
    // navigate to dashboard page
    cy.get("#nav-dashboard").click();
    cy.location("pathname").should("include", "/dashboard");

    // view submission
    cy.get("#your-teams'-submissions-tab").click();
    cy.get("#view-submission-button").click();
    cy.location("pathname").should("include", "/submissions/");

    // view team
    cy.get("#view-your-teams-tab").click();
    cy.get("#view-team-button").click();
    cy.location("pathname").should("include", "/projects/");
  });
});
