/* eslint-disable no-undef */

describe("Testing mentor dashboard feature", () => {
  beforeEach(() => {
    cy.login("student@skylab.com", "Password123");
    cy.visit("http://localhost:3000/");
  });

  it("Submits deadline as a mentor", () => {
    // navigate to dashboard page
    cy.get("#nav-dashboard").click();
    cy.location("pathname").should("include", "/dashboard");

    // start a deadline
    cy.contains("td", "").parent().find("#start-deadline-button").click();
    cy.location("pathname").should("include", "deadline");

    // fill out and submit deadline
    cy.get("").type("dummy answer for");
    cy.get("#submit-deadline-button").click();
    cy.wait(3000);
    cy.go("back");

    // check that deadline was submitted correctly and edit it
    cy.contains("td", "Milestone 2")
      .parent()
      .find("#edit-deadline-button")
      .click();
    cy.get("").should("include.text", "dummy answer for");
    cy.get("").type("edited dummy answer for");
    cy.get("#submit-deadline-button").click();
    cy.wait(3000);
    cy.go("back");

    // check that deadline was editted correctly
    cy.contains("td", "").parent().find("#edit-deadline-button").click();
    cy.get("").should("include.text", "edited dummy answer for");
    cy.go("back");

    // start a deadline draft
    cy.contains("td", "").parent().find("#start-deadline-button").click();
    cy.location("pathname").should("include", "deadline");

    // fill out and save deadline as draft
    cy.get("").type("dummy draft answer for");
    cy.get("#save-draft-button").click();
    cy.wait(3000);
    cy.go("back");

    // check that draft was saved
    cy.contains("td", "").parent().find("#continue-deadline-button").click();
    cy.location("pathname").should("include", "deadline");
    cy.get("").should("include.text", "dummy draft answer for");
  });
});
