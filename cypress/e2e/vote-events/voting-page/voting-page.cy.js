/* eslint-disable no-undef */

const assertError = (message) => {
  cy.get("#vote-event-title").should("not.exist");
  cy.contains(message).should("be.visible");
};

const navigateToVotingPage = (voteEventId) => {
  cy.visit(`http://localhost:3000/vote-events/${voteEventId}`);
  cy.get("#vote-event-title").should("be.visible");
};

const assertVotingPageCommonElements = (voteConfig) => {
  cy.contains(voteConfig?.instructions).should("be.visible");
  cy.contains(
    `Vote for a maximum of ${voteConfig?.maxVotes}, and minimum of ${voteConfig?.minVotes} projects.`
  ).should("be.visible");
  cy.get("#submit-votes-modal-button")
    .contains(
      `Votes: 0/${voteConfig?.maxVotes} (Minimum: ${voteConfig?.minVotes} Required)`
    )
    .should("exist");
};

const voteForCandidate = (candidateId) => {
  cy.get("#submit-votes-modal-button").should("be.visible");

  cy.get("#submit-votes-modal-button").click();
  cy.get("#submit-votes-modal").should("be.visible");
  cy.contains(`${candidateId}`).should("be.visible");
  cy.get("#submit-votes-button").click();

  cy.get("#success-alert").should("be.visible");
  cy.get("#submit-votes-modal").should("not.exist");
  cy.contains("Votes Submitted").should("be.visible");
  cy.contains(`${candidateId}`).should("be.visible");
};

const voteForCandidateBySelection = (candidateId) => {
  cy.get(`#candidate-${candidateId}-vote-button`).click();
  cy.get(`#candidate-${candidateId}-vote-button`).should("contain", "Voted");

  voteForCandidate(candidateId);
};

const voteForCandidateByInput = (candidateId) => {
  cy.get("#votes-input").type(`${candidateId}`);

  voteForCandidate(candidateId);
};

