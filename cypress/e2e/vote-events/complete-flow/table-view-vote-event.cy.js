/* eslint-disable no-undef */

describe("Testing table view candidate display voting process", () => {
  const voterEmails = [
    "admin@skylab.com",
    "student@skylab.com",
    "mentor@skylab.com",
    "adviser@skylab.com",
  ];
  const title = "Table view vote event test title";
  const instructions = "Table view vote event test instructions";
  const voteCount = 3;
  const displayLimit = 3;
  let voteEvent = {};
  let candidate = {};
  let candidatesAdded = [];

  before(() => {
    cy.intercept("POST", "/api/vote-events", (req) => {
      delete req.headers["if-none-match"];
      req.continue((res) => {
        voteEvent = res.body.voteEvent;
      });
    });

    cy.login("admin@skylab.com", "Password123");
  });

  after(() => {
    cy.get("#nav-sign-out").click();
  });

  it("Should be able to navigate to vote events page and add a vote event", () => {
    cy.visit("http://localhost:3000/");
    cy.get("#nav-vote-events").click();
    cy.location("pathname").should("include", "vote-events");

    cy.get("#add-vote-event-modal-button").click();
    cy.get("#add-vote-event-modal").should("be.visible");

    cy.get("#add-vote-event-title-input").type(
      "Table view vote event test title"
    );
    cy.get("#add-vote-event-start-time-input").type("2023-12-11T12:00");
    cy.get("#add-vote-event-end-time-input").type("2100-12-12T12:00");
    cy.get("#add-vote-event-button").click();
    cy.get("#success-alert").should("be.visible");
    cy.contains(title).should("be.visible");
  });

  it("Should be able to set voter management config and add voters to the vote event", () => {
    cy.get(`#edit-vote-event-${voteEvent.id}-button`).click();
    cy.get("#voter-management-tab").click();

    cy.get("#open-voter-management-config-button").click();
    cy.get("#edit-voter-management-config-modal").should("be.visible");

    cy.get("#internal-list-checkbox").check();
    cy.get("#external-list-checkbox").check();
    cy.get("#confirm-edit-voter-management-config-button").click();
    cy.get("#success-alert").should("be.visible");
    cy.contains("No internal voters found").should("be.visible");

    voterEmails.forEach((email) => {
      cy.get("#add-internal-voter-menu-button").click();
      cy.get("#add-internal-voter-menu").should("be.visible");

      cy.contains("Add Internal Voter").click();
      cy.get("#add-internal-voter-modal").should("be.visible");

      cy.get("#email-input").type(email);
      cy.get("#add-internal-voter-button").click();

      cy.get("#success-alert").should("be.visible");
      cy.get("#add-internal-voter-modal").should("not.exist");
      cy.get("#add-internal-voter-menu").should("not.exist");
      cy.contains(email).should("be.visible");
    });

    cy.get("#external-tab").click();
    cy.get("#add-external-voter-menu-button").click();
    cy.get("#add-external-voter-menu").should("be.visible");

    cy.contains("Add External Voter").click();
    cy.get("#add-external-voter-modal").should("be.visible");

    cy.get("#voterId-input").type("qwerty123");
    cy.get("#add-external-voter-button").click();

    cy.get("#success-alert").should("be.visible");
    cy.get("#add-external-voter-modal").should("not.exist");
    cy.get("#add-external-voter-menu").should("not.exist");
    cy.contains("qwerty123").should("be.visible");
  });

  it("Should be able to add candidates to the vote event", () => {
    cy.intercept(
      "POST",
      `/api/vote-events/${voteEvent.id}/candidates`,
      (req) => {
        delete req.headers["if-none-match"];
        req.continue((res) => {
          candidate = res.body.candidate;
        });
      }
    ).as("addCandidate");
    cy.intercept(
      "POST",
      `/api/vote-events/${voteEvent.id}/candidates/batch`,
      (req) => {
        delete req.headers["if-none-match"];
        req.continue((res) => {
          candidatesAdded = res.body.candidates;
        });
      }
    ).as("batchAddCandidates");

    cy.get("#candidates-tab").click();

    // add by project id
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

      // batch add
      cy.get("#add-candidate-menu-button").click();
      cy.contains("Batch Add Candidates").click();
      cy.get("#batch-add-candidate-modal").should("be.visible");

      cy.get("#cohort-dropdown").click();
      cy.get(`#${candidate.cohortYear}-option`).click();
      cy.get("#achievement-dropdown").click();
      cy.get(`#All-option`).click();
      cy.get("#batch-add-candidate-button").click();

      cy.wait("@batchAddCandidates").then(() => {
        cy.get("#success-alert").should("be.visible");
        cy.get("#batch-add-candidates-modal").should("not.exist");
        cy.get("#add-candidate-menu").should("not.exist");

        cy.get("tbody")
          .find("tr")
          .should("have.length", candidatesAdded.length);
      });
    });
  });

  it("Should be able to set vote config", () => {
    cy.get("#vote-config-tab").click();
    cy.get("#votes-header").should("not.exist");

    cy.get("#vote-config-modal-button").click();

    cy.get("#display-type-dropdown").click();
    cy.get(`#Table-option`).click();

    cy.get("#min-votes-input").clear().type(1);
    cy.get("#max-votes-input").clear().type(voteCount);
    cy.get("#random-order-checkbox").uncheck();
    cy.get("#instructions-input").clear().type(instructions);
    cy.get("#save-vote-config-button").click();

    cy.get("#success-alert").should("be.visible");
    cy.get("#votes-header").should("be.visible");
  });

  it("Should allow voters to vote in vote event", () => {
    cy.get("#nav-sign-out").click();

    let shift = 0;

    for (const email of voterEmails) {
      cy.login(email, "Password123");
      cy.visit("http://localhost:3000/");
      cy.get("#nav-vote-events").click();
      cy.get(`#vote-event-${voteEvent.id}-vote-button`).click();

      cy.contains(instructions).should("be.visible");
      cy.get("#candidates-table").should("be.visible");
      cy.get("tbody").find("tr").should("have.length", candidatesAdded.length);

      for (let i = 0; i < voteCount; i++) {
        cy.get(`#candidate-${candidatesAdded[i + shift].id}-vote-button`).click(
          { scrollBehavior: "center" }
        );
        cy.get(
          `#candidate-${candidatesAdded[i + shift].id}-vote-button`
        ).should("contain", "Voted");
      }

      cy.get("#submit-votes-modal-button").click();
      cy.get("#submit-votes-modal").should("be.visible");
      cy.get("#submit-votes-button").click();

      cy.get("#success-alert").should("be.visible");
      cy.get("#submit-votes-modal").should("not.exist");
      cy.contains("Votes Submitted").should("be.visible");
      for (let i = 0; i < 3; i++) {
        cy.contains(`${candidatesAdded[i + shift].id}`).should("be.visible");
      }

      shift++;
    }

    cy.get("#nav-sign-out").click();
  });

  it("Should allow administrator to view votes and results", () => {
    cy.login("admin@skylab.com", "Password123");
    cy.visit("http://localhost:3000/");
    cy.get("#nav-vote-events").click();
    cy.get(`#edit-vote-event-${voteEvent.id}-button`).click();
    cy.get("#vote-config-tab").click();

    cy.get("#votes-header").should("be.visible");
    cy.get("#votes-table").should("be.visible");
    cy.get("tbody")
      .find("tr")
      .should("have.length", voterEmails.length * voteCount);

    cy.get("#results-tab").click();
    cy.get("#results-header").should("be.visible");
    cy.get("#results-table").should("be.visible");
    cy.get("tbody")
      .find("tr")
      .should("have.length", voterEmails.length + voteCount - 1);
  });

  it("Should allow administrator modify weights and publish results", () => {
    cy.get("#role-weights-modal-button").click();
    cy.get("#administrator-weight-input")
      .should("have.value", "1")
      .clear()
      .type("5");
    cy.get("#mentor-weight-input").should("have.value", "1").clear().type("4");
    cy.get("#adviser-weight-input").should("have.value", "1").clear().type("3");
    cy.get("#student-weight-input").should("have.value", "1").clear().type("2");
    cy.get("#public-weight-input").should("have.value", "1").clear().type("1");
    cy.get("#save-role-weights-button").click();

    cy.get("#success-alert").should("be.visible");
    cy.get("#role-weights-modal").should("not.exist");

    cy.get("#publish-results-modal-button").click();
    cy.get("#publish-results-modal").should("be.visible");
    cy.get("#display-limit-input").clear().type(displayLimit);
    cy.get("#show-rank-checkbox").uncheck();
    cy.get("#show-votes-checkbox").check();
    cy.get("#show-points-checkbox").check();
    cy.get("#show-percentage-checkbox").check();
    cy.get("#publish-results-button").click();

    cy.get("#success-alert").should("be.visible");
    cy.get("#publish-results-modal").should("not.exist");
  });

  it("Should allow voters to view published results", () => {
    cy.get("#nav-sign-out").click();

    for (const email of voterEmails) {
      cy.login(email, "Password123");
      cy.visit("http://localhost:3000/");
      cy.get("#nav-vote-events").click();
      cy.get(`#vote-event-${voteEvent.id}-results-button`).click();

      cy.get("#results-header").should("be.visible");
      cy.get("#results-table").should("be.visible");
      cy.get("tbody").find("tr").should("have.length", displayLimit);
      cy.get("thead").find("th").should("have.length", 5);
      cy.get("thead").contains("Rank").should("not.exist");
    }

    cy.get("#nav-sign-out").click();
  });

  it("Should allow administrator to delete vote event", () => {
    cy.login("admin@skylab.com", "Password123");
    cy.visit("http://localhost:3000/");
    cy.get("#nav-vote-events").click();
    cy.get(`#delete-vote-event-${voteEvent.id}-button`).click();
    cy.get("#delete-vote-event-modal").should("be.visible");
    cy.get("#delete-vote-event-confirm-button").click();
    cy.get("#success-alert").should("be.visible");

    cy.get("tbody").contains(title).should("not.exist");
  });
});
