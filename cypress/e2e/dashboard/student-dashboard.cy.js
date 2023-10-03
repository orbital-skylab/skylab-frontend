/* eslint-disable no-undef */

describe("Testing student dashboard feature", () => {
  beforeEach(() => {
    cy.login("student@skylab.com", "Password123");
    cy.visit("http://localhost:3000/");

    // navigate to dashboard page
    cy.get("#nav-dashboard").click();
    cy.location("pathname").should("include", "/dashboard");
  });

  afterEach(() => {
    cy.get("#sign-out-button").click();
  });

  it("Submits and edits deadline as a student", () => {
    // start a deadline
    cy.contains("td", "Milestone 2")
      .parent()
      .find("#start-deadline-button")
      .click();
    cy.location("pathname").should("include", "deadline/");

    // fill out and submit deadline
    cy.get(".short-answer-input").first().type("dummy answer for Milestone 2");
    cy.get("#submit-deadline-button").click();
    cy.wait(3000);
    cy.go("back");

    // check that deadline was submitted correctly and edit it
    cy.contains("td", "Milestone 2")
      .parent()
      .find("#edit-deadline-button")
      .click();
    cy.get(".short-answer-input")
      .first()
      .should("include.text", "dummy answer for Milestone 2")
      .type("edited dummy answer for Milestone 2");
    cy.get("#submit-deadline-button").click();
    cy.wait(3000);
    cy.go("back");

    // check that deadline was editted correctly
    cy.contains("td", "Milestone 2")
      .parent()
      .find("#edit-deadline-button")
      .click();
    cy.get(".short-answer-input")
      .first()
      .should("include.text", "edited dummy answer for Milestone 2");
    cy.go("back");

    // start a deadline draft
    cy.contains("td", "Milestone 3")
      .parent()
      .find("#start-deadline-button")
      .click();

    // fill out and save deadline as draft
    cy.get(".short-answer-input")
      .first()
      .type("dummy draft answer for Milestone 3");
    cy.get("#save-draft-button").click();
    cy.wait(3000);
    cy.go("back");

    // check that draft was saved
    cy.contains("td", "Milestone 3")
      .parent()
      .find("#continue-deadline-button")
      .click();
    cy.location("pathname").should("include", "deadline/");
    cy.get("").should("include.text", "dummy draft answer for Milestone 3");
  });

  it("Views evaluations as a student", () => {
    cy.get("#received-evaluations-tab").click();
    cy.get(".view-evaluation-button").first().click();
    cy.location("pathname").should("include", "submissions/");

    cy.go("back");
    cy.get(".view-anonymous-answers").first().click();
    cy.location("pathname").should("include", "submissions/student/");
  });
});
