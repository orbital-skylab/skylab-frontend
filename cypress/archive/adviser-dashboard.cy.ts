/* eslint-disable no-undef */
/// <reference types="cypress" />

context("Actions", () => {
  before(() => {
    cy.visit("http://localhost:3000/");
  });

  it("sign in", () => {
    cy.get("#sign-in-email-input").type("Coleman_Reichert@hotmail.com");
    cy.get("#sign-in-password-input").type("Password123");
    cy.get("#sign-in-button").click();
    cy.wait(3000);
  });

  it("navigate to dashboard", () => {
    cy.get("#nav-dashboard").click();
    cy.location("pathname").should("include", "/dashboard/adviser");
  });

  it("check tabs", () => {
    cy.get("#upcoming-deadlines-tab").should("exist");
    cy.get("#your-teams'-submissions-tab").should("exist");
    cy.get("#manage-your-teams-tab").should("exist");
    cy.get("#manage-evaluation-relations-tab").should("exist");
  });

  // start submission

  // continue submission

  // edit submission

  // view your teams' submission

  // view your team

  // edit your team

  // edit eval rs

  // delete eval rs

  it("sign out", () => {
    cy.get("#nav-sign-out").click();
  });
});

export {};
