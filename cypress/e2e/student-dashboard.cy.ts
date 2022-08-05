/* eslint-disable no-undef */
/// <reference types="cypress" />

context("Actions", () => {
  before(() => {
    cy.visit("http://localhost:3000/");
  });

  it("sign in", () => {
    cy.get("#sign-in-email-input").type("Rosalyn_Kerluke75@hotmail.com");
    cy.get("#sign-in-password-input").type("Password123");
    cy.get("#sign-in-button").click();
    cy.wait(3000);
  });

  it("navigate to dashboard", () => {
    cy.get("#nav-dashboard").click();
    cy.location("pathname").should("include", "/dashboard/student");
  });

  it("check tabs", () => {
    cy.get("#upcoming-deadlines-tab").should("exist");
    cy.get("#received-evaluations-tab").should("exist");
  });

  // start submission

  // continue submission

  // edit submission

  // view received evaluation

  it("sign out", () => {
    cy.get("#nav-sign-out").click();
  });
});

export {};
