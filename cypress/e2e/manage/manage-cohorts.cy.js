/* eslint-disable no-undef */

describe("Testing cohort management feature", () => {
  beforeEach(() => {
    cy.login("admin@skylab.com", "Password123");
    cy.visit("http://localhost:3000/");
  });

  it("Creates, updates and deletes cohorts as an admin", () => {
    // navigate to manage page
    cy.get("#nav-manage").click();
    cy.location("pathname").should("include", "/manage");

    // navigate to manage cohorts page
    cy.get("#manage-cohorts-card").click();
    cy.location("pathname").should("include", "/cohorts");

    // create cohort

    // check cohort created

    // edit cohort

    // check cohort edited

    // delete cohort

    // check cohort deleted
  });
});
