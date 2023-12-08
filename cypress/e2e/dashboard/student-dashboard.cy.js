/* eslint-disable no-undef */

describe("Testing student dashboard feature", () => {
  beforeEach(() => {
    cy.login("student@skylab.com", "Password123");

    // navigate to dashboard page
    cy.get("#nav-dashboard").click();
    cy.location("pathname").should("include", "/dashboard");
  });

  afterEach(() => {
    cy.get("#nav-sign-out").click();
  });

  it("Submits and edits deadline as a student", () => {
    // start a deadline
    cy.contains("td", "Milestone 3")
      .parent()
      .find("#start-deadline-button")
      .click();
    cy.location("pathname").should("include", "submissions/");

    // fill out questions and save draft
    cy.get(".short-answer-input").first().type("dummy answer for Milestone 3");
    cy.get("#save-draft-button").click();
    cy.wait(1000);
    cy.go("back");

    // check that draft was saved correctly and edit it
    cy.contains("td", "Milestone 3")
      .parent()
      .find("#continue-deadline-button")
      .click();
    cy.get(".short-answer-input input")
      .first()
      .should("have.value", "dummy answer for Milestone 3")
      .clear()
      .type("edited dummy answer for Milestone 3");
    cy.get("#submit-submission-button").click();
    cy.wait(3000);
    cy.go("back");

    // check that deadline was editted correctly
    cy.contains("td", "Milestone 3")
      .parent()
      .find("#edit-deadline-button")
      .click();
    cy.get(".short-answer-input input")
      .first()
      .should("have.value", "edited dummy answer for Milestone 3");
    cy.go("back");
  });

  it("Views evaluations as a student", () => {
    cy.get("#received-evaluations-tab").click();
    cy.get("#view-submission-button:not([aria-disabled='true'])")
      .first()
      .click();
    cy.location("pathname").should("include", "submissions/");
    cy.get(".short-answer-input input")
      .first()
      .should("have.value", "dummy answer for Evaluation 1");
    cy.get("#go-back-button").click();
  });

  it("Views anonymous answers as a student", () => {
    cy.get("#received-evaluations-tab").click();
    cy.get(".view-anonymous-answers").first().click();
    // TODO: seed anonymous answers and test
    cy.location("pathname").should("include", "submissions/student/");
    cy.get("#go-back-button").click();
    cy.location("pathname").should("include", "dashboard/student");
    cy.location("pathname").should("not.include", "submissions");
  });
});
