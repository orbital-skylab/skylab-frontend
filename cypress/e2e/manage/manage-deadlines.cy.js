/* eslint-disable no-undef */

describe("Testing deadlines management feature", () => {
  beforeEach(() => {
    cy.login("admin@skylab.com", "Password123");
    cy.visit("http://localhost:3000/");
  });

  it("Creates, updates and deletes deadlines as an admin", () => {
    // navigate to manage page
    cy.get("#nav-manage").click();
    cy.location("pathname").should("include", "/manage");

    // navigate to manage deadlines page
    cy.get("#manage-deadlines-card").click();
    cy.location("pathname").should("include", "/deadlines");

    // create deadline

    // check deadline created

    // edit deadline

    // check deadline edited

    // edit deadline questions

    // check deadline questions edited

    // delete deadline

    // check deadline deleted
  });
});
