/* eslint-disable no-undef */
/// <reference types="cypress" />

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
      "1 project successfully detected. Ready to add them?"
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

  // it("create announcement", () => {
  //   cy.get("#create-announcement-cohort-input").click();
  //   cy.get("#2023-option").click();
  //   cy.get("#create-announcement-target-audience-role-input").click();
  //   cy.get("#All-option").click();
  //   cy.get("#create-announcement-title-input").type("Test announcement");
  //   cy.get("#create-announcement-content-input").within(() => {
  //     cy.get(".ql-editor").type("This is a test announcement");
  //   });
  //   cy.get("#create-announcement-post-button").click();
  //   cy.wait(5000);
  //   cy.location("pathname").should("include", "manage/announcements");
  // });

  // it("check created announcement", () => {
  //   cy.get("p").contains("Test announcement").should("exist");
  // });

  // it("edit announcement", () => {
  //   cy.get("p")
  //     .contains("Test announcement")
  //     .parent()
  //     .parent()
  //     .within(() => {
  //       cy.get("#edit-announcement-button").click();
  //     });
  //   cy.location("pathname").should("include", "edit");
  //   cy.get("#edit-announcement-title-input").type("Test announcement (Edited)");
  //   cy.get("#edit-announcement-post-button").click();
  //   cy.get("#go-back-button").click();
  //   cy.location("pathname").should("include", "manage/announcements");
  //   cy.get("p").contains("Test announcement (Edited").should("exist");
  // });

  // it("create comment", () => {
  //   cy.get("p")
  //     .contains("Test announcement")
  //     .parent()
  //     .parent()
  //     .within(() => {
  //       cy.get("#view-announcement-comments-button").click();
  //     });
  //   cy.location("pathname").should("include", "announcements/");
  //   cy.get("#comment-content-input").within(() => {
  //     cy.get(".ql-editor").type("Test comment");
  //   });
  //   cy.get("#comment-button").click();
  //   cy.get("p").contains("Test comment").should("exist");
  // });

  // it("edit comment", () => {
  //   cy.get("p")
  //     .contains("Test comment")
  //     .parent()
  //     .parent()
  //     .parent()
  //     .within(() => {
  //       cy.get("#edit-comment-button").click();
  //     });
  //   cy.get("#edit-comment-content-input").within(() => {
  //     cy.get(".ql-editor").type("Test comment (Edited)");
  //   });
  //   cy.get("#edit-comment-post-button").click();
  //   cy.get("p").contains("Test comment (Edited)").should("exist");
  // });

  // it("reply to comment", () => {
  //   cy.get("p")
  //     .contains("Test comment (Edited)")
  //     .parent()
  //     .parent()
  //     .parent()
  //     .parent()
  //     .parent()
  //     .within(() => {
  //       cy.get("#reply-comment-button").click();
  //     });
  //   cy.get("#reply-comment-content-input").within(() => {
  //     cy.get(".ql-editor").type("Test reply");
  //   });
  //   cy.get("#reply-comment-post-button").click();
  //   cy.get("p").contains("Test reply").should("exist");
  // });

  // it("edit reply", () => {
  //   cy.get("p")
  //     .contains("Test reply")
  //     .parent()
  //     .parent()
  //     .parent()
  //     .within(() => {
  //       cy.get("#edit-comment-button").click();
  //     });
  //   cy.get("#edit-comment-content-input").within(() => {
  //     cy.get(".ql-editor").type("Test reply (Edited)");
  //   });
  //   cy.get("#edit-comment-post-button").click();
  //   cy.get("p").contains("Test reply (Edited)").should("exist");
  // });

  // it("delete reply", () => {
  //   cy.get("p")
  //     .contains("Test reply (Edited)")
  //     .parent()
  //     .parent()
  //     .parent()
  //     .within(() => {
  //       cy.get("#delete-comment-button").click();
  //     });
  //   cy.get("#delete-comment-confirm-button").click();
  //   cy.get("p").contains("Test reply (Edited)").should("not.exist");
  // });

  // it("delete comment", () => {
  //   cy.get("p")
  //     .contains("Test comment (Edited)")
  //     .parent()
  //     .parent()
  //     .parent()
  //     .within(() => {
  //       cy.get("#delete-comment-button").click();
  //     });
  //   cy.get("#delete-comment-confirm-button").click();
  //   cy.get("p").contains("Test comment (Edited)").should("not.exist");
  // });

  // it("navigate to manage announcements page", () => {
  //   cy.get("#nav-manage").click();
  //   cy.location("pathname").should("include", "manage");
  //   cy.get("#manage-announcements-card").click();
  //   cy.location("pathname").should("include", "manage/announcements");
  // });

  // it("delete announcement", () => {
  //   cy.get("p")
  //     .contains("Test announcement")
  //     .parent()
  //     .parent()
  //     .within(() => {
  //       cy.get("#delete-announcement-button").click();
  //     });
  //   cy.get("#delete-announcement-confirm-button").click();
  //   cy.get("p").contains("Test announcement (Edited").should("not.exist");
  // });

  it("sign out", () => {
    cy.get("#nav-sign-out").click();
    cy.get("#nav-manage").should("not.exist");
  });
});

export {};
