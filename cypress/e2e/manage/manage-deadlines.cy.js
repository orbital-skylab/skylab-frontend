/* eslint-disable no-undef */

describe("Testing deadlines management feature", () => {
  beforeEach(() => {
    cy.login("admin@skylab.com", "Password123");
    cy.visit("http://localhost:3000/");
  });

  after(() => {
    cy.get("#nav-sign-out").click();
  });

  it("Creates, updates and deletes deadlines as an admin", () => {
    // navigate to manage page
    cy.get("#nav-manage").click();
    cy.location("pathname").should("include", "/manage");

    // navigate to manage deadlines page
    cy.get("#manage-deadlines-card").click();
    cy.location("pathname").should("include", "/deadlines");

    // create deadline
    cy.get("#add-deadline-button").click();
    cy.get("#deadline-name-input").type(`Splashup ${new Date().getFullYear()}`);
    cy.get("#submit-deadline-button").click();

    // check deadline created
    cy.get("td", `Splashup ${new Date().getFullYear()}`).should("exist");

    // edit deadline
    cy.get("td", `Splashup ${new Date().getFullYear()}`)
      .parent()
      .find("#edit-deadline-button");
    cy.get("#deadline-name-input").type(
      `Splashdown ${new Date().getFullYear()}`
    );
    cy.get("#confirm-edit-deadline-button").click();

    // check deadline edited
    cy.get("td", `Splashup ${new Date().getFullYear()}`).should("not.exist");
    cy.get("td", `Splashdown ${new Date().getFullYear()}`).should("exist");

    // edit deadline questions
    cy.get("td", `Splashdown ${new Date().getFullYear()}`)
      .parent()
      .find("#view-questions-button");
    cy.location("pathname").should("contain", "deadlines/");

    cy.get(".question-input")
      .first()
      .find("input")
      .type(`dummy question for Splashdown ${new Date().getFullYear()}`);
    cy.get(".question-type-select").first().click();
    cy.get("[data-value=ShortAnswer]").click({ force: true });
    cy.get("#save-deadline-questions-button").click();
    cy.wait(2000);
    cy.go("back");

    // check deadline questions edited
    cy.get("td", `Splashdown ${new Date().getFullYear()}`)
      .parent()
      .find("#view-questions-button");
    cy.contains(
      ".question-input",
      `dummy question for Splashdown ${new Date().getFullYear()}`
    ).should("exist");
    cy.go("back");

    // delete deadline
    cy.get("td", `Splashdown ${new Date().getFullYear()}`)
      .parent()
      .find("#delete-deadline-button");
    cy.get("#delete-deadline-confirm-button");

    // check deadline deleted
    cy.get("td", `Splashdown ${new Date().getFullYear()}`).should("not.exist");
  });
});
