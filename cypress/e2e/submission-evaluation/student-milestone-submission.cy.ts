/* eslint-disable no-undef */

describe("Milestone Submission", () => {
  beforeEach(() => {
    cy.login("student@skylab.com", "Password123");

    // Navigate to dashboard
    cy.get("#nav-dashboard").click();
    cy.location("pathname").should("include", "/dashboard");

    cy.contains("tr", "Milestone 2").find('[id$="-deadline-button"]').click();
    cy.location("pathname").should("include", "/submissions");
  });

  it("Should save as draft and display 'Saved Draft' status on dashboard", () => {
    cy.contains(".rich-text-editor-question", "ReadMe")
      .find(".ql-editor")
      .clear()
      .type("Drafting the ReadMe...");

    cy.contains(".url-question", "Poster link")
      .find('input[type="url"]')
      .clear();

    cy.contains(".url-question", "Video link")
      .find('input[type="url"]')
      .clear();

    cy.contains(".rich-text-editor-question", "Project log")
      .find(".ql-editor")
      .clear();

    cy.get("#save-draft-button").click();

    cy.contains("Successfully saved draft").should("be.visible");

    cy.get("#go-back-button").click({ force: true });
    cy.location("pathname").should("include", "dashboard/student");

    cy.contains("tr", "Milestone 2").should("contain.text", "Saved Draft");
  });

  it("Should show error for invalid URL format and prevent submission", () => {
    cy.contains(".rich-text-editor-question", "ReadMe")
      .find(".ql-editor")
      .clear()
      .type("This is the official ReadMe documentation.");

    cy.contains(".url-question", "Video link")
      .find('input[type="url"]')
      .clear()
      .type("https://youtube.com/watch?v=dQw4w9WgXcQ");

    cy.contains(".rich-text-editor-question", "Project log")
      .find(".ql-editor")
      .clear()
      .type("This is the Project Log.");

    // type invalid URL
    cy.contains(".url-question", "Poster link")
      .find('input[type="url"]')
      .clear()
      .type("not a url");
    cy.get("body").click();

    // verify error message appears
    cy.contains("Please enter a valid URL").should("be.visible");

    // attempt to submit
    cy.get("#submit-submission-button").click();

    cy.wait(4000);

    // verify success message DOES NOT appear
    cy.contains("Successfully submitted").should("not.exist");
  });

  it("Should not allow submission if mandatory fields are empty", () => {
    cy.contains(".rich-text-editor-question", "ReadMe")
      .find(".ql-editor")
      .clear();

    cy.contains(".url-question", "Poster link")
      .find('input[type="url"]')
      .clear();

    cy.contains(".url-question", "Video link")
      .find('input[type="url"]')
      .clear();

    cy.contains(".rich-text-editor-question", "Project log")
      .find(".ql-editor")
      .clear();

    // attempt to submit
    cy.get("#submit-submission-button").click();

    cy.wait(4000);

    // verify success message does not appear
    cy.contains("Successfully submitted").should("not.exist");
  });

  it("Should successfully submit the completed form", () => {
    // fill in all fields correctly
    cy.contains(".rich-text-editor-question", "ReadMe")
      .find(".ql-editor")
      .clear()
      .type("This is the official ReadMe documentation.");

    cy.contains(".url-question", "Poster link")
      .find('input[type="url"]')
      .clear()
      .type("https://loremflickr.com/640/480");

    cy.contains(".url-question", "Video link")
      .find('input[type="url"]')
      .clear()
      .type("https://youtube.com/watch?v=dQw4w9WgXcQ");

    cy.contains(".rich-text-editor-question", "Project log")
      .find(".ql-editor")
      .clear()
      .type("This is the Project Log.");

    // Submit
    cy.get("#submit-submission-button").click();

    // Verify submission success
    cy.contains("Successfully submitted").should("be.visible");

    // Navigate back to dashboard
    cy.get("#go-back-button").click({ force: true });
    cy.location("pathname").should("include", "dashboard/student");

    // Verify the status column updated to "Submitted on"
    cy.contains("tr", "Milestone 2").should("contain.text", "Submitted on");
  });
});

export {};
