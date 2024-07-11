/* eslint-disable @typescript-eslint/no-explicit-any */
import VoteConfigTab from "@/components/tabs/voteEvent/VoteConfigTab/VoteConfigTab";
import { DEFAULT_RESULTS_FILTER } from "@/helpers/voteEvent";
import { LEVELS_OF_ACHIEVEMENT } from "@/types/projects";
import { DISPLAY_TYPES } from "@/types/voteEvents";
import { mount } from "cypress/react18";

describe("<VoteConfigTab />", () => {
  let mutateSpy: any;
  const voteEvent = {
    id: 1,
    title: "Test Vote Event",
    startTime: "2022-01-01T00:00:00Z",
    endTime: "2122-01-02T00:00:00Z",
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
      body: { votes: votes },
    }).as("votesRequest");
  });

  it("should render with votes table and vote config button if vote config is set", () => {
    // Mount the component
    mount(
      <VoteConfigTab
        voteEvent={{
          ...voteEvent,
          voteConfig: {
            displayType: DISPLAY_TYPES.TABLE,
            minVotes: 2,
            maxVotes: 3,
            instructions: "vote instructions",
            isRandomOrder: true,
          },
        }}
        mutate={mutateSpy}
      />
    );

    // Check if the header is rendered
    cy.get("#votes-header").should("be.visible");

    // Check if results table is rendered
    cy.wait("@votesRequest");
    cy.get("#votes-table").should("be.visible");

    // Check if vote config button is rendered
    cy.get("#vote-config-modal-button").should("be.visible");
  });

  it("should render the component with correct UI elements if vote config has not been set", () => {
    // Mount the component
    mount(<VoteConfigTab voteEvent={voteEvent} mutate={mutateSpy} />);

    cy.get("#vote-config-modal-button").should("be.visible");

    cy.get("#votes-header").should("not.exist");
    cy.get("#votes-table").should("not.exist");
  });

  it("should open the vote config modal when the vote config button is clicked", () => {
    // Mount the component
    mount(
      <VoteConfigTab
        voteEvent={{
          ...voteEvent,
          voteConfig: {
            displayType: DISPLAY_TYPES.TABLE,
            minVotes: 2,
            maxVotes: 3,
            instructions: "vote instructions",
            isRandomOrder: true,
          },
        }}
        mutate={mutateSpy}
      />
    );

    // Click the vote config button
    cy.get("#vote-config-modal-button").click();

    // Check if the modal is open
    cy.contains("Vote Config").should("be.visible");
  });
});
