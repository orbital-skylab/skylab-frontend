/* eslint-disable no-undef */

describe("Testing admin dashboard feature", () => {
  beforeEach(() => {
    cy.login("admin@skylab.com", "Password123");
  });

  it("Creates, updates and deletes evaluation relations as an admin", () => {
    // navigate to dashboard page
    cy.get("#nav-dashboard").click();
    cy.location("pathname").should("include", "/dashboard");

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
    cy.get("tr").should("have.length", 1 + 1); // +1 for header

    // edit evaluation relation
    cy.get("tr").eq(1).find("#edit-relation-button").click();
    cy.get(".dropdown-button").eq(1).click();
    cy.get(".dropdown-option").eq(2).click();
    cy.get("#confirm-edit-relation-button").click();

    // check that evaluation relation was edited

    // delete evaluation relation
    cy.get("tr").eq(1).find("#delete-relation-button").click();
    cy.get("#confirm-delete-relation-button").click();

    // check that evaluation relation was deleted
    cy.get("tr").should("not.exist");

    // add 2-way evaluation relation
    cy.get("#manage-evaluation-relations-tab").click();
    cy.get("#add-relations-group-button").click();
    cy.get(".multidropdown-button").click();
    cy.get(".multidropdown-option").eq(0).click();
    cy.get(".multidropdown-option").eq(1).click();
    cy.get(".multidropdown-button").click();
    cy.get("#confirm-add-group-button").click();

    // check that 2-way evaluation relation was added
    cy.wait(5000);
    cy.get("#manage-evaluation-relations-tab").click();
    cy.get("tr").should("have.length", 2 + 1);

    // add 3-way evaluation relation
    cy.get("#manage-evaluation-relations-tab").click();
    cy.get("#add-relations-group-button").click();
    cy.get(".multidropdown-button").click();
    cy.get(".multidropdown-option").eq(2).click();
    cy.get(".multidropdown-option").eq(3).click();
    cy.get(".multidropdown-option").eq(4).click();
    cy.get(".multidropdown-button").click();
    cy.get("#confirm-add-group-button").click();

    // check that 3-way evaluation relation was added
    cy.wait(5000);
    cy.get("#manage-evaluation-relations-tab").click();
    cy.get("tr").should("have.length", 6 + 2 + 1);

    // delete all evaluation relations
    cy.get("#delete-team-relations-button").click();
    cy.get(".dropdown-button").click();
    cy.get(".dropdown-option").eq(0).click();
    cy.get("#confirm-delete-team-relations-button").click();
    cy.wait(5000);
    cy.get("#manage-evaluation-relations-tab").click();
    cy.get("#delete-team-relations-button").click();
    cy.get(".dropdown-button").click();
    cy.get(".dropdown-option").eq(2).click();
    cy.get("#confirm-delete-team-relations-button").click();
    cy.wait(5000);
    cy.get("#manage-evaluation-relations-tab").click();
    cy.get("#delete-team-relations-button").click();
    cy.get(".dropdown-button").click();
    cy.get(".dropdown-option").eq(3).click();
    cy.get("#confirm-delete-team-relations-button").click();

    // check all evaluation relations deleted
    cy.wait(5000);
    cy.get("#manage-evaluation-relations-tab").click();
    cy.get("tr").should("not.exist");
  });
});
