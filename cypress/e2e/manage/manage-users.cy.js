/* eslint-disable no-undef */

describe("Testing user management feature", () => {
  beforeEach(() => {
    cy.login("admin@skylab.com", "Password123");
    cy.visit("http://localhost:3000/");
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
    cy.get("#user-name-input").type("Student2");
    cy.get("#user-email-input").type("student2@skylab.com");
    cy.get("#student-nusnet-id-input").type("e1234561");
    cy.get("#student-matric-no-input").type("student2@skylab.com");
    cy.get("#confirm-add-user-button").click();

    // check student created
    cy.get("#user-search-input").type("Student2");
    cy.contains("td", "Student2").should("exist");

    // create user as adviser
    cy.get("#add-user-button").click();
    cy.get("#user-name-input").type("Adviser2");
    cy.get("#user-role-select").click();
    cy.get("#adviser-option").click({ force: true });
    cy.get("#user-email-input").type("adviser2@skylab.com");
    cy.get("#adviser-nusnet-id-input").type("e1234562");
    cy.get("#adviser-matric-no-input").type("adviser2@skylab.com");
    cy.get("#confirm-add-user-button").click();

    // check adviser created
    cy.get("#user-search-input").type("Adviser2");
    cy.contains("td", "Adviser2").should("exist");

    // create user as mentor
    cy.get("#add-user-button").click();
    cy.get("#user-name-input").type("Mentor2");
    cy.get("#user-email-input").type("mentor2@skylab.com");
    cy.get("#user-role-select").click();
    cy.get("#mentor-option").click({ force: true });
    cy.get("#confirm-add-user-button").click();

    // check mentor created
    cy.get("#user-search-input").type("Mentor2");
    cy.contains("td", "Mentor2").should("exist");

    // create user as administrator
    cy.get("#add-user-button").click();
    cy.get("#user-name-input").type("Admin2");
    cy.get("#user-email-input").type("admin2@skylab.com");
    cy.get("#user-role-select").click();
    cy.get("#administrator-option").click({ force: true });
    cy.get("#administrator-start-date-input").type(
      `01-01-${new Date().getFullYear()}`
    );
    cy.get("#administrator-end-date-input").type(
      `30-12-${new Date().getFullYear()}`
    );
    cy.get("#confirm-add-user-button").click();

    // check administrator created
    cy.get("#user-search-input").type("Admin2");
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
      cy.get(".multidropdown-button").click();
    });

    // batch add adviser role
    cy.get("#add-advisers-button").click();
    cy.get(".multidropdown-button").click();
    cy.get(".multidropdown-option").then(($elements) => {
      const numOptions = $elements.length;
      cy.wrap($elements)
        .eq(numOptions - 4)
        .click({ force: true });
      cy.wrap($elements)
        .eq(numOptions - 2)
        .click({ force: true });
      cy.wrap($elements)
        .eq(numOptions - 1)
        .click({ force: true });
    });

    // batch add mentor role
    cy.get("#add-mentors-button").click();
    cy.get(".multidropdown-button").click();
    cy.get(".multidropdown-option").then(($elements) => {
      const numOptions = $elements.length;
      cy.wrap($elements)
        .eq(numOptions - 4)
        .click({ force: true });
      cy.wrap($elements)
        .eq(numOptions - 3)
        .click({ force: true });
      cy.wrap($elements)
        .eq(numOptions - 1)
        .click({ force: true });
    });

    // batch add administrator role
    cy.get("#add-administrators-button").click();
    cy.get(".multidropdown-button").click();
    cy.get(".multidropdown-option").then(($elements) => {
      const numOptions = $elements.length;
      cy.wrap($elements)
        .eq(numOptions - 4)
        .click({ force: true });
      cy.wrap($elements)
        .eq(numOptions - 3)
        .click({ force: true });
      cy.wrap($elements)
        .eq(numOptions - 2)
        .click({ force: true });
    });

    // check roles added
    cy.get("#user-search-input").type("Student2");
    cy.contains("td", "Student2")
      .parent()
      .find(".student-tag.adviser-tag.mentor-tag.administator-tag")
      .should("exist");

    cy.get("#user-search-input").type("Adviser2");
    cy.contains("td", "Adviser2")
      .parent()
      .find(".student-tag.adviser-tag.mentor-tag.administator-tag")
      .should("exist");

    cy.get("#user-search-input").type("Mentor2");
    cy.contains("td", "Mentor2")
      .parent()
      .find(".student-tag.adviser-tag.mentor-tag.administator-tag")
      .should("exist");

    cy.get("#user-search-input").type("Admin2");
    cy.contains("td", "Admin2")
      .parent()
      .find(".student-tag.adviser-tag.mentor-tag.administator-tag")
      .should("exist");

    // delete newly created users
    cy.contains("td", "Student2").parent().find("#delete-user-button").click();
    cy.get("#delete-user-submit-button").click();

    cy.contains("td", "Adviser2").parent().find("#delete-user-button").click();
    cy.get("#delete-user-submit-button").click();

    cy.contains("td", "Mentor2").parent().find("#delete-user-button").click();
    cy.get("#delete-user-submit-button").click();

    cy.contains("td", "Admin2").parent().find("#delete-user-button").click();
    cy.get("#delete-user-submit-button").click();

    // check users deleted
    cy.get("#search-input").type("Student2");
    cy.contains("td", "Student2").should("not.exist");

    cy.get("#search-input").type("Adviser2");
    cy.contains("td", "Adviser2").should("not.exist");

    cy.get("#search-input").type("Mentor2");
    cy.contains("td", "Mentor2").should("not.exist");

    cy.get("#search-input").type("Admin2");
    cy.contains("td", "Admin2").should("not.exist");
  });
});
