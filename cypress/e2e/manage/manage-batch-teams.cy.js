/* eslint-disable no-undef */

context("Actions", () => {
  before(() => {
    cy.login("admin@skylab.com", "Password123");
    cy.visit("http://localhost:3000/");
  });

  it("navigate to upload teams page", () => {
    cy.get("#nav-manage").click();
    cy.location("pathname").should("include", "manage");
    cy.get("#batch-add-teams-card").click();
    cy.location("pathname").should("include", "manage/csv-teams");
  });

  it("detects missing data field error", () => {
    cy.get("#upload-csv-drag-area").selectFile(
      {
        contents: Cypress.Buffer.from(
          "Project Name,Level of Achievement,Cohort Year,Proposal PDF,Student 1 Name,Student 1 Email,Student 1 NUSNET ID,Student 1 Matriculation Number,Student 2 Name,Student 2 Email,Student 2 NUSNET ID,Student 2 Matriculation Number\nCCSGP Volunteer Job Board,Artemis,2022,https://drive.google.com,Rayner Loh,e0123456@u.nus.edu,e0123456,A0123456X,Vijay Narayanan,e02345672@u.nus.edu,e0234567,A0234567X"
        ),
        fileName: "test.csv",
      },
      {
        action: "drag-drop",
      }
    );
    cy.contains(
      "div",
      "The uploaded file does not follow the format of the provided CSV template."
    ).should("exist");

    cy.get("#upload-csv-clear-button").click();
  });

  it("detects extra data field error", () => {
    cy.get("#upload-csv-drag-area").selectFile(
      {
        contents: Cypress.Buffer.from(
          "Project Name,Team Name,Level of Achievement,Cohort Year,Proposal PDF,Student 1 Name,Student 1 Email,Student 1 NUSNET ID,Student 1 Matriculation Number,Student 2 Name,Student 2 Email,Student 2 NUSNET ID,Student 2 Matriculation Number,Test Field\nCCSGP Volunteer Job Board,NUSGrabYourOwnFood,Artemis,2022,https://drive.google.com,Rayner Loh,e0123456@u.nus.edu,e0123456,A0123456X,Vijay Narayanan,e02345672@u.nus.edu,e0234567,A0234567X,Test Value"
        ),
        fileName: "test.csv",
      },
      {
        action: "drag-drop",
      }
    );
    cy.contains(
      "div",
      "The uploaded file does not follow the format of the provided CSV template."
    ).should("exist");

    cy.get("#upload-csv-clear-button").click();
  });

  it("detects field format error", () => {
    cy.get("#upload-csv-drag-area").selectFile(
      {
        contents: Cypress.Buffer.from(
          "Project Name,Team Name,Level of Achievement,Cohort Year,Proposal PDF,Student 1 Name,Student 1 Email,Student 1 NUSNET ID,Student 1 Matriculation Number,Student 2 Name,Student 2 Email,Student 2 NUSNET ID,Student 2 Matriculation Number\nCCSGP Volunteer Job Board,NUSGrabYourOwnFood,Artemis,2022,https://drive.google.com,Rayner Loh,e0123456@u.nus.edu,e0123456,A0123456X,Vijay Narayanan,e02345672@u.nus.edu,e0234567,A0234567"
        ),
        fileName: "test.csv",
      },
      {
        action: "drag-drop",
      }
    );
    cy.contains(
      "div",
      "Some errors were detected while validating the data entries:"
    ).should("exist");

    cy.get("#upload-csv-clear-button").click();
  });

  it("successfully upload csv", () => {
    cy.get("#upload-csv-drag-area").selectFile(
      {
        contents: Cypress.Buffer.from(
          "Project Name,Team Name,Level of Achievement,Cohort Year,Proposal PDF,Student 1 Name,Student 1 Email,Student 1 NUSNET ID,Student 1 Matriculation Number,Student 2 Name,Student 2 Email,Student 2 NUSNET ID,Student 2 Matriculation Number\nCCSGP Volunteer Job Board,NUSGrabYourOwnFood,Artemis,2022,https://drive.google.com,Rayner Loh,e0123456@u.nus.edu,e0123456,A0123456X,Vijay Narayanan,e02345672@u.nus.edu,e0234567,A0234567X"
        ),
        fileName: "test.csv",
      },
      {
        action: "drag-drop",
      }
    );

    cy.contains(
      "div",
      "1 row successfully detected. Ready to add them?"
    ).should("exist");

    cy.get("#upload-csv-button").click();

    cy.contains("div", "Successfully added the projects and students!").should(
      "exist"
    );
  });

  it("successfully added users", () => {
    cy.get("#nav-manage").click();
    cy.location("pathname").should("include", "manage");
    cy.get("#manage-users-card").click();
    cy.location("pathname").should("include", "manage/users");

    cy.get("#user-cohort-select").click();
    cy.get("#2022-cohort-option").click();
    cy.contains("td", "Rayner Loh").should("exist");
    cy.contains("td", "Vijay Narayanan").should("exist");
  });

  it("deletes users", () => {
    cy.contains("td", "Rayner Loh")
      .parent()
      .within(() => {
        cy.contains("button", "Delete").click();
      });
    cy.get("#delete-user-submit-button").click();

    cy.contains("td", "Vijay Narayanan")
      .parent()
      .within(() => {
        cy.contains("button", "Delete").click();
      });
    cy.get("#delete-user-submit-button").click();

    cy.contains("td", "Rayner Loh").should("not.exist");
    cy.contains("td", "Vijay Narayanan").should("not.exist");
  });

  it("successfully added team", () => {
    cy.get("#nav-manage").click();
    cy.location("pathname").should("include", "manage");
    cy.get("#manage-projects-card").click();
    cy.location("pathname").should("include", "manage/projects");

    cy.get("#project-cohort-select").click();
    cy.get("#2022-projects-option").click();
    cy.contains("td", "NUSGrabYourOwnFood").should("exist");
  });

  it("deletes team", () => {
    cy.contains("td", "NUSGrabYourOwnFood")
      .parent()
      .within(() => {
        cy.contains("button", "Delete").click();
      });
    cy.get("#delete-project-submit-button").click();
    cy.contains("td", "NUSGrabYourOwnFood").should("not.exist");
  });

  it("sign out", () => {
    cy.get("#nav-sign-out").click();
    cy.get("#nav-manage").should("not.exist");
  });
});
