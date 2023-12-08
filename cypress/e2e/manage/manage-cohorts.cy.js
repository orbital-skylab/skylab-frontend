/* eslint-disable no-undef */

describe("Testing cohort management feature", () => {
  beforeEach(() => {
    cy.login("admin@skylab.com", "Password123");
  });

  afterEach(() => {
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
    cy.get("#add-cohort-academic-year-input")
      .clear()
      .type(`${new Date().getFullYear() + 2}`);
    cy.get("#add-cohort-submit-button").click();

    // check cohort created
    cy.contains("td", `${new Date().getFullYear() + 2}`).should("exist");

    // edit cohort
    cy.contains("td", `${new Date().getFullYear() + 2}`)
      .parent()
      .find(".edit-cohort-button")
      .click();
    cy.get("#edit-cohort-start-date-input").type(
      `${new Date().getFullYear() + 2}-01-02T08:00`
    );
    cy.get("#edit-cohort-end-date-input").type(
      `${new Date().getFullYear() + 2}-01-03T08:00`
    );
    cy.get("#confirm-edit-cohort-button").click();

    // check cohort edited
    cy.contains("td", `01/01/${new Date().getFullYear() + 2}`).should(
      "not.exist"
    );
    cy.contains("td", `02/01/${new Date().getFullYear() + 2}`).should("exist");

    // delete cohort
    cy.contains("td", `${new Date().getFullYear() + 2}`)
      .parent()
      .find(".delete-cohort-button")
      .click();
    cy.get("#confirm-delete-cohort-button").click();

    // check cohort deleted
    cy.contains("td", `${new Date().getFullYear() + 2}`).should("not.exist");
  });
});
