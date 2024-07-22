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

  it("Should be able to edit existing voter management config", () => {
    const confirmEditConfig = () => {
      cy.get("#edit-voter-management-config-modal").should("not.exist");
      cy.get("#confirm-set-voter-management-config-modal").should("be.visible");
      cy.get("#set-voter-management-config-modal-confirm-button").click();

      cy.get("#success-alert").should("be.visible");
      cy.get("#confirm-set-voter-management-config-modal").should("not.exist");
    };

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
    cy.contains("No internal voters found").should("be.visible");
  });

  it("Should be able to add internal voters by email", () => {
    cy.get("#add-internal-voter-menu-button").click();
    cy.get("#add-internal-voter-menu").should("be.visible");

    cy.contains("Add Internal Voter").click();
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

  it("Should be able to add external voter ID", () => {
    cy.get("#external-tab").click();
    cy.get("#add-external-voter-menu-button").click();
    cy.get("#add-external-voter-menu").should("be.visible");

    cy.contains("Add External Voter").click();
    cy.get("#add-external-voter-modal").should("be.visible");

    cy.get("#voterId-input").type("external-voter-id");
    cy.get("#add-external-voter-button").click();

    cy.get("#success-alert").should("be.visible");
    cy.get("#add-external-voter-modal").should("not.exist");
    cy.get("#add-external-voter-menu").should("not.exist");
    cy.contains("external-voter-id").should("be.visible");
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

  // TODO: edge cases with database like non-existing emails and duplicate voters
});
