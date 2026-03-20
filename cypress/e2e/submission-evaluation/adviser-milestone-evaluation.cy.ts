/* eslint-disable no-undef */

describe("Adviser Evaluation Submission", { scrollBehavior: "center" }, () => {
  beforeEach(() => {
    cy.login("adviser@skylab.com", "Password123");

    // Navigate to dashboard
    cy.get("#nav-dashboard").click();
    cy.location("pathname").should("include", "/dashboard");

    cy.get("tr")
      .filter(':contains("Milestone 2 Evaluation")')
      .find('[id$="-deadline-button"]')
      .not(":disabled")
      .first()
      .click();
    cy.location("pathname").should("include", "/submissions");
  });

  it("Should correctly render the form and display Anonymous indicators", () => {
    // Verify anonymous chips rendered on private questions
    cy.contains(".paragraph-question", "Critical feedback")
      .contains("Anonymous")
      .should("be.visible");

    cy.contains(".mcq-question", "Overall rating for the submission")
      .contains("Anonymous")
      .should("be.visible");
  });

  it("Should allow adviser to save a draft", () => {
    cy.contains(
      ".paragraph-question",
      "For each of the features already implemented"
    )
      .find("textarea")
      .not('[aria-hidden="true"]')
      .clear()
      .type(
        "Feature 1: The team has done a satisfactory job implementing this feature."
      );

    cy.contains(".mcq-question", "The features are clearly specified")
      .contains("label", "Agree")
      .click();

    cy.contains(
      ".checkbox-question",
      "methods did the team use to evaluate the suitability"
    ).within(() => {
      cy.contains("label", "Expert / self evaluation").click();
      cy.contains("label", "Actual user focus group").click();
    });

    cy.get("#save-draft-button").click();
    cy.contains("Successfully saved draft").should("be.visible");

    cy.get("#go-back-button").click();
    cy.get("tr")
      .filter(':contains("Milestone 2 Evaluation")')
      .filter(':contains("Saved Draft")')
      .should("exist");
  });

  it("3. Should successfully submit a fully completed evaluation", () => {
    // Section 1
    cy.contains(
      ".paragraph-question",
      "For each of the features already implemented"
    )
      .find("textarea")
      .not('[aria-hidden="true"]')
      .clear()
      .type("All features are acceptable.");

    // Section 2
    cy.contains(".mcq-question", "The features are clearly specified")
      .contains("label", "Strongly Agree")
      .click();
    cy.contains(".paragraph-question", "Please give written feedback")
      .find("textarea")
      .not('[aria-hidden="true"]')
      .clear()
      .type("Great planning for M3.");

    // Section 3
    cy.contains(".mcq-question", "For a novice, the project's usability is")
      .contains("label", "Adequate for most novices.")
      .click();
    cy.contains(".mcq-question", "For an expert, the project's usability is")
      .contains("label", "Adequate. An expert would be comfortable")
      .click();
    cy.contains(".mcq-question", "The project's memorability is")
      .contains("label", "Excellent. The system is easy to use")
      .click();
    cy.contains(".mcq-question", "The system's utility is")
      .contains("label", "Excellent. Almost all users")
      .click();

    // Checkboxes
    cy.contains(".checkbox-question", "evaluate the suitability").within(() => {
      cy.contains("label", "Cognitive walkthrough").click();
    });
    cy.contains(".checkbox-question", "evaluate the correctness").within(() => {
      cy.contains("label", "Integration Testing").click();
      cy.contains("label", "System Testing").click();
    });

    cy.contains(".mcq-question", "What do you think about the test cases")
      .contains("label", "There are plenty of good")
      .click();
    cy.contains(".paragraph-question", "better and more comprehensive testing")
      .find("textarea")
      .not('[aria-hidden="true"]')
      .clear()
      .type("Implement CI/CD pipelines.");

    // Section 4
    cy.contains(".mcq-question", "understanding of the project")
      .contains("label", "I have a clear idea")
      .click();
    cy.contains(".mcq-question", "rate their quality")
      .contains("label", "Excellent! Complete and well-prepared.")
      .click();
    cy.contains(".mcq-question", "regarding the technologies")
      .contains("label", "Good idea of technologies")
      .click();
    cy.contains(".mcq-question", "with respect to the prototype")
      .contains("label", "Prototype available for testing and works well")
      .click();
    cy.contains(".mcq-question", "evidence of good software engineering")
      .contains("label", "There is strong evidence")
      .click();
    cy.contains(".paragraph-question", "point out any problems")
      .find("textarea")
      .not('[aria-hidden="true"]')
      .clear()
      .type("No major problems found.");
    cy.contains(".mcq-question", "understand the time investment")
      .contains("label", "Good idea of time and tasks.")
      .click();

    // Section 5 & 6
    cy.contains(".paragraph-question", "Critical feedback (anonymous)")
      .find("textarea")
      .not('[aria-hidden="true"]')
      .clear()
      .type("Ensure you maintain this velocity.");
    cy.contains(".mcq-question", "Overall rating for the submission")
      .contains("label", "5 out of 5 stars. Definitely good enough for Artemis")
      .click();

    // Submit
    cy.get("#submit-submission-button").click();

    cy.get("#submit-submission-button").should("not.be.disabled");
    cy.contains("Successfully submitted").should("be.visible");

    // Go back and verify
    cy.get("#go-back-button").click();
    cy.get("tr")
      .filter(':contains("Milestone 2 Evaluation")')
      .filter(':contains("Submitted on")')
      .should("exist");
  });
});

export {};
