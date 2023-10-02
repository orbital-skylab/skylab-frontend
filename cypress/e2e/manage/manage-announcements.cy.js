/* eslint-disable no-undef */

context("Actions", () => {
  before(() => {
    cy.login("admin@skylab.com", "Password123");
    cy.visit("http://localhost:3000/");
  });

  it("navigate to create announcements page", () => {
    cy.get("#nav-manage").click();
    cy.location("pathname").should("include", "manage");
    cy.get("#manage-announcements-card").click();
    cy.location("pathname").should("include", "manage/announcements");
    cy.get("#create-announcement-button").click();
    cy.location("pathname").should("include", "manage/announcements/add");
  });

  it("create announcement", () => {
    cy.get("#create-announcement-cohort-input").click();
    cy.get("#2023-option").click();
    cy.get("#create-announcement-target-audience-role-input").click();
    cy.get("#All-option").click();
    cy.get("#create-announcement-title-input").type("Test announcement");
    cy.get("#create-announcement-content-input").within(() => {
      cy.get(".ql-editor").type("This is a test announcement");
    });
    cy.get("#create-announcement-post-button").click();
    cy.wait(5000);
    cy.location("pathname").should("include", "manage/announcements");
  });

  it("check created announcement", () => {
    cy.get("p").contains("Test announcement").should("exist");
  });

  it("edit announcement", () => {
    cy.get("p")
      .contains("Test announcement")
      .parent()
      .parent()
      .within(() => {
        cy.get("#edit-announcement-button").click();
      });
    cy.location("pathname").should("include", "edit");
    cy.get("#edit-announcement-title-input").type("Test announcement (Edited)");
    cy.get("#edit-announcement-post-button").click();
    cy.get("#go-back-button").click();
    cy.location("pathname").should("include", "manage/announcements");
    cy.get("p").contains("Test announcement (Edited").should("exist");
  });

  it("create comment", () => {
    cy.get("p")
      .contains("Test announcement")
      .parent()
      .parent()
      .within(() => {
        cy.get("#view-announcement-comments-button").click();
      });
    cy.location("pathname").should("include", "announcements/");
    cy.get("#comment-content-input").within(() => {
      cy.get(".ql-editor").type("Test comment");
    });
    cy.get("#comment-button").click();
    cy.get("p").contains("Test comment").should("exist");
  });

  it("edit comment", () => {
    cy.get("p")
      .contains("Test comment")
      .parent()
      .parent()
      .parent()
      .within(() => {
        cy.get("#edit-comment-button").click();
      });
    cy.get("#edit-comment-content-input").within(() => {
      cy.get(".ql-editor").type("Test comment (Edited)");
    });
    cy.get("#edit-comment-post-button").click();
    cy.get("p").contains("Test comment (Edited)").should("exist");
  });

  it("reply to comment", () => {
    cy.get("p")
      .contains("Test comment (Edited)")
      .parent()
      .parent()
      .parent()
      .parent()
      .parent()
      .within(() => {
        cy.get("#reply-comment-button").click();
      });
    cy.get("#reply-comment-content-input").within(() => {
      cy.get(".ql-editor").type("Test reply");
    });
    cy.get("#reply-comment-post-button").click();
    cy.get("p").contains("Test reply").should("exist");
  });

  it("edit reply", () => {
    cy.get("p")
      .contains("Test reply")
      .parent()
      .parent()
      .parent()
      .within(() => {
        cy.get("#edit-comment-button").click();
      });
    cy.get("#edit-comment-content-input").within(() => {
      cy.get(".ql-editor").type("Test reply (Edited)");
    });
    cy.get("#edit-comment-post-button").click();
    cy.get("p").contains("Test reply (Edited)").should("exist");
  });

  it("delete reply", () => {
    cy.get("p")
      .contains("Test reply (Edited)")
      .parent()
      .parent()
      .parent()
      .within(() => {
        cy.get("#delete-comment-button").click();
      });
    cy.get("#delete-comment-confirm-button").click();
    cy.get("p").contains("Test reply (Edited)").should("not.exist");
  });

  it("delete comment", () => {
    cy.get("p")
      .contains("Test comment (Edited)")
      .parent()
      .parent()
      .parent()
      .within(() => {
        cy.get("#delete-comment-button").click();
      });
    cy.get("#delete-comment-confirm-button").click();
    cy.get("p").contains("Test comment (Edited)").should("not.exist");
  });

  it("navigate to manage announcements page", () => {
    cy.get("#nav-manage").click();
    cy.location("pathname").should("include", "manage");
    cy.get("#manage-announcements-card").click();
    cy.location("pathname").should("include", "manage/announcements");
  });

  it("delete announcement", () => {
    cy.get("p")
      .contains("Test announcement")
      .parent()
      .parent()
      .within(() => {
        cy.get("#delete-announcement-button").click();
      });
    cy.get("#delete-announcement-confirm-button").click();
    cy.get("p").contains("Test announcement (Edited").should("not.exist");
  });

  it("sign out", () => {
    cy.get("#nav-sign-out").click();
    cy.get("#nav-manage").should("not.exist");
  });
});
