/* eslint-disable no-undef */
/// <reference types="cypress" />

// TODO: find workaround for datetime inputs, then add suite for edit cohort

context("Actions", () => {
  before(() => {
    cy.visit("http://localhost:3000/");
  });

  it("sign in", () => {
    cy.get("#sign-in-email-input").type("admin@skylab.com");
    cy.get("#sign-in-password-input").type("Password123");
    cy.get("#sign-in-button").click();
    cy.wait(3000);
  });

  it("navigate to manage cohorts page", () => {
    cy.get("#nav-manage").click();
    cy.location("pathname").should("include", "manage");
    cy.get("#manage-cohorts-card").click();
    cy.location("pathname").should("include", "manage/cohorts");
  });

  it("add cohort", () => {
    cy.get("#add-cohort-button").click();
    cy.get("#add-cohort-academic-year-input").type("2030");
    cy.get("#add-cohort-submit-button").click();
  });

  it("check newly added cohort", () => {
    cy.contains(".cohort-academic-year-td", 2030).should("exist");
  });

  // edit cohort

  it("delete cohort", () => {
    cy.contains(".cohort-academic-year-td", 2030)
      .parent()
      .find(".delete-cohort-button")
      .click();

    cy.contains(".cohort-academic-year-td", 2030).should("not.exist");
  });

  it("sign out", () => {
    cy.get("#nav-sign-out").click();
    cy.get("#nav-manage").should("not.exist");
  });
});

export {};
