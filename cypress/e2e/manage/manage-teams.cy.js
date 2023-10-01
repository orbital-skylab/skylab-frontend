/* eslint-disable no-undef */

describe("Testing teams management feature", () => {
  beforeEach(() => {
    cy.login("admin@skylab.com", "Password123");
    cy.visit("http://localhost:3000/");
  });

  it("Creates, updates and deletes teams as an admin", () => {
    // navigate to manage page
    cy.get("#nav-manage").click();
    cy.location("pathname").should("include", "/manage");

    // navigate to manage teams page
    cy.get("#manage-teams-card").click();
    cy.location("pathname").should("include", "/projects");

    // create team with team-less students

    // check team created

    // edit team

    // check team edited

    // delete team

    // check team deleted
  });
});
