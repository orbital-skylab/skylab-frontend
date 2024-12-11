/* eslint-disable @typescript-eslint/no-explicit-any */
import ResultsTab from "@/components/tabs/voteEvent/ResultsTab/ResultsTab";
import { DEFAULT_RESULTS_FILTER } from "@/helpers/voteEvent";
import { LEVELS_OF_ACHIEVEMENT } from "@/types/projects";
import { VoteEvent } from "@/types/voteEvents";
import { mount } from "cypress/react18";

describe("<ResultsTab />", () => {
  let mutateSpy: any;
  const voteEvent: VoteEvent = {
    id: 1,
    title: "Vote Event 1",
    startTime: "2022-01-01T00:00:00Z",
    endTime: "2022-01-02T00:00:00Z",
    resultsFilter: DEFAULT_RESULTS_FILTER,
  };

  const vote = {
    id: 1,
    projectId: 1,
    userId: null,
    voteEventId: voteEvent.id,
    externalVoterId: null,
    project: {
      id: 1,
      name: "Project 1",
      achievement: "Artemis" as LEVELS_OF_ACHIEVEMENT,
      cohortYear: 2024,
      proposalPdf: "https://www.google.com",
      posterUrl: "https://loremflickr.com/640/480",
      videoUrl: "https://www.youtube.com/watch?v=6n3pFFPSlW4",
      teamName: "Team 1",
      hasDropped: false,
      students: [],
    },
    internalVoter: null,
  };

  const votes = [
    {
      ...vote,
      userId: 1,
      internalVoter: {
        id: 1,
        name: "Internal Voter",
        email: "test@email.com",
      },
    },
    {
      ...vote,
      id: 2,
      userId: 2,
      internalVoter: {
        id: 2,
        name: "Internal Voter 2",
        email: "test2@email.com",
      },
    },
    {
      ...vote,
      id: 3,
      externalVoterId: "External Voter",
    },
  ];

  beforeEach(() => {
    mutateSpy = cy.spy().as("mutateSpy");
    cy.intercept("GET", `/api/vote-events/${voteEvent.id}/votes/all`, {
      statusCode: 200,
      body: {
        votes: votes,
      },
    }).as("votesRequest");
  });

  it("should render the component with results table, publish results button and role weights button", () => {
    mount(<ResultsTab voteEvent={voteEvent} mutate={mutateSpy} />);

    // Check if the header is rendered
    cy.get("#results-header").should("be.visible");

    // Check if results table is rendered
    cy.wait("@votesRequest");
    cy.get("#results-table").should("be.visible");

    // Check if publish results button is rendered
    cy.get("#publish-results-modal-button").should("be.visible");

    // Check if the role weights button is rendered
    cy.get("#role-weights-modal-button").should("be.visible");
  });

  it("should open the publish results modal when the publish results button is clicked", () => {
    mount(<ResultsTab voteEvent={voteEvent} mutate={mutateSpy} />);

    cy.get("#publish-results-modal-button").click();
    cy.contains("Publish Results").should("be.visible");
  });

  it("should open the role weights modal when the role weights button is clicked", () => {
    mount(<ResultsTab voteEvent={voteEvent} mutate={mutateSpy} />);

    cy.get("#role-weights-modal-button").click();
    cy.contains("Role Weights").should("be.visible");
  });
});