describe("Testing voting page", () => {
  const voteEventId = 5; // table view vote event to vote in (has candidates but no votes)
  const galleryViewVoteEventId = 11; // gallery view vote event to vote in (has candidates but no votes)
  const noDisplayVoteEventId = 12; // no display vote event to vote in (has candidates but no votes)
  const notYetStartedVoteEventId = 7; // vote event that has not started
  const inCompleteVoteEvent = 1; // vote event without vote config
  const completedVoteEvent = 9; // vote event that has ended
  const noVoterVoteEvent = 10; // vote event with no voters
  const nonExistenceVoteEventId = 9999999999; // vote event that does not exist
  let voteEvent = {};
  let votes = [];
  let candidates = [];
  let fullVotes = [];

  before(() => {
    cy.intercept(
      "GET",
      `/api/vote-events/${voteEventId}/votes?userId=*`,
      (req) => {
        delete req.headers["if-none-match"];
        req.continue((res) => {
          votes = res.body.votes;
        });
      }
    ).as("getVotes");
    cy.intercept("GET", `/api/vote-events/${voteEventId}`, (req) => {
      delete req.headers["if-none-match"];
      req.continue((res) => {
        voteEvent = res.body.voteEvent;
      });
    }).as("getVoteEvent");
    cy.intercept("GET", `/api/vote-events/${voteEventId}/candidates`, (req) => {
      delete req.headers["if-none-match"];
      req.continue((res) => {
        candidates = res.body.candidates;
      });
    }).as("getCandidates");

    cy.login("admin@skylab.com", "Password123");
  });

  after(() => {
    cy.get("#nav-sign-out").click();
  });

  it("Should be able to navigate to voting page from home page", () => {
    cy.visit("http://localhost:3000/");
    cy.get("#nav-vote-events").click();
    cy.location("pathname").should("include", "vote-events");
    cy.get(`#vote-event-${voteEventId}-vote-button`).click();

    // Check if the voting page is displayed
    cy.get("#vote-event-title").should("be.visible");
  });

  it("Should display the vote event details and candidates in table view", () => {
    navigateToVotingPage(voteEventId);

    const voteConfig = voteEvent.voteConfig;
    assertVotingPageCommonElements(voteConfig);

    cy.get("tbody").find("tr").should("have.length", candidates.length);
  });

  it("Should display the vote event details and candidates in gallery view", () => {
    navigateToVotingPage(galleryViewVoteEventId);

    const voteConfig = voteEvent.voteConfig;
    assertVotingPageCommonElements(voteConfig);

    cy.get("#voting-gallery-grid")
      .children()
      .should("have.length", candidates.length);
  });

  it("Should display the vote event details and candidates in no display view", () => {
    navigateToVotingPage(noDisplayVoteEventId);

    const voteConfig = voteEvent.voteConfig;
    assertVotingPageCommonElements(voteConfig);

    cy.get("#votes-input").should("be.visible");
  });

  it("Should be able to vote for a candidate in table view", () => {
    navigateToVotingPage(voteEventId);

    voteForCandidateBySelection(candidates[0].id);
  });

  it("Should be able to vote for a candidate in gallery view", () => {
    navigateToVotingPage(galleryViewVoteEventId);

    voteForCandidateBySelection(candidates[0].id);
  });

  it("Should be able to vote for a candidate in no display view", () => {
    navigateToVotingPage(noDisplayVoteEventId);

    voteForCandidateByInput(candidates[0].id);
  });

  it("Should display submitted votes if the user has already voted", () => {
    navigateToVotingPage(voteEventId);

    cy.contains("Votes Submitted").should("be.visible");
    votes.forEach((vote) => {
      cy.contains(`${vote.projectId}`).should("be.visible");
    });

    // delete the vote
    cy.intercept(
      "GET",
      `http://localhost:4000/api/vote-events/${voteEventId}/votes/all`,
      (req) => {
        delete req.headers["if-none-match"];
        req.continue((res) => {
          console.log(res);
          fullVotes = res.body.votes;
        });
      }
    ).as("getFullVotes");

    cy.visit(`http://localhost:3000/vote-events/${voteEventId}/edit`);
    cy.get(`#vote-config-tab`).click();

    cy.wait("@getFullVotes").then(() => {
      cy.get(`#delete-vote-${fullVotes[0].id}-button`).click();
    });

    cy.get("#delete-vote-modal").should("be.visible");
    cy.get("#delete-vote-confirm-button").click();

    cy.get("#success-alert").should("be.visible");
    cy.contains("No votes found").should("be.visible");
  });

  it("Should display a message if the vote event does not exist", () => {
    cy.visit(`http://localhost:3000/vote-events/${nonExistenceVoteEventId}`);
    assertError("No such vote event found!");
  });

  it("Should display a message if the vote event is not open", () => {
    // has not started
    cy.visit(`http://localhost:3000/vote-events/${notYetStartedVoteEventId}`);
    assertError("Vote event is not open!");

    // setup not done
    cy.visit(`http://localhost:3000/vote-events/${inCompleteVoteEvent}`);
    assertError("Vote event is not open!");

    // voting has ended
    cy.visit(`http://localhost:3000/vote-events/${completedVoteEvent}`);
    assertError("Vote event is not open!");
  });

  it("Should not be accessible to non voters", () => {
    const assertNoVoteEvent = (voteEvent) => {
      cy.visit(`http://localhost:3000/vote-events/${voteEvent}`);
      cy.contains("No such vote event found!").should("be.visible");
    };

    cy.get("#nav-sign-out").click();
    assertNoVoteEvent(noVoterVoteEvent);

    cy.login("student@skylab.com", "Password123");
    assertNoVoteEvent(noVoterVoteEvent);
    cy.get("#nav-sign-out").click();

    cy.externalVoterLogin("externalId123");
    assertNoVoteEvent(noVoterVoteEvent);
  });
});
