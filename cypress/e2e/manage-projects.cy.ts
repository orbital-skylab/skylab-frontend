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

  it("navigate to manage projects page", () => {
    cy.get("#nav-manage").click();
    cy.location("pathname").should("include", "manage");
    cy.get("#manage-projects-card").click();
    cy.location("pathname").should("include", "manage/projects");
  });

  it("add project", { scrollBehavior: false }, () => {
    cy.get("#add-project-button").click();

    cy.get("#add-project-name-input").type("test project");
    cy.get("#add-project-team-name-input").type("test team");

    cy.get(".add-project-student-dropdown").click();
    cy.get(".multidropdown-option").first().click();
    cy.get(".multidropdown-option").eq(1).click();
    cy.get(".multidropdown-button").click();

    cy.get(".add-project-adviser-dropdown").click();
    cy.get(".dropdown-option").first().click();

    cy.get("#add-project-submit-button").click();
  });

  it("check added project", () => {
    cy.get("#project-search-input").type("test project");
    cy.wait(3000);
    cy.contains(".project-name-td", "test project").should("exist");
  });

  it("delete project", () => {
    cy.contains(".project-name-td", "test project")
      .parent()
      .find(".delete-project-button")
      .click();
    cy.get("#delete-project-submit-button").click();
  });

  it("sign out", () => {
    cy.get("#nav-sign-out").click();
    cy.get("#nav-manage").should("not.exist");
  });
});

export {};
