/* eslint-disable no-undef */

describe("Testing user management feature", () => {
  beforeEach(() => {
    cy.login("admin@skylab.com", "Password123");
    cy.visit("http://localhost:3000/");
  });

  it("Creates, updates and deletes users as an admin", () => {
    // navigate to manage page
    cy.get("#nav-manage").click();
    cy.location("pathname").should("include", "/manage");

    // navigate to manage users page
    cy.get("#manage-users-card").click();
    cy.location("pathname").should("include", "/users");

    // create user as student

    // check student created

    // create user as adviser

    // check adviser created

    // create user as mentor

    // check mentor created

    // create user as administrator

    // check administrator created

    // single add student role

    // check student role added

    // single add adviser role

    // check adviser role added

    // single add mentor role

    // check mentor role added

    // single add administrator role

    // check administrator role added

    // batch add student roles

    // check student roles added

    // batch add adviser roles

    // check adviser roles added

    // batch add mentor roles

    // check mentor roles added

    // batch add admin roles

    // check administrator roles added

    // delete all (?)
  });
});
