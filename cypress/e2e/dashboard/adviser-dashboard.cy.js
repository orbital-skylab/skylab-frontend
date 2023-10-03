/* eslint-disable no-undef */

describe("Testing adviser dashboard feature", () => {
  beforeEach(() => {
    cy.login("adviser@skylab.com", "Password123");
    cy.visit("http://localhost:3000/");
  });

  afterEach(() => {
    cy.get("#sign-out-button").click();
  });

  it("Views team submission as an adviser", () => {
    cy.get("#your-teams'-submissions-tab").click();
    cy.get("#view-submission-button").click();
    cy.location("pathname").should("include", "/submission");
    cy.go("back");
  });

  it("Views team as an adviser", () => {
    cy.get("#manage-your-teams-tab").click();
    cy.get("#view-team-button").click();
    cy.location("pathname").should("include", "/projects");
    cy.go("back");
  });

  it("Edit team as an adviser", () => {
    cy.get("#manage-your-teams-tab").click();
    cy.get("#edit-team-button").click();
    cy.location("pathname").should("include", "/edit");
    cy.go("back");
  });

  it("Submits deadline as an adviser", () => {
    // navigate to dashboard page
    cy.get("#nav-dashboard").click();
    cy.location("pathname").should("include", "/dashboard");

    // start a deadline
    cy.contains("td", "Evaluation 1")
      .parent()
      .find("#start-deadline-button")
      .click();
    cy.location("pathname").should("include", "submissions/");

    // fill out and submit deadline
    cy.get(".short-answer-input").first().type("dummy answer for Evaluation 1");
    cy.get("#submit-deadline-button").click();
    cy.wait(3000);
    cy.go("back");

    // check that deadline was submitted correctly and edit it
    cy.contains("td", "Evaluation 1")
      .parent()
      .find("#edit-deadline-button")
      .click();
    cy.get(".short-answer-input")
      .first()
      .should("include.text", "dummy answer for Evaluation 1");
    cy.get("").type("edited dummy answer for Evaluation 1");
    cy.get("#submit-deadline-button").click();
    cy.wait(3000);
    cy.go("back");

    // check that deadline was editted correctly
    cy.contains("td", "Evaluation 1")
      .parent()
      .find("#edit-deadline-button")
      .click();
    cy.get(".short-answer-input")
      .first()
      .should("include.text", "edited dummy answer for Evaluation 1");
    cy.go("back");

    // start a deadline draft
    cy.contains("td", "Evaluation 2")
      .parent()
      .find("#start-deadline-button")
      .click();

    // fill out and save deadline as draft
    cy.get(".short-answer-input")
      .first()
      .type("dummy draft answer for Evaluation 2");
    cy.get("#save-draft-button").click();
    cy.wait(3000);
    cy.go("back");

    // check that draft was saved
    cy.contains("td", "Evaluation 2")
      .parent()
      .find("#continue-deadline-button")
      .click();
    cy.location("pathname").should("include", "deadline/");
    cy.get(".short-answer-input")
      .first()
      .should("include.text", "dummy draft answer for");
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
    cy.get("#confirm-add-single-relation-button").click();

    // check that single evaluation relation was added
    cy.wait(5000);
    cy.get("tr").should("have.length", 1);

    // edit evaluation relation
    cy.get("tr").eq(0).find("#edit-relation-button").click();
    cy.get(".dropdown-button").eq(1).click();
    cy.get(".dropdown-option").eq(2).click();
    cy.get("#confirm-edit-relation-button").click();

    // check that evaluation relation was edited

    // delete evaluation relation
    cy.get("tr").eq(0).find("#delete-relation-button").click();
    cy.get("#confirm-delete-relation-button").click();

    // check that evaluation relation was deleted
    cy.get("tr").should("not.exist");

    // add 2-way evaluation relation
    cy.get("#manage-evaluation-relations-tab").click();
    cy.get(".multidropdown-button").click();
    cy.get(".multidropdown-option").eq(0).click();
    cy.get(".multidropdown-option").eq(1).click();
    cy.get(".multidropdown-button").click();
    cy.get("#confirm-add-group-button").click();

    // check that 2-way evaluation relation was added
    cy.wait(5000);
    cy.get("#manage-evaluation-relations-tab").click();
    cy.get("tr").should("have.length", 2);

    // add 3-way evaluation relation
    cy.get("#manage-evaluation-relations-tab").click();
    cy.get(".multidropdown-button").click();
    cy.get(".multidropdown-option").eq(2).click();
    cy.get(".multidropdown-option").eq(3).click();
    cy.get(".multidropdown-option").eq(4).click();
    cy.get(".multidropdown-button").click();
    cy.get("#confirm-add-group-button").click();

    // check that 3-way evaluation relation was added
    cy.wait(5000);
    cy.get("#manage-evaluation-relations-tab").click();
    cy.get("tr").should("have.length", 8);

    // delete all evaluation relations
    cy.get("#delete-relation-button").each(($ele) => {
      cy.wrap($ele).click();
      cy.get("#confirm-delete-relation-button").click();
    });

    // check all evaluation relations deleted
    cy.get("tr").should("not.exist");
  });
});
