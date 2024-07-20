/* eslint-disable no-undef */

const navigateToTab = (voteEventId) => {
  cy.intercept("GET", `/api/vote-events/${voteEventId}`).as("getVoteEvent");
  cy.visit(`http://localhost:3000/vote-events/${voteEventId}/edit`);

  cy.wait("@getVoteEvent");
  cy.get(`#candidates-tab`).click();
};

describe("Testing vote event candidates tab", () => {
  const voteEventId = 1; // vote event with no candidates
  let candidate = {};
  let candidatesAdded = [];

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
    cy.get(`#candidates-tab`).click();

    // Check if the candidates tab is active
    cy.get("#candidates-header").should("be.visible");
  });

  it("Should be able to add a single candidate by project ID", () => {
    cy.intercept(
      "POST",
      `/api/vote-events/${voteEventId}/candidates`,
      (req) => {
        delete req.headers["if-none-match"];
        req.continue((res) => {
          candidate = res.body.candidate;
        });
      }
    ).as("addCandidate");

    cy.get("#add-candidate-menu-button").click();
    cy.get("#add-candidate-menu").should("be.visible");

    cy.get("#add-candidate-menu-item-button").click();
    cy.get("#add-candidate-modal").should("be.visible");

    cy.get("#project-id-input").clear().type("1");
    cy.get("#add-candidate-button").click();

    cy.wait("@addCandidate").then(() => {
      cy.get("#success-alert").should("be.visible");
      cy.get("#add-candidate-modal").should("not.exist");
      cy.get("#add-candidate-menu").should("not.exist");
      cy.contains(candidate.name).should("be.visible");
    });
  });

  it("Should be able to display candidate details", () => {
    cy.get("#candidates-table").should("be.visible");
    cy.get("thead").find("th").should("have.length", 5);
    cy.get("thead").find("th").eq(0).should("contain", "Project ID");
    cy.get("thead").find("th").eq(1).should("contain", "Name");
    cy.get("thead").find("th").eq(2).should("contain", "Cohort");
    cy.get("thead").find("th").eq(3).should("contain", "Achievement");
    cy.get("thead").find("th").eq(4).should("contain", "Actions");

    cy.contains(candidate.name).should("be.visible");
    cy.contains(candidate.name)
      .parent()
      .find("td")
      .eq(0)
      .should("contain", candidate.id);
    cy.contains(candidate.name)
      .parent()
      .find("td")
      .eq(1)
      .should("contain", candidate.name);
    cy.contains(candidate.name)
      .parent()
      .find("td")
      .eq(2)
      .should("contain", candidate.cohortYear);
    cy.contains(candidate.name)
      .parent()
      .find("td")
      .eq(3)
      .should("contain", candidate.achievement);
  });

  it("Should be able to batch add candidates", () => {
    cy.intercept("GET", `/api/cohorts`).as("cohortsRequest");
    cy.intercept(
      "POST",
      `/api/vote-events/${voteEventId}/candidates/batch`,
      (req) => {
        delete req.headers["if-none-match"];
        req.continue((res) => {
          candidatesAdded = res.body.candidates;
        });
      }
    ).as("batchAddCandidates");
    cy.get("#add-candidate-menu-button").click();
    cy.get("#add-candidate-menu").should("be.visible");

    cy.contains("Batch Add Candidates").click();
    cy.get("#batch-add-candidate-modal").should("be.visible");

    cy.wait("@cohortsRequest");
    cy.get("#cohort-dropdown").click();
    cy.get(`#${candidate.cohortYear}-option`).click();
    cy.get("#achievement-dropdown").click();
    cy.get(`#${candidate.achievement}-option`).click();
    cy.get("#batch-add-candidate-button").click();

    cy.wait("@batchAddCandidates").then(() => {
      cy.get("#success-alert").should("be.visible");
      cy.get("#batch-add-candidates-modal").should("not.exist");
      cy.get("#add-candidate-menu").should("not.exist");

      cy.get("tbody").find("tr").should("have.length", candidatesAdded.length);
    });
  });

  it("Should be able to delete a candidate", () => {
    cy.get(`#delete-candidate-${candidate.id}-button`).click();
    cy.get("#delete-candidate-modal").should("be.visible");
    cy.get("#delete-candidate-confirm-button").click();

    cy.get("#success-alert").should("be.visible");
    cy.get("#delete-candidate-modal").should("not.exist");
    cy.get("tbody")
      .find("tr")
      .should("have.length", candidatesAdded.length - 1);
  });
});
