/* eslint-disable no-undef */

describe("Testing adviser dashboard feature", () => {
  beforeEach(() => {
    cy.login("adviser@skylab.com", "Password123");

    // navigate to dashboard page
    cy.get("#nav-dashboard").click();
    cy.location("pathname").should("include", "/dashboard");
  });

  afterEach(() => {
    cy.get("#nav-sign-out").click();
  });

  it("Views and edits teams as an adviser", () => {
    // view submission
    cy.get("#your-teams\\'-submissions-tab").click();
    cy.get("#view-submission-button:not([aria-disabled='true'])")
      .first()
      .click();
    cy.location("pathname").should("include", "/submission");
    cy.go("back");

    // view team
    cy.get("#manage-your-teams-tab").click();
    cy.get("#view-team-button").click();
    cy.location("pathname").should("include", "/projects");
    cy.go("back");

    // edit team
    cy.get("#manage-your-teams-tab").click();
    cy.get("#edit-team-button").click();
    cy.location("pathname").should("include", "/edit");
    cy.go("back");
  });

  it("Submits and edits deadline as an adviser", () => {
    // start a deadline
    cy.get("#start-deadline-button:not([disabled])").first().click();
    cy.location("pathname").should("include", "submissions/");

    // fill out deadline questions and save as draft
    cy.get(".short-answer-input").first().type("dummy answer for Evaluation 2");
    cy.get("#save-draft-button").click();
    cy.wait(3000);
    cy.go("back");

    // check that draft was saved correctly and edit it
    cy.get("#continue-deadline-button:not([disabled])").first().click();
    cy.get(".short-answer-input input")
      .first()
      .should("have.value", "dummy answer for Evaluation 2");
    cy.get(".short-answer-input input")
      .first()
      .clear()
      .type("edited dummy answer for Evaluation 2");
    cy.get("#submit-submission-button").click();
    cy.wait(3000);
    cy.go("back");

    // check that deadline was editted correctly
    cy.get("#edit-deadline-button:not([disabled])").eq(1).click();
    cy.get(".short-answer-input input")
      .first()
      .should("have.value", "edited dummy answer for Evaluation 2");
    cy.go("back");
  });

  it("Creates, updates and deletes evaluation relations as an adviser", () => {
    // add single evaluation relation
    cy.get("#manage-evaluation-relations-tab").click();
    cy.get("#add-single-relation-button").click();
    cy.get(".dropdown-button").eq(0).click();
    cy.get(".dropdown-option").eq(0).click();
    cy.get(".dropdown-button").eq(1).click();
    cy.get(".dropdown-option").eq(1).click();
    cy.get("#confirm-add-relation-button").click();

    // check that single evaluation relation was added
    cy.wait(5000);
    cy.get("#manage-evaluation-relations-tab").click();
    cy.get("tr").should("have.length", 1 + 1);

    // edit evaluation relation
    cy.get("tr").eq(1).find("#edit-relation-button").click();
    cy.get(".dropdown-button").eq(0).click();
    cy.get(".dropdown-option").eq(1).click();
    cy.get(".dropdown-button").eq(1).click();
    cy.get(".dropdown-option").eq(0).click();
    cy.get("#confirm-edit-relation-button").click();

    // check that evaluation relation was edited
    cy.wait(5000);
    cy.get("#manage-evaluation-relations-tab").click();
    cy.get("tr").should("have.length", 1 + 1); // TODO: need better condition

    // delete evaluation relation
    cy.get("tr").eq(1).find("#delete-relation-button").click();
    cy.get("#confirm-delete-relation-button").click();

    // check that evaluation relation was deleted
    cy.wait(5000);
    cy.get("#manage-evaluation-relations-tab").click();
    cy.get("tr").should("not.exist");

    // add 2-way evaluation relation
    cy.get("#add-relations-group-button").click();
    cy.get(".multidropdown-button").click();
    cy.get(".multidropdown-option").eq(0).click();
    cy.get(".multidropdown-option").eq(1).click();
    cy.get(".multidropdown-button").click();
    cy.get("#confirm-add-group-button").click();

    // check that 2-way evaluation relation was added
    cy.wait(5000);
    cy.get("#manage-evaluation-relations-tab").click();
    cy.get("tr").should("have.length", 2 + 1); // + 1 for header

    // delete all evaluation relations
    cy.get("#delete-team-relations-button").click();
    cy.get(".dropdown-button").click();
    cy.get(".dropdown-option").eq(0).click();
    cy.get("#confirm-delete-team-relations-button").click();

    // check all evaluation relations deleted
    cy.wait(5000);
    cy.get("#manage-evaluation-relations-tab").click();
    cy.get("tr").should("not.exist");
  });
});
