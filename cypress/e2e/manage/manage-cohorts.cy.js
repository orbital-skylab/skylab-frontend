/* eslint-disable no-undef */

describe("Testing cohort management feature", () => {
  beforeEach(() => {
    cy.login("admin@skylab.com", "Password123");
    cy.visit("http://localhost:3000/");
  });

  after(() => {
    cy.get("#nav-sign-out").click();
  });

  it("Creates, updates and deletes cohorts as an admin", () => {
    // navigate to manage page
    cy.get("#nav-manage").click();
    cy.location("pathname").should("include", "/manage");

    // navigate to manage cohorts page
    cy.get("#manage-cohorts-card").click();
    cy.location("pathname").should("include", "/cohorts");

    // create cohort
    cy.get("#add-cohort-button").click();
    cy.get("#add-cohort-academic-year-input").type(
      `${new Date().getFullYear() + 1}`
    );
    cy.get("#add-cohort-submit-button").click();

    // check cohort created
    cy.contains("td", `${new Date().getFullYear() + 1}`).should.exist();

    // edit cohort
    cy.contains("td", `${new Date().getFullYear() + 1}`)
      .parent()
      .find(".edit-cohort-button");
    cy.get("#edit-cohort-start-date-input").type("02");
    cy.get("#confirm-edit-cohort-button").click();

    // check cohort edited
    cy.contains("td", `1/1/${new Date().getFullYear() + 1}`).should(
      "not.exist"
    );
    cy.contains("td", `2/1/${new Date().getFullYear() + 1}`).should("exist");

    // delete cohort
    cy.contains("td", `${new Date().getFullYear() + 1}`)
      .parent()
      .find(".delete-cohort-button");
    cy.get("#confirm-delete-cohort-button").click();

    // check cohort deleted
    cy.contains("td", `${new Date().getFullYear() + 1}`).should("not.exist");
  });
});
