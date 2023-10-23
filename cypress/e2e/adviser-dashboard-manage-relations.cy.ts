/* eslint-disable no-undef */
/// <reference types="cypress" />

context("Actions", () => {
  before(() => {
    cy.visit("http://localhost:3000/");
  });

  it("sign in", () => {
    cy.get("#sign-in-email-input").type("adviser@skylab.com");
    cy.get("#sign-in-password-input").type("Password123");
    cy.get("#sign-in-button").click();
    cy.wait(3000);
  });

  it("navigate to dashboard manage evaluation relations tabs", () => {
    cy.get("#nav-dashboard").click();
    cy.location("pathname").should("include", "/dashboard/adviser");
    cy.get("#manage-evaluation-relations-tab").click();
  });

  it("create evaluation relations automatically", () => {
    cy.get("#create-automatically-button").click();
    cy.contains("p", "Relations that will be created (45)").should("exist");
    cy.get("#add-relations-button").click();
    cy.contains(
      "p",
      "All your teams satisfy the requirements of having 3 evaluatees and 3 evaluators"
    ).should("exist");
    cy.get("tbody").children().should("have.length", 15);
  });

  it("can delete selected relations", () => {
    cy.get("#view-by-relations-tab").click();
    cy.get("#0-checkbox").click();
    cy.get("#1-checkbox").click();
    cy.get("#2-checkbox").click();
    cy.get("#delete-selected-relations-button").click();
    cy.contains("p", "Relations that will be deleted (3)").should("exist");
    cy.get("#confirm-delete-selected-relations-button").click();
  });

  it("delete all relations", () => {
    cy.get("#view-by-relations-tab").click();
    // Double click to unselect all then select all
    cy.get("#select-all-relations-checkbox").click();
    cy.get("#select-all-relations-checkbox").click();
    cy.get("#delete-selected-relations-button").click();
    cy.contains("p", "Relations that will be deleted (42)").should("exist");
    cy.get("#confirm-delete-selected-relations-button").click();
    cy.contains("p", "Choose how you want to create your relations").should(
      "exist"
    );
  });

  it("sign out", () => {
    cy.get("#nav-sign-out").click();
  });
});

export {};
