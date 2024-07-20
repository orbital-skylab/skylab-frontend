/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import VoteRow from "./VoteRow";
import { LEVELS_OF_ACHIEVEMENT } from "@/types/projects";

describe("<VoteRow />", () => {
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

  beforeEach(() => {
    mutateSpy = cy.spy().as("mutateSpy");
  });

  const assertRowElements = (
    id: string,
    name: string,
    projectId: number,
    projectName: string,
    voteId: number
  ) => {
    cy.get("tr").should("be.visible");
    cy.get("td").should("have.length", 5);
    cy.contains(id).should("be.visible");
    cy.contains(name).should("be.visible");
    cy.contains(projectId).should("be.visible");
    cy.contains(projectName).should("be.visible");
    cy.get(`#delete-vote-${voteId}-button`).should("be.visible");
  };

  it("should render the vote row with an internal voter", () => {
    const internalVoterVote = {
      ...vote,
      userId: 1,
      internalVoter: {
        id: 1,
        name: "Internal Voter",
        email: "test@email.com",
      },
    };

    mount(
      <VoteRow
        voteEventId={voteEventId}
        vote={internalVoterVote}
        mutate={mutateSpy}
      />
    );

    assertRowElements(
      internalVoterVote.userId.toString(),
      internalVoterVote.internalVoter?.name,
      vote.project.id,
      vote.project.name,
      vote.id
    );
  });

  it("should render the vote row with an external voter", () => {
    const externalVoterVote = {
      ...vote,
      externalVoterId: "External Voter",
    };
    mount(
      <VoteRow
        voteEventId={voteEventId}
        vote={externalVoterVote}
        mutate={mutateSpy}
      />
    );

    assertRowElements(
      externalVoterVote.externalVoterId,
      "-",
      vote.project.id,
      vote.project.name,
      vote.id
    );
  });

  it("should open the delete modal when the delete button is clicked", () => {
    mount(<VoteRow voteEventId={voteEventId} vote={vote} mutate={mutateSpy} />);

    cy.get(`#delete-vote-${vote.id}-button`).click();

    cy.contains("Delete Vote").should("be.visible");
    cy.get("@mutateSpy").should("not.have.been.called");
  });
});
