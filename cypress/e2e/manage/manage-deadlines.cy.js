/* eslint-disable no-undef */

describe("Testing deadlines management feature", () => {
  beforeEach(() => {
    cy.login("admin@skylab.com", "Password123");
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
    cy.get("#deadline-name-input")
      .clear()
      .type(`Splashup ${new Date().getFullYear()}`);
    cy.get("#submit-deadline-button").click();

    // check deadline created
    cy.scrollTo("bottom");
    cy.contains("td", `Splashup ${new Date().getFullYear()}`).should("exist");

    // edit deadline
    cy.contains("td", `Splashup ${new Date().getFullYear()}`)
      .parent()
      .find("#edit-deadline-button")
      .click();
    cy.get("#edit-deadline-name-input")
      .clear()
      .type(`Splashdown ${new Date().getFullYear()}`);
    cy.get("#confirm-edit-deadline-button").click();

    // check deadline edited
    cy.scrollTo("bottom");
    cy.contains("td", `Splashup ${new Date().getFullYear()}`).should(
      "not.exist"
    );
    cy.contains("td", `Splashdown ${new Date().getFullYear()}`).should("exist");

    // edit deadline questions
    cy.contains("td", `Splashdown ${new Date().getFullYear()}`)
      .parent()
      .find("#view-questions-button")
      .click();
    cy.location("pathname").should("contain", "deadlines/");

    cy.get(".question-input input")
      .first()
      .clear()
      .type(`dummy question for Splashdown ${new Date().getFullYear()}`);
    cy.get(".question-type-select").first().click();
    cy.get("[data-value=ShortAnswer]").click({ force: true });
    cy.scrollTo("bottom");
    cy.get("#save-deadline-questions-button").click();
    cy.wait(1000);
    cy.scrollTo("top");
    cy.get("#go-back-button").click();

    // check deadline questions edited
    cy.scrollTo("bottom");
    cy.contains("td", `Splashdown ${new Date().getFullYear()}`)
      .parent()
      .find("#view-questions-button")
      .click();
    cy.get(".question-input input")
      .first()
      .should(
        "have.value",
        `dummy question for Splashdown ${new Date().getFullYear()}`
      );
    cy.scrollTo("top");
    cy.get("#go-back-button").click();

    // delete deadline question

    // check deadline question deleted

    // delete deadline
    cy.contains("td", `Splashdown ${new Date().getFullYear()}`)
      .parent()
      .find("#delete-deadline-button")
      .click();
    cy.get("#delete-deadline-confirm-button");

    // check deadline deleted
    cy.contains("td", `Splashdown ${new Date().getFullYear()}`).should(
      "not.exist"
    );
  });
});
