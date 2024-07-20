/* eslint-disable no-undef */

const navigateToPage = () => {
  cy.intercept("GET", `/api/vote-events`).as("getVoteEvents");
  cy.visit(`http://localhost:3000/vote-events`);

  cy.wait("@getVoteEvents");
};

describe("Testing vote events page", () => {
  let createdVoteEventId = 0;

  before(() => {
    cy.login("admin@skylab.com", "Password123");
  });

  beforeEach(() => {
    navigateToPage();
  });

  after(() => {
    cy.get("#nav-sign-out").click();
  });

  it("Should navigate to vote events page from home page", () => {
    cy.visit("http://localhost:3000/");
    cy.get("#nav-vote-events").click();
    cy.location("pathname").should("include", "vote-events");

    // Check if the vote events page is active
    cy.get("#add-vote-event-modal-button").should("be.visible");
  });

  it("Should be able to add a vote event", () => {
    cy.intercept("POST", "/api/vote-events", (req) => {
      delete req.headers["if-none-match"];
      req.continue((res) => {
        createdVoteEventId = res.body.voteEvent.id;
      });
    });

    cy.get("#add-vote-event-modal-button").click();
    cy.get("#add-vote-event-modal").should("be.visible");

    cy.get("#add-vote-event-title-input").type(
      "Vote event by vote event page e2e"
    );
    cy.get("#add-vote-event-start-time-input").type("2022-12-11T12:00");
    cy.get("#add-vote-event-end-time-input").type("2022-12-12T12:00");
    cy.get("#add-vote-event-button").click();
    cy.get("#success-alert").should("be.visible");
  });

  it("Should display vote events", () => {
    cy.get("#vote-events-table").should("be.visible");

    cy.get("thead").find("th").should("have.length", 5);
    cy.get("thead").find("th").eq(0).should("contain", "Title");
    cy.get("thead").find("th").eq(1).should("contain", "Start Time");
    cy.get("thead").find("th").eq(2).should("contain", "End Time");
    cy.get("thead").find("th").eq(3).should("contain", "Status");
    cy.get("thead").find("th").eq(4).should("contain", "Actions");

    cy.contains("Vote event by vote event page e2e").should("be.visible");
    cy.contains("Vote event by vote event page e2e")
      .parent()
      .find("td")
      .eq(0)
      .should("contain", "Vote event by vote event page e2e");
    cy.contains("Vote event by vote event page e2e")
      .parent()
      .find("td")
      .eq(1)
      .should("contain", "11/12/2022, 12:00");
    cy.contains("Vote event by vote event page e2e")
      .parent()
      .find("td")
      .eq(2)
      .should("contain", "12/12/2022, 12:00");
    cy.contains("Vote event by vote event page e2e")
      .parent()
      .find("td")
      .eq(3)
      .should("contain", "Incomplete");
  });

  it("Should be able to edit a vote event", () => {
    cy.get(`#edit-vote-event-1-button`).click();
    cy.location("pathname").should("include", `vote-events/1/edit`);
  });

  it("Should be able to delete a vote event", () => {
    cy.get(`#delete-vote-event-${createdVoteEventId}-button`).click();
    cy.get("#delete-vote-event-modal").should("be.visible");
    cy.get("#delete-vote-event-confirm-button").click();
    cy.get("#success-alert").should("be.visible");

    cy.get("#vote-events-table").should("be.visible");
    cy.get("tbody")
      .contains("Vote event by vote event page e2e")
      .should("not.exist");
  });
});
