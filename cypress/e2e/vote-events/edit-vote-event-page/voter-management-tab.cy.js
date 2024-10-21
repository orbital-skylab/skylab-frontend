/* eslint-disable no-undef */

describe("Testing vote event voter management tab", () => {
  const voteEventId = 2; // Vote event with voter management (both types of voters) set and no voters
  const voteEventWithVotersId = 5; // Vote event with voters
  const internalVoterOnlyVoteEventId = 7; // Vote event with internal voters only
  const externalVoterOnlyVoteEventId = 8; // Vote event with external voters only
  const noVoterManagementVoteEventId = 1; // Vote event with no voter management set
  let voteEvent = {};

  const navigateToTab = (voteEventId) => {
    cy.intercept("GET", `/api/vote-events/${voteEventId}`, (req) => {
      delete req.headers["if-none-match"];
      req.continue((res) => {
        voteEvent = res.body.voteEvent;
      });
    }).as("getVoteEvent");
    cy.visit(`http://localhost:3000/vote-events/${voteEventId}/edit`);

    cy.wait("@getVoteEvent");
    cy.get(`#voter-management-tab`).click();
  };

  const confirmEditConfig = () => {
    cy.get("#edit-voter-management-config-modal").should("not.exist");
    cy.get("#confirm-set-voter-management-config-modal").should("be.visible");
    cy.get("#set-voter-management-config-modal-confirm-button").click();

    cy.get("#success-alert").should("be.visible");
    cy.get("#confirm-set-voter-management-config-modal").should("not.exist");
  };

  before(() => {
    cy.login("admin@skylab.com", "Password123");
  });

  beforeEach(() => {
    navigateToTab(voteEventId);
  });

  after(() => {
    cy.get("#nav-sign-out").click();
  });

  it("Should navigate to vote event voter management tab from home page", () => {
    cy.visit("http://localhost:3000/");
    cy.get("#nav-vote-events").click();
    cy.location("pathname").should("include", "vote-events");
    cy.get(`#edit-vote-event-${voteEventId}-button`).click();
    cy.location("pathname").should(
      "include",
      `vote-events/${voteEventId}/edit`
    );
    cy.get(`#voter-management-tab`).click();

    // Check if the voter managment tab is active
    cy.get("#open-voter-management-config-button").should("be.visible");
  });

  it("Should only display config button if voter management config is not set", () => {
    navigateToTab(noVoterManagementVoteEventId);
    cy.get("#internal-voters-header").should("not.exist");
    cy.get("#external-voters-header").should("not.exist");
    cy.get("#voter-list-tabs").should("not.exist");
    cy.get("#open-voter-management-config-button").should("be.visible");
  });

  it("Should only display internal voters if only that is set", () => {
    navigateToTab(internalVoterOnlyVoteEventId);
    cy.get("#internal-voters-header").should("be.visible");
    cy.get("#add-internal-voter-menu-button").should("be.visible");
  });

  it("Should only display external voters if only that is set", () => {
    navigateToTab(externalVoterOnlyVoteEventId);
    cy.get("#external-voters-header").should("be.visible");
    cy.get("#add-external-voter-menu-button").should("be.visible");
  });

  it("Should display internal and external voters if both are set", () => {
    navigateToTab(voteEventWithVotersId);
    cy.get("#open-voter-management-config-button").should("be.visible");

    cy.get("#voter-list-tabs").should("be.visible");
    cy.get("#add-internal-voter-menu-button").should("be.visible");
    cy.get("#internal-voter-table").should("be.visible");

    cy.get("#external-tab").click();

    cy.get("#add-external-voter-menu-button").should("be.visible");
    cy.get("#external-voter-table").should("be.visible");
  });

  it("Should be able to set voter management config for a new vote event", () => {
    cy.request("POST", "http://localhost:4000/api/vote-events", {
      voteEvent: {
        title: "Voter management tab test vote event",
        startTime: new Date("2022-12-11T12:00").toISOString(),
        endTime: new Date("2022-12-12T12:00").toISOString(),
      },
    }).then((response) => {
      voteEvent = response.body.voteEvent;
      navigateToTab(voteEvent.id);

      cy.get("#open-voter-management-config-button").click();
      cy.get("#internal-list-checkbox").check();
      cy.get("#confirm-edit-voter-management-config-button").click();

      cy.get("#success-alert").should("be.visible");
      cy.get("#edit-voter-management-config-modal").should("not.exist");
      cy.get("#internal-voters-header").should("be.visible");

      cy.request(
        "DELETE",
        `http://localhost:4000/api/vote-events/${voteEvent.id}`
      );
    });
  });

  it("Should be able to import internal voters by CSV", () => {
    cy.get("#add-internal-voter-menu-button").click();
    cy.get("#add-internal-voter-menu").should("be.visible");

    cy.contains("Import CSV").click();
    cy.get("#import-internal-voter-csv-modal").should("be.visible");

    cy.get("#upload-csv-drag-area").selectFile(
      {
        contents: Cypress.Buffer.from(
          "Email\nadmin@skylab.com\nmentor@skylab.com"
        ),
        fileName: "emails.csv",
      },
      {
        action: "drag-drop",
      }
    );

    cy.contains(
      "div",
      "2 rows successfully detected. Ready to add them?"
    ).should("be.visible");

    cy.get("#upload-csv-button").click();
    cy.get("#success-alert").should("be.visible");
    cy.get("#import-internal-voter-csv-modal").should("not.exist");
    cy.get("#add-internal-voter-menu").should("not.exist");

    cy.contains("admin@skylab.com").should("be.visible");
    cy.contains("mentor@skylab.com").should("be.visible");
  });

  it("Should be able to open registration and let internal voters register", () => {
    navigateToTab(internalVoterOnlyVoteEventId);
    cy.get("#open-registration-modal-button").click();
    cy.get("#internal-voter-registration-modal").should("be.visible");

    // set new start time
    cy.get("#registration-start-time-input").clear().type("2022-01-01T00:00");
    // set new end time
    cy.get("#registration-end-time-input").clear().type("2027-02-01T00:00");

    cy.get("#save-registration-period-button").click();
    cy.get("#success-alert").should("be.visible");

    cy.get("#nav-sign-out").click();

    // internal voter registers
    cy.login("adviser@skylab.com", "Password123");
    cy.visit(`http://localhost:3000/vote-events`);
    cy.get(
      `#register-vote-event-${internalVoterOnlyVoteEventId}-button`
    ).click();
    cy.get("#register-for-vote-event-modal").should("be.visible");
    cy.get("#register-for-vote-event-confirm-button").click();

    cy.get("#success-alert").should("be.visible");
    cy.get(
      `#register-vote-event-${internalVoterOnlyVoteEventId}-button`
    ).should("not.exist");

    cy.get("#nav-sign-out").click();

    // check that internal voter is added
    cy.login("admin@skylab.com", "Password123");
    navigateToTab(internalVoterOnlyVoteEventId);
    cy.contains("adviser@skylab.com").should("be.visible");

    // close registration
    cy.get("#open-registration-modal-button").click();
    // set new start time
    cy.get("#registration-start-time-input").clear().type("2022-01-01T00:00");
    // set new end time
    cy.get("#registration-end-time-input").clear().type("2022-02-01T00:00");

    cy.get("#save-registration-period-button").click();
    cy.get("#success-alert").should("be.visible");
  });

  it("Should be able to import external voters by CSV", () => {
    cy.get("#external-tab").click();
    cy.get("#add-external-voter-menu-button").click();
    cy.get("#add-external-voter-menu").should("be.visible");

    cy.contains("Import CSV").click();
    cy.get("#import-external-voter-csv-modal").should("be.visible");

    cy.get("#upload-csv-drag-area").selectFile(
      {
        contents: Cypress.Buffer.from(
          "Voter ID\nexternal-voter-id-2\nexternal-voter-id-3"
        ),
        fileName: "voter-ids.csv",
      },
      {
        action: "drag-drop",
      }
    );

    cy.contains(
      "div",
      "2 rows successfully detected. Ready to add them?"
    ).should("be.visible");

    cy.get("#upload-csv-button").click();
    cy.get("#success-alert").should("be.visible");
    cy.get("#import-external-voter-csv-modal").should("not.exist");
    cy.get("#add-external-voter-menu").should("not.exist");

    cy.contains("external-voter-id-2").should("be.visible");
    cy.contains("external-voter-id-3").should("be.visible");
  });

  it("Should be able to automatically generate external voter IDs", () => {
    cy.get("#external-tab").click();
    cy.get("#add-external-voter-menu-button").click();
    cy.get("#add-external-voter-menu").should("be.visible");

    cy.contains("Generate Voter IDs").click();
    cy.get("#external-voter-generation-modal").should("be.visible");

    cy.get("#voter-id-amount-input").type("5");
    cy.get("#voter-id-length-input").type("6");
    cy.get("#generate-voter-ids-button").click();

    cy.get("#success-alert").should("be.visible");
    cy.get("#generate-external-voter-ids-modal").should("not.exist");
    cy.get("#add-external-voter-menu").should("not.exist");

    cy.get("#external-voter-table")
      .find("tbody")
      .children()
      .should("have.length", 7);
  });

  it("Should be able to copy internal and external voters from another vote event", () => {
    cy.get("#open-voter-management-config-button").click();
    cy.get("#external-list-checkbox").check();
    cy.get("#internal-list-checkbox").check();

    cy.get("#copy-internal-voters-dropdown").click();
    cy.get(`#${voteEventWithVotersId}-option`).click();
    cy.get("#copy-external-voters-dropdown").click();
    cy.get(`#${voteEventWithVotersId}-option`).click();

    cy.get("#confirm-edit-voter-management-config-button").click();
    confirmEditConfig();

    // check if voters are copied
    cy.get("#internal-voter-table")
      .find("tbody")
      .children()
      .should("have.length", 603); // change length to number of seeded users

    cy.get("#external-tab").click();
    cy.get("#external-voter-table")
      .find("tbody")
      .children()
      .should("have.length", 1);
  });

  it("Should be able to edit existing voter management config", () => {
    cy.get("#open-voter-management-config-button").click();
    cy.get("#external-list-checkbox").check();
    cy.get("#internal-list-checkbox").uncheck();
    cy.get("#confirm-edit-voter-management-config-button").click();

    // confirm set config
    confirmEditConfig();

    // check if config is set
    cy.get("#external-voters-header").should("be.visible");
    cy.contains("No external voters found").should("be.visible");

    // reset config
    cy.get("#open-voter-management-config-button").click();
    cy.get("#internal-list-checkbox").check();
    cy.get("#external-list-checkbox").check();
    cy.get("#confirm-edit-voter-management-config-button").click();
    confirmEditConfig();
    cy.get("#voter-list-tabs").should("be.visible");
    cy.get("#internal-tab").click();
    cy.contains("No internal voters found").should("be.visible");
  });

  // student gets added to internal voters
  it("Should be able to add internal voters by email", () => {
    cy.get("#add-internal-voter-menu-button").click();
    cy.get("#add-internal-voter-menu").should("be.visible");

    cy.contains("Add By Email").click();
    cy.get("#add-internal-voter-modal").should("be.visible");

    cy.get("#email-input").type("student@skylab.com");
    cy.get("#add-internal-voter-button").click();

    cy.get("#success-alert").should("be.visible");
    cy.get("#add-internal-voter-modal").should("not.exist");
    cy.get("#add-internal-voter-menu").should("not.exist");
    cy.contains("student@skylab.com").should("be.visible");
    cy.contains("student@skylab.com")
      .parent()
      .find("td")
      .eq(0)
      .should("contain", "student@skylab.com");
    cy.contains("student@skylab.com")
      .parent()
      .find("td")
      .eq(1)
      .should("contain", "Student");
    cy.contains("student@skylab.com")
      .parent()
      .find("td")
      .eq(2)
      .should("contain", "Student");
  });

  it("Should not be able to add internal voter with a non existent email", () => {
    cy.get("#add-internal-voter-menu-button").click();
    cy.get("#add-internal-voter-menu").should("be.visible");

    cy.contains("Add By Email").click();
    cy.get("#add-internal-voter-modal").should("be.visible");

    cy.get("#email-input").type("nonexistent@email.com");
    cy.get("#add-internal-voter-button").click();

    cy.get("#error-alert").contains("User does not exist").should("be.visible");
    cy.get("#add-internal-voter-modal").should("be.visible");
  });

  it("Should not be able to add internal voter with a duplicate email", () => {
    cy.get("#add-internal-voter-menu-button").click();
    cy.get("#add-internal-voter-menu").should("be.visible");

    cy.contains("Add By Email").click();
    cy.get("#add-internal-voter-modal").should("be.visible");

    cy.get("#email-input").type("student@skylab.com");
    cy.get("#add-internal-voter-button").click();

    cy.get("#error-alert")
      .contains("User is already part of the vote event")
      .should("be.visible");
    cy.get("#add-internal-voter-modal").should("be.visible");
  });

  it("Should be able to add external voter ID", () => {
    cy.get("#external-tab").click();
    cy.get("#add-external-voter-menu-button").click();
    cy.get("#add-external-voter-menu").should("be.visible");

    cy.contains("Add Voter ID").click();
    cy.get("#add-external-voter-modal").should("be.visible");

    cy.get("#voterId-input").type("external-voter-id");
    cy.get("#add-external-voter-button").click();

    cy.get("#success-alert").should("be.visible");
    cy.get("#add-external-voter-modal").should("not.exist");
    cy.get("#add-external-voter-menu").should("not.exist");
    cy.contains("external-voter-id").should("be.visible");
  });

  it("Should not be able to add external voter with a duplicate ID", () => {
    cy.get("#external-tab").click();
    cy.get("#add-external-voter-menu-button").click();
    cy.get("#add-external-voter-menu").should("be.visible");

    cy.contains("Add Voter ID").click();
    cy.get("#add-external-voter-modal").should("be.visible");

    cy.get("#voterId-input").type("external-voter-id");
    cy.get("#add-external-voter-button").click();

    cy.get("#error-alert")
      .contains("External voter is already part of the vote event")
      .should("be.visible");
    cy.get("#add-external-voter-modal").should("be.visible");
  });

  it("Should be able to delete an internal voter", () => {
    cy.contains("Delete").click();
    cy.get("#delete-internal-voter-modal").should("be.visible");
    cy.get("#delete-internal-voter-confirm-button").click();

    cy.get("#success-alert").should("be.visible");
    cy.get("#delete-internal-voter-modal").should("not.exist");
    cy.contains("No internal voters found").should("be.visible");
  });

  it("Should be able to delete an external voter", () => {
    cy.get("#external-tab").click();
    cy.contains("Delete").click();
    cy.get("#delete-external-voter-modal").should("be.visible");
    cy.get("#delete-external-voter-confirm-button").click();

    cy.get("#success-alert").should("be.visible");
    cy.get("#delete-external-voter-modal").should("not.exist");
    cy.contains("No external voters found").should("be.visible");
  });
});
