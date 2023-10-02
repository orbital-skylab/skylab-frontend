/* eslint-disable no-undef */

describe("Testing teams management feature", () => {
  beforeEach(() => {
    cy.login("admin@skylab.com", "Password123");
    cy.visit("http://localhost:3000/");
  });

  after(() => {
    cy.get("#sign-out-button").click();
  });

  it("Creates, updates and deletes teams as an admin", () => {
    // navigate to manage page
    cy.get("#nav-manage").click();
    cy.location("pathname").should("include", "/manage");

    // navigate to manage teams page
    cy.get("#manage-teams-card").click();
    cy.location("pathname").should("include", "/projects");

    // view team
    cy.get(".view-project-button").first().click();
    cy.location("pathname").should("include", "projects/");
    cy.go("back");

    // create team with team-less students
    cy.get("#add-project-button").click();
    cy.get("#add-project-name-input").type("New Project");
    cy.get("#add-project-team-name-input").type("New Team");
    cy.get(".add-project-student-dropdown").click();
    cy.get(".multidropdown-option").then(($elements) => {
      const numOptions = $elements.length;
      cy.wrap($elements)
        .eq(numOptions - 2)
        .click();
      cy.wrap($elements)
        .eq(numOptions - 1)
        .click();
    });
    cy.get(".add-project-student-dropdown").click();
    cy.get("#add-project-submit-button").click();

    // check team created
    cy.get("#project-search-input").type("New Team");
    cy.contains("td", "New Team").should("exist");
    cy.contains("td", "New Project").should("exist");

    // edit team
    cy.contains("td", "New Team").parent().find(".edit-project-button").click();
    cy.location("pathname").should("include", "/edit");
    cy.get("#edit-project-name-input").type("Newer Project");
    cy.get("#edit-team-name-input").type("Newer Team");
    cy.get("#confirm-edit-project-button").click();
    cy.go("back");

    // check team edited
    cy.get("#project-search-input").type("Newer Team");
    cy.contains("td", "Newer Team").should("exist");
    cy.get("#project-search-input").type("New Team");
    cy.contains("td", "New Team").should("not.exist");

    // delete team
    cy.contains("td", "Newer Team")
      .parent()
      .find(".delete-project-button")
      .click();
    cy.get("#delete-project-submit-button").click();

    // check team deleted
    cy.get("#project-search-input").type("Newer Team");
    cy.contains("td", "Newer Team").should("not.exist");
  });
});
