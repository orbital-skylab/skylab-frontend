/* eslint-disable no-undef */

const navigateToVoteEventsPage = () => {
  cy.intercept("GET", `/api/vote-events`).as("getVoteEvents");
  cy.visit(`http://localhost:3000/vote-events`);

  cy.wait("@getVoteEvents");
};

const isoDateToDateTimeLocalInput = (isoDate) => {
  const d = new Date(new Date(isoDate).getTime() + 480 * 60000);
  const formattedDate = d.toISOString().slice(0, 16);

  return formattedDate;
};

describe("Testing vote event general settings tab", () => {
  const voteEventId = 1; // Any vote event
  let voteEvent = {};

  const navigateToTab = (voteEventId) => {
    cy.intercept("GET", `/api/vote-events/${voteEventId}`, (req) => {
      delete req.headers["if-none-match"];
      req.continue((res) => {
        if (res.statusCode !== 200) {
          return;
        }
        voteEvent = res.body.voteEvent;
      });
    }).as("getVoteEvent");
    cy.visit(`http://localhost:3000/vote-events/${voteEventId}/edit`);

    cy.wait("@getVoteEvent");
    cy.get(`#general-settings-tab`).click();
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

  it("Should navigate to vote event general settings tab from home page", () => {
    cy.visit("http://localhost:3000/");
    cy.get("#nav-vote-events").click();
    cy.location("pathname").should("include", "vote-events");
    cy.get(`#edit-vote-event-${voteEventId}-button`).click();
    cy.location("pathname").should(
      "include",
      `vote-events/${voteEventId}/edit`
    );
    cy.get(`#general-settings-tab`).click();

    // Check if the general settings tab is active
    cy.get("#edit-vote-event-general-settings-button").should("be.visible");
  });

  it("Should populate form with current vote event values", () => {
    cy.get("#title-input").should("have.value", voteEvent.title);
    cy.get("#start-time-input").should(
      "have.value",
      isoDateToDateTimeLocalInput(voteEvent.startTime)
    );
    cy.get("#end-time-input").should(
      "have.value",
      isoDateToDateTimeLocalInput(voteEvent.endTime)
    );
  });

  it("Should be able to update vote event title, start time and end time", () => {
    const oldTitle = voteEvent.title;
    const oldStartTime = isoDateToDateTimeLocalInput(voteEvent.startTime);
    const oldEndTime = isoDateToDateTimeLocalInput(voteEvent.endTime);

    const newTitle = "Updated title";
    const newStartTime = "2022-11-11T12:00";
    const newEndTime = "2022-11-12T12:00";

    cy.get("#title-input").clear().type(newTitle);
    cy.get("#start-time-input").clear().type(newStartTime);
    cy.get("#end-time-input").clear().type(newEndTime);
    cy.get("#edit-vote-event-general-settings-button").click();
    cy.get("#success-alert").should("be.visible");

    // Check if the vote event is updated
    navigateToVoteEventsPage();
    cy.contains(newTitle).should("be.visible");
    cy.contains(newTitle).parent().find("td").eq(0).should("contain", newTitle);
    cy.contains(newTitle)
      .parent()
      .find("td")
      .eq(1)
      .should("contain", "11/11/2022, 12:00");
    cy.contains(newTitle)
      .parent()
      .find("td")
      .eq(2)
      .should("contain", "12/11/2022, 12:00");

    // Reset the vote event
    navigateToTab(voteEventId);
    cy.get("#title-input").clear().type(oldTitle);
    cy.get("#start-time-input").clear().type(oldStartTime);
    cy.get("#end-time-input").clear().type(oldEndTime);
    cy.get("#edit-vote-event-general-settings-button").click();
    cy.get("#success-alert").should("be.visible");
  });
});
