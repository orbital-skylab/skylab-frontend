/* eslint-disable no-undef */
/// <reference types="cypress" />

context("Actions", () => {
  before(() => {
    cy.login("admin@skylab.com", "Password123").then(() => {
      expect(window.localStorage.getItem("token")?.length ?? 0).to.greaterThan(
        0
      );
    });
  });
});

export {};
