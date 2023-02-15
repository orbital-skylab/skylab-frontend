/* eslint-disable no-undef */
/// <reference types="cypress" />

context("User flow for editing profile", function () {
  before("login", function () {
    Cypress.session.clearAllSavedSessions();
    cy.login("admin");
  });

  beforeEach(function () {
    cy.setCookie("token", window.sessionStorage.getItem("token") ?? "");
    cy.fixture("editProfile").then((fixture) => (this.fixture = fixture));
  });

  // pre-edits

  it("navigate to profile page", function () {
    cy.get("#nav-profile").click();
    cy.location("pathname").should("include", "users/");
  });

  it("check profile before editing", function () {
    cy.get("#profile-name-span").should("have.text", this.fixture.originalName);
    cy.get("#profile-picture-div").should("not.exist");
    cy.get("#profile-github-link").should("not.exist");
    cy.get("#profile-linkedin-link").should("not.exist");
    cy.get("#profile-personal-site-link").should("not.exist");
    cy.get("#profile-self-intro-span").should("not.exist");
  });

  // no edits

  it("edit profile", function () {
    cy.get("#edit-profile-button").click();
    cy.location("pathname").should("include", "edit");
  });

  it("save changes without editing", function () {
    cy.get("#save-profile-button").click();
    cy.wait(3000);
    cy.go("back");
    cy.location("pathname").should("not.include", "edit");
  });

  it("check no changes made to profile", function () {
    cy.get("#profile-name-span").should("have.text", this.fixture.originalName);
    cy.get("#profile-picture-div").should("not.exist");
    cy.get("#profile-github-link").should("not.exist");
    cy.get("#profile-linkedin-link").should("not.exist");
    cy.get("#profile-personal-site-link").should("not.exist");
    cy.get("#profile-self-intro-span").should("not.exist");
  });

  // valid edits

  it("edit profile", function () {
    cy.get("#edit-profile-button").click();
    cy.location("pathname").should("include", "edit");
  });

  it("update name", function () {
    cy.get("#edit-name-input").type(this.fixture.validName);
  });

  it("update profile picture", function () {
    cy.get("#edit-profile-picture-input").type(
      this.fixture.validProfilePicture
    );
  });

  it("update github", function () {
    cy.get("#edit-github-input").type(this.fixture.validGithub);
  });

  it("update linkedin", function () {
    cy.get("#edit-linkedin-input").type(this.fixture.validLinkedIn);
  });

  it("update personal site", function () {
    cy.get("#edit-personal-site-input").type(this.fixture.validPersonalSite);
  });

  it("update self intro", function () {
    cy.get("#edit-self-intro-input").type(this.fixture.validSelfIntro);
  });

  it("save changes", function () {
    cy.get("#save-profile-button").click();
    cy.wait(3000);
    cy.go("back");
    cy.location("pathname").should("not.include", "edit");
  });

  it("check name", function () {
    cy.get("#profile-name-span").should("have.text", this.fixture.validName);
  });

  it("check profile picture", function () {
    cy.get("#profile-picture-div")
      .find("img")
      .should("have.attr", "src", this.fixture.validProfilePicture);
  });

  it("check github", function () {
    cy.get("#profile-github-link").should(
      "have.text",
      this.fixture.validGithub
    );
  });

  it("check linkedin", function () {
    cy.get("#profile-linkedin-link").should(
      "have.text",
      this.fixture.validLinkedIn
    );
  });

  it("check personal site", function () {
    cy.get("#profile-personal-site-link").should(
      "have.text",
      this.fixture.validPersonalSite
    );
  });

  it("check self intro", function () {
    cy.get("#profile-self-intro-span").should(
      "have.text",
      this.fixture.validSelfIntro
    );
  });

  // invalid edits

  it("edit profile", function () {
    cy.get("#edit-profile-button").click();
    cy.location("pathname").should("include", "edit");
  });

  it("update invalid name", function () {
    cy.get("#edit-name-input").type(this.fixture.invalidName);
  });

  it("check not allowed to save changes", function () {
    cy.get("#save-profile-button").should("be.disabled");
    cy.go("back");
    cy.location("pathname").should("not.include", "edit");
  });

  // done

  it("sign out", function () {
    cy.get("#nav-sign-out").click();
    cy.location("pathname").should("not.include", "users/");
  });
});

export {};
