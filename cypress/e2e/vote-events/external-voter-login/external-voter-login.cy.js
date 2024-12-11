/* eslint-disable no-undef */

describe("Testing external voter login", () => {
  it("Should be able to login with valid voter id", () => {
    cy.visit("http://localhost:3000/");
    cy.get("#sign-in-toggle").click();

    cy.get("#sign-in-voter-id-input").type("externalId123");
    cy.get("#sign-in-button").click();

    cy.get("#success-alert").should("be.visible");
    cy.contains("Vote events").should("be.visible");
    cy.get("#nav-sign-out").should("be.visible");
  });

  it("Should be able to logout", () => {
    cy.get("#nav-sign-out").click();
    cy.get("#sign-in-toggle").should("be.visible");
  });
});
