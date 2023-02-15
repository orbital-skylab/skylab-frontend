/* eslint-disable no-undef */
/// <reference types="cypress" />

context("Actions", () => {
  before(() => {
    cy.visit("http://localhost:3000/");
  });

  it("sign in", () => {
    cy.get("#sign-in-email-input").type("admin@skylab.com");
    cy.get("#sign-in-password-input").type("Password123");
    cy.get("#sign-in-button").click();
    // cy.wait(3000);
  });

  it("navigate to dashboard", () => {
    cy.get("#nav-staff").click();
    cy.location("pathname").should("include", "/staff");
  });

  it("check tabs", () => {
    cy.get("#mentors-tab").should("exist");
    cy.get("#advisers-tab").should("exist");
  });

  it("check inputs", () => {
    cy.get("#staff-search-input").should("exist");
    cy.get("#staff-cohort-select").should("exist");
  });

  it("check viewing of staff cards", () => {
    cy.get(".staff-card").should("have.length", 100);
  });

  it("check switching of staff category", () => {
    cy.get(".mentor").should("have.length", 100);

    cy.get("#advisers-tab").click();
    cy.get(".adviser").should("have.length", 100);
  });

  it("check switching of cohort year", () => {
    cy.get("#staff-cohort-select").click();
    cy.get("#staff-2021-option").click();
    cy.get(".2021.staff-card").should("have.length", 0);

    cy.get("#staff-cohort-select").click();
    cy.get("#staff-2022-option").click();
    cy.get(".2022.staff-card").should("have.length", 100);
  });

  it("check search (simple)", () => {
    cy.get("#staff-search-input").type("coleman");
    cy.get(".staff-card")
      .should("have.length", 1)
      .first()
      .find(".staff-name-span")
      .should("include.text", "Coleman");
  });

  it("sign out", () => {
    cy.get("#nav-sign-out").click();
  });
});

export {};
