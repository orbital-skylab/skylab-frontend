/* eslint-disable no-undef */

describe("Testing user management feature", () => {
  beforeEach(() => {
    cy.login("admin@skylab.com", "Password123");
  });

  it("Creates and deletes users and roles as an admin", () => {
    // navigate to manage page
    cy.get("#nav-manage").click();
    cy.location("pathname").should("include", "/manage");

    // navigate to manage users page
    cy.get("#manage-users-card").click();
    cy.location("pathname").should("include", "/users");

    // view user
    cy.get("#view-user-button").first().click();
    cy.location("pathname").should("include", "users/");
    cy.go("back");

    // create user as student
    cy.get("#add-user-button").click();
    cy.get("#user-name-input").clear().type("Student2");
    cy.get("#user-email-input").clear().type("student2@skylab.com");
    cy.get("#student-nusnet-id-input").clear().type("e1234561");
    cy.get("#student-matric-no-input").clear().type("A1234567A");
    cy.get("#confirm-add-user-button").click();
    cy.wait(3050);

    // check student created
    cy.get("#user-search-input").clear().type("Student2");
    cy.contains("td", "Student2").should("exist");

    // create user as adviser
    cy.get("#add-user-button").click();
    cy.get("#user-name-input").clear().type("Adviser2");
    cy.get("#user-role-select").click();
    cy.get("#adviser-option").click({ force: true });
    cy.get("#user-email-input").clear().type("adviser2@skylab.com");
    cy.get("#adviser-nusnet-id-input").clear().type("e1234562");
    cy.get("#adviser-matric-no-input").clear().type("A1234567B");
    cy.get("#confirm-add-user-button").click();
    cy.wait(3050);

    // check adviser created
    cy.get("#user-search-input").clear().type("Adviser2");
    cy.contains("td", "Adviser2").should("exist");

    // create user as mentor
    cy.get("#add-user-button").click();
    cy.get("#user-name-input").type("Mentor2");
    cy.get("#user-email-input").clear().type("mentor2@skylab.com");
    cy.get("#user-role-select").click();
    cy.get("#mentor-option").click({ force: true });
    cy.get("#confirm-add-user-button").click();
    cy.wait(3050);

    // check mentor created
    cy.get("#user-search-input").clear().type("Mentor2");
    cy.contains("td", "Mentor2").should("exist");

    // create user as administrator
    cy.get("#add-user-button").click();
    cy.get("#user-name-input").clear().type("Admin2");
    cy.get("#user-email-input").clear().type("admin2@skylab.com");
    cy.get("#user-role-select").click();
    cy.get("#administrator-option").click({ force: true });
    cy.get("#administrator-start-date-input").type(
      `${new Date().getFullYear()}-01-01T08:00`
    );
    cy.get("#administrator-end-date-input").type(
      `${new Date().getFullYear()}-12-30T08:00`
    );
    cy.get("#confirm-add-user-button").click();
    cy.wait(3050);

    // check administrator created
    cy.get("#user-search-input").clear().type("Admin2");
    cy.contains("td", "Admin2").should("exist");

    // batch add student role
    cy.get("#add-students-button").click();
    cy.get(".multidropdown-button").click();
    cy.get(".multidropdown-option").then(($elements) => {
      const numOptions = $elements.length;
      cy.wrap($elements)
        .eq(numOptions - 3)
        .click({ force: true });
      cy.wrap($elements)
        .eq(numOptions - 2)
        .click({ force: true });
      cy.wrap($elements)
        .eq(numOptions - 1)
        .click({ force: true });
    });
    cy.get(".multidropdown-button").click();
    cy.get("#confirm-add-roles-button").click();
    cy.wait(3050);

    // batch add adviser role
    cy.get("#add-advisers-button").click();
    cy.get(".multidropdown-button").click();
    cy.get(".multidropdown-option").then(($elements) => {
      const numOptions = $elements.length;
      cy.wrap($elements)
        .eq(numOptions - 3)
        .click({ force: true });
      cy.wrap($elements)
        .eq(numOptions - 2)
        .click({ force: true });
      cy.wrap($elements)
        .eq(numOptions - 1)
        .click({ force: true });
    });
    cy.get(".multidropdown-button").click();
    cy.get("#confirm-add-roles-button").click();
    cy.wait(3050);

    // batch add mentor role
    cy.get("#add-mentors-button").click();
    cy.get(".multidropdown-button").click();
    cy.get(".multidropdown-option").then(($elements) => {
      const numOptions = $elements.length;
      cy.wrap($elements)
        .eq(numOptions - 3)
        .click({ force: true });
      cy.wrap($elements)
        .eq(numOptions - 2)
        .click({ force: true });
      cy.wrap($elements)
        .eq(numOptions - 1)
        .click({ force: true });
    });
    cy.get(".multidropdown-button").click();
    cy.get("#confirm-add-roles-button").click();
    cy.wait(3050);

    // batch add administrator role
    cy.get("#add-administrators-button").click();
    cy.get(".multidropdown-button").click();
    cy.get(".multidropdown-option").then(($elements) => {
      const numOptions = $elements.length;
      cy.wrap($elements)
        .eq(numOptions - 3)
        .click({ force: true });
      cy.wrap($elements)
        .eq(numOptions - 2)
        .click({ force: true });
      cy.wrap($elements)
        .eq(numOptions - 1)
        .click({ force: true });
    });
    cy.get(".multidropdown-button").click();
    cy.get("#confirm-add-roles-button").click();
    cy.wait(3050);

    // check roles added
    cy.get("#user-search-input").clear().type("Student2");
    cy.contains("td", "Student2")
      .parent()
      .within(() => {
        cy.get(".student-tag").should("exist");
        cy.get(".adviser-tag").should("exist");
        cy.get(".mentor-tag").should("exist");
        cy.get(".administrator-tag").should("exist");
      });

    cy.get("#user-search-input").clear().type("Adviser2");
    cy.contains("td", "Adviser2")
      .parent()
      .within(() => {
        cy.get(".student-tag").should("exist");
        cy.get(".adviser-tag").should("exist");
        cy.get(".mentor-tag").should("exist");
        cy.get(".administrator-tag").should("exist");
      });

    cy.get("#user-search-input").clear().type("Mentor2");
    cy.contains("td", "Mentor2")
      .parent()
      .within(() => {
        cy.get(".student-tag").should("exist");
        cy.get(".adviser-tag").should("exist");
        cy.get(".mentor-tag").should("exist");
        cy.get(".administrator-tag").should("exist");
      });

    cy.get("#user-search-input").clear().type("Admin2");
    cy.contains("td", "Admin2")
      .parent()
      .within(() => {
        cy.get(".student-tag").should("exist");
        cy.get(".adviser-tag").should("exist");
        cy.get(".mentor-tag").should("exist");
        cy.get(".administrator-tag").should("exist");
      });

    // delete newly created users
    cy.get("#user-search-input").clear().type("2");

    cy.contains("td", "Student2").parent().find("#delete-user-button").click();
    cy.get("#delete-user-submit-button").click();

    cy.contains("td", "Adviser2").parent().find("#delete-user-button").click();
    cy.get("#delete-user-submit-button").click();

    cy.contains("td", "Mentor2").parent().find("#delete-user-button").click();
    cy.get("#delete-user-submit-button").click();

    cy.contains("td", "Admin2").parent().find("#delete-user-button").click();
    cy.get("#delete-user-submit-button").click();

    // check users deleted
    cy.get("#user-search-input").clear().type("Student2");
    cy.contains("td", "Student2").should("not.exist");

    cy.get("#user-search-input").clear().type("Adviser2");
    cy.contains("td", "Adviser2").should("not.exist");

    cy.get("#user-search-input").clear().type("Mentor2");
    cy.contains("td", "Mentor2").should("not.exist");

    cy.get("#user-search-input").clear().type("Admin2");
    cy.contains("td", "Admin2").should("not.exist");
  });
});
