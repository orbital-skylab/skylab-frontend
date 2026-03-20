/* eslint-disable no-undef */

describe("Student View Adviser's Evaluation", () => {
  beforeEach(() => {
    cy.login("student@skylab.com", "Password123");

    // Navigate to dashboard
    cy.get("#nav-dashboard").click();
    cy.location("pathname").should("include", "/dashboard");

    cy.get("#received-evaluations-tab").click({ force: true });

    cy.contains("Milestone 2 Evaluation")
      .closest(".MuiBox-root")
      .contains("tr", "Adviser")
      .find("#view-submission-button")
      .click();

    cy.location("pathname").should("include", "/submissions");
  });

  it("Should display standard text inputs as read-only", () => {
    cy.contains(
      ".paragraph-question",
      "For each of the features already implemented"
    )
      .find("textarea")
      .not('[aria-hidden="true"]')
      .should("have.attr", "readonly");
  });

  it("Should prevent toggling of multiple choice options in view mode", () => {
    // find a question and verify its currently checked answer
    cy.contains(".mcq-question", "The features are clearly specified")
      .contains("label", "Strongly Agree")
      .find("input[type='radio']")
      .should("be.checked");

    // attempt to click a different option
    cy.contains(".mcq-question", "The features are clearly specified")
      .contains("label", "Disagree")
      .click();

    // verify the state did not change
    cy.contains(".mcq-question", "The features are clearly specified")
      .contains("label", "Disagree")
      .find("input[type='radio']")
      .should("not.be.checked");

    // verify the original option still checked
    cy.contains(".mcq-question", "The features are clearly specified")
      .contains("label", "Strongly Agree")
      .find("input[type='radio']")
      .should("be.checked");
  });

  it("Should prevent modifying checkbox options in view mode", () => {
    cy.contains(".checkbox-question", "evaluate the suitability").within(() => {
      cy.contains("label", "Expert / self evaluation")
        .find("input[type='checkbox']")
        .should("be.checked");

      // attempt to click a checked option
      cy.contains("label", "Expert / self evaluation").click();

      // verify it is still checked
      cy.contains("label", "Expert / self evaluation")
        .find("input[type='checkbox']")
        .should("be.checked");

      // verify "Simulated user focus group" is unchecked
      cy.contains("label", "Simulated user focus group")
        .find("input[type='checkbox']")
        .should("not.be.checked");

      // attempt to click it
      cy.contains("label", "Simulated user focus group").click({ force: true });

      // verify it is still unchecked
      cy.contains("label", "Simulated user focus group")
        .find("input[type='checkbox']")
        .should("not.be.checked");
    });
  });

  it("Should completely hide anonymous questions and action buttons", () => {
    cy.contains("Critical feedback").should("not.exist");
    cy.contains("Overall rating for the submission").should("not.exist");

    cy.get("#save-draft-button").should("not.exist");
    cy.get("#submit-submission-button").should("not.exist");
  });
});

export {};
