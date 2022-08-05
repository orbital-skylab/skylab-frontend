/* eslint-disable no-undef */
/// <reference types="cypress" />

context("Actions", () => {
  before(() => {
    cy.visit("http://localhost:3000/");
  });

  it("sign in", () => {
    cy.get("#sign-in-email-input").type("Triston.Satterfield29@hotmail.com");
    cy.get("#sign-in-password-input").type("Password123");
    cy.get("#sign-in-button").click();
    cy.wait(3000);
  });

  it("navigate to dashboard", () => {
    cy.get("#nav-dashboard").click();
    cy.location("pathname").should("include", "/dashboard/mentor");
  });

  it("check tabs", () => {
    cy.get("#your-teams'-submissions-tab").should("exist");
    cy.get("#view-your-teams-tab").should("exist");
  });

  // view your teams' submissions

  // view your teams

  it("sign out", () => {
    cy.get("#nav-sign-out").click();
  });
});

export {};
