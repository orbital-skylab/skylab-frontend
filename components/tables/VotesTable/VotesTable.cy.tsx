/* eslint-disable @typescript-eslint/no-explicit-any */
import VotesTable from "@/components/tables/VotesTable/VotesTable";
import { FETCH_STATUS } from "@/hooks/useFetch";
import { LEVELS_OF_ACHIEVEMENT } from "@/types/projects";
import { mount } from "cypress/react18";

describe("<VotesTable />", () => {
  let mutateSpy: any;
  const voteEventId = 1;

  const vote = {
    id: 1,
    projectId: 1,
    userId: null,
    voteEventId: voteEventId,
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
      userId: 1,
      internalVoter: {
        id: 1,
        name: "Internal Voter",
        email: "test@email.com",
      },
    },
    {
      ...vote,
      externalVoterId: "External Voter",
    },
  ];

  beforeEach(() => {
    mutateSpy = cy.spy().as("mutateSpy");
  });

  it("should render the vote event table with correct headings and rows", () => {
    mount(
      <VotesTable
        voteEventId={voteEventId}
        votes={votes}
        status={FETCH_STATUS.FETCHED}
        mutate={mutateSpy}
      />
    );

    // Check column headings
    cy.get("thead").contains("Voter ID").should("be.visible");
    cy.get("thead").contains("Name").should("be.visible");
    cy.get("thead").contains("Project ID").should("be.visible");
    cy.get("thead").contains("Project Name").should("be.visible");
    cy.get("thead").contains("Actions").should("be.visible");

    // Check rows
    cy.get("tbody").find("tr").should("have.length", votes.length);
    votes.forEach((vote) => {
      if (vote.userId) {
        cy.get("tbody").contains(vote.userId).should("be.visible");
      }
      if (vote.internalVoter) {
        cy.get("tbody").contains(vote.internalVoter.name).should("be.visible");
      }
      if (vote.externalVoterId) {
        cy.get("tbody").contains(vote.externalVoterId).should("be.visible");
        cy.get("tbody").contains("-").should("be.visible");
      }
      cy.get("tbody").contains(vote.project.id).should("be.visible");
      cy.get("tbody").contains(vote.project.name).should("be.visible");
    });
  });

  it("should be loading when data is being fetched", () => {
    mount(
      <VotesTable
        voteEventId={voteEventId}
        votes={votes}
        status={FETCH_STATUS.FETCHING}
        mutate={mutateSpy}
      />
    );

    cy.get("#loading-wrapper").should("exist");
  });

  it("should not display any table if there is no data", () => {
    mount(
      <VotesTable
        voteEventId={voteEventId}
        votes={[]}
        status={FETCH_STATUS.FETCHED}
        mutate={mutateSpy}
      />
    );

    cy.contains("No votes found").should("be.visible");
  });
});
