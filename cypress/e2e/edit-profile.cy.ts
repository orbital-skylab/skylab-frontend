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
    cy.wait(3000);
  });

  it("navigate to profile page", () => {
    cy.get("#nav-profile").click();
    cy.location("pathname").should("include", "users/");
  });

  it("edit profile", () => {
    cy.get("#edit-profile-button").click();
    cy.location("pathname").should("include", "edit");
  });

  it("update name", () => {
    cy.get("#edit-name-input").type("Admin Name");
  });

  it("update profile picture", () => {
    cy.get("#edit-profile-picture-input").type(
      "https://loremflickr.com/640/480"
    );
  });

  it("update github", () => {
    cy.get("#edit-github-input").type("https://frozen-page.biz");
  });

  it("update linkedin", () => {
    cy.get("#edit-linkedin-input").type("http://incredible-weedkiller.info");
  });

  it("update personal site", () => {
    cy.get("#edit-personal-site-input").type("http://queasy-dispute.info");
  });

  it("update self intro", () => {
    cy.get("#edit-self-intro-input").type(
      "Perspiciatis atque libero architecto aliquam"
    );
  });

  it("save changes", () => {
    cy.get("#save-profile-button").click();
    cy.wait(3000);
    cy.go("back");
  });

  it("check name", () => {
    cy.get("#profile-name-span").should("have.text", "Admin Name");
  });

  it("check profile picture", () => {
    cy.get("#profile-picture-div")
      .find("img")
      .should("have.attr", "src", "https://loremflickr.com/640/480");
  });

  it("check github", () => {
    cy.get("#profile-github-link").should(
      "have.text",
      "https://frozen-page.biz"
    );
  });

  it("check linkedin", () => {
    cy.get("#profile-linkedin-link").should(
      "have.text",
      "http://incredible-weedkiller.info"
    );
  });

  it("check personal site", () => {
    cy.get("#profile-personal-site-link").should(
      "have.text",
      "http://queasy-dispute.info"
    );
  });

  it("check self intro", () => {
    cy.get("#profile-self-intro-span").should(
      "have.text",
      '"Perspiciatis atque libero architecto aliquam"'
    );
  });

  it("sign out", () => {
    cy.get("#nav-sign-out").click();
  });
});

export {};
