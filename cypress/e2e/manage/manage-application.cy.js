/* eslint-disable no-undef */

describe("Testing application feature", () => {
  it("Creates and duplicates application form as admin", () => {
    cy.login("admin@skylab.com", "Password123");

    // navigate to manage page
    cy.get("#nav-manage").click();
    cy.location("pathname").should("include", "/manage");

    // navigate to manage deadlines page
    cy.get("#manage-deadlines-card").click();
    cy.location("pathname").should("include", "/deadlines");

    // create new application form
    cy.get("#add-deadline-button").click();
    cy.get("#deadline-name-input").type("Apply for Orbital");
    cy.get("#add-deadline-modal [data-testid=ArrowDropDownIcon]")
      .parent()
      .click();
    cy.get("[data-value=Application]").click({ force: true });
    cy.get("#submit-deadline-button").click();

    // check application form created
    cy.contains("td", "Apply for Orbital").should("exist");

    // duplicate existing application form
    cy.get("#duplicate-deadline-button").click();
    cy.get("#duplicate-deadline-modal [data-testid=ArrowDropDownIcon]")
      .parent()
      .click();
    cy.get("[data-value=2024]").click({ force: true });
    cy.get("#confirm-duplicate-deadline-button").click();

    // check application form duplicated
    cy.get("#select-cohort-input").click();
    cy.get("[data-value=2024]").click({ force: true });
    cy.contains("td", "Copy of Apply for Orbital").should("exist");
  });

  it("Fills out first application form as anonymous applicant", () => {
    cy.visit("http://localhost:3000");

    // navigate to application page
    cy.get("#apply-now-button").click();
    cy.location("pathname").should("include", "/application");

    // fill out application form
    cy.get(".short-answer-question").eq(0).find("input").type("Tom");
    cy.get(".short-answer-question").eq(1).find("input").type("Jerry");
    cy.get(".short-answer-question").eq(2).find("input").type("tom@skylab.com");
    cy.get(".short-answer-question")
      .eq(3)
      .find("input")
      .type("jerry@skylab.com");
    cy.get(".short-answer-question").eq(4).find("input").type("A0214584A");
    cy.get(".short-answer-question").eq(5).find("input").type("A0214584B");
    cy.get(".short-answer-question").eq(6).find("input").type("E0528181");
    cy.get(".short-answer-question").eq(7).find("input").type("E0528182");
    cy.get(".short-answer-question").eq(8).find("input").type("TomJerry");
    cy.get(".dropdown-question")
      .first()
      .find("[data-testid=ArrowDropDownIcon]")
      .parent()
      .click();
    cy.get("[data-value=Apollo]").click({ force: true });
    cy.get("#submit-submission-button").click();
    cy.location("pathname").should("not.include", "/application");
  });

  it("Fills out second application form as anonymous applicant", () => {
    cy.visit("http://localhost:3000");

    // navigate to application page
    cy.get("#apply-now-button").click();
    cy.location("pathname").should("include", "/application");

    // fill out application form while trying repeated credentials
    cy.get(".short-answer-question").eq(0).find("input").type("Tom2");
    cy.get(".short-answer-question").eq(1).find("input").type("Jerry2");
    cy.get(".short-answer-question")
      .eq(2)
      .find("input")
      .type("tom2@skylab.com");
    cy.get(".short-answer-question")
      .eq(3)
      .find("input")
      .type("jerry2@skylab.com");
    cy.get(".short-answer-question").eq(4).find("input").type("A0214584A");
    cy.get(".short-answer-question").eq(5).find("input").type("A0214584B");
    cy.get(".short-answer-question").eq(6).find("input").type("E0528181");
    cy.get(".short-answer-question").eq(7).find("input").type("E0528182");
    cy.get(".short-answer-question").eq(8).find("input").type("Tom2Jerry2");
    cy.get(".dropdown-question")
      .first()
      .find("[data-testid=ArrowDropDownIcon]")
      .parent()
      .click();
    cy.get("[data-value=Apollo]").click({ force: true });
    cy.get("#submit-submission-button").click();
    cy.get("#error-alert").should("exist");

    cy.get(".short-answer-question").eq(4).find("input").type("A0214584C");
    cy.get("#submit-submission-button").click();
    cy.get("#error-alert").should("exist");

    cy.get(".short-answer-question").eq(5).find("input").type("A0214584D");
    cy.get("#submit-submission-button").click();
    cy.get("#error-alert").should("exist");

    cy.get(".short-answer-question").eq(6).find("input").type("E0528183");
    cy.get("#submit-submission-button").click();
    cy.get("#error-alert").should("exist");

    cy.get(".short-answer-question").eq(7).find("input").type("E0528184");
    cy.get("#submit-submission-button").click();
    cy.location("pathname").should("not.include", "/application");
  });

  it("Fills out third application form as anonymous applicant", () => {
    cy.visit("http://localhost:3000");

    // navigate to application page
    cy.get("#apply-now-button").click();
    cy.location("pathname").should("include", "/application");

    // fill out application form
    cy.get(".short-answer-question").eq(0).find("input").type("Tom3");
    cy.get(".short-answer-question").eq(1).find("input").type("Jerry3");
    cy.get(".short-answer-question")
      .eq(2)
      .find("input")
      .type("tom3@skylab.com");
    cy.get(".short-answer-question")
      .eq(3)
      .find("input")
      .type("jerry3@skylab.com");
    cy.get(".short-answer-question").eq(4).find("input").type("A0214584E");
    cy.get(".short-answer-question").eq(5).find("input").type("A0214584F");
    cy.get(".short-answer-question").eq(6).find("input").type("E0528185");
    cy.get(".short-answer-question").eq(7).find("input").type("E0528186");
    cy.get(".short-answer-question").eq(8).find("input").type("Tom3Jerry3");
    cy.get(".dropdown-question")
      .first()
      .find("[data-testid=ArrowDropDownIcon]")
      .parent()
      .click();
    cy.get("[data-value=Apollo]").click({ force: true });
    cy.get("#submit-submission-button").click();
    cy.location("pathname").should("not.include", "/application");
  });

  it("Withdraws application as an admin", () => {
    cy.login("admin@skylab.com", "Password123");

    // navigate to manage page
    cy.get("#nav-manage").click();
    cy.location("pathname").should("include", "/manage");

    // navigate to manage applications page
    cy.get("#manage-applications-card").click();
    cy.location("pathname").should("include", "/applications");

    // withdraw application
    cy.contains("td", "Tom3Jerry3")
      .parent()
      .find("#withdraw-application-button")
      .click();
    cy.get("#confirm-withdraw-application-button").click();

    // check application has been removed
    cy.wait(2000);
    cy.contains("td", "Tom3Jerry3").should("not.exist");
  });

  it("Rejects application as an admin", () => {
    cy.login("admin@skylab.com", "Password123");

    // navigate to manage page
    cy.get("#nav-manage").click();
    cy.location("pathname").should("include", "/manage");

    // navigate to manage applications page
    cy.get("#manage-applications").click();
    cy.location("pathname").should("include", "/applications");

    // reject application
    cy.contains("td", "Tom2Jerry2")
      .parent()
      .find("#reject-application-button")
      .click();
    cy.get("#confirm-reject-application-button").click();

    // check application has been rejected
    cy.contains("td", "Tom2Jerry2")
      .parent()
      .contains("td", "Rejected")
      .should("exist");
  });

  it("Approves application as an admin", () => {
    cy.login("admin@skylab.com", "Password123");

    // navigate to manage page
    cy.get("#nav-manage").click();
    cy.location("pathname").should("include", "/manage");

    // navigate to manage applications page
    cy.get("#manage-applications").click();
    cy.location("pathname").should("include", "/applications");

    // approve application
    cy.contains("td", "TomJerry")
      .parent()
      .find("#approve-application-button")
      .click();
    cy.get("#confirm-approve-application-button").click();

    // check application has been approved
    cy.contains("td", "TomJerry")
      .parent()
      .contains("td", "Approved")
      .should("exist");

    // check new team and users have been created
    cy.get("#nav-manage").click();
    cy.get("#manage-projects-card").click();
    cy.location("pathname").should("include", "/projects");

    cy.get("#project-search-input").type("TomJerry");
    cy.wait(2000);
    cy.contains("td", "TomJerry").should("exist");
    cy.contains("td", "TomJerry")
      .parent()
      .contains("h6", "Tom")
      .should("exist");
    cy.contains("td", "TomJerry")
      .parent()
      .contains("h6", "Jerry")
      .should("exist");

    cy.get("#nav-manage").click();
    cy.get("#manage-users-card").click();
    cy.location("pathname").should("include", "/users");

    cy.get("#students-tab").click();
    cy.get("#user-search-input").type("Tom");
    cy.wait(2000);
    cy.contains("td", "Tom").should("exist");
    cy.get("#user-search-input").type("Jerry");
    cy.wait(2000);
    cy.contains("td", "Jerry").should("exist");
  });
});
