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
    cy.get("#nav-projects").click();
    cy.location("pathname").should("include", "/projects");
  });

  it("check tabs", () => {
    cy.get("#artemis-tab").should("exist");
    cy.get("#apollo-tab").should("exist");
    cy.get("#gemini-tab").should("exist");
    cy.get("#vostok-tab").should("exist");
  });

  it("check inputs", () => {
    cy.get("#project-search-input").should("exist");
    cy.get("#project-cohort-select").should("exist");
  });

  it("check viewing of project cards and scrolling", () => {
    cy.get(".project-card").should("have.length", 16);
    cy.wait(1000);
    cy.get("#project-gallery-bottom-ref").scrollIntoView({
      offset: { top: 10, left: 0 },
    });
    cy.get(".project-card").should("have.length", 26);
  });

  it("check switching of level of achievement", () => {
    cy.get(".artemis").should("have.length", 26);

    cy.get("#apollo-tab").click();
    cy.get(".apollo").should("have.length", 16);

    cy.get("#gemini-tab").click();
    cy.get(".gemini").should("have.length", 16);

    cy.get("#vostok-tab").click();
    cy.get(".vostok").should("have.length", 16);
  });

  it("check switching of cohort year", () => {
    cy.get(".2022").should("have.length", 16);

    cy.get("#project-cohort-select").click();
    cy.get("#cohort-2021-option").click();
    cy.get(".2021.project-card").should("have.length", 0);

    cy.get("#project-cohort-select").click();
    cy.get("#cohort-2022-option").click();
    cy.get(".2022.project-card").should("have.length", 16);
  });

  it("check search (simple)", () => {
    cy.get("#artemis-tab").click();
    cy.get("#project-search-input").type("senger");
    cy.get(".project-card")
      .should("have.length", 1)
      .first()
      .find(".project-name-span")
      .should("include.text", "Senger");
  });

  it("sign out", () => {
    cy.get("#nav-sign-out").click();
  });
});

export {};
