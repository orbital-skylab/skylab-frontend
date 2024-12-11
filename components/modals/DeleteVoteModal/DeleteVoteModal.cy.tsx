/* eslint-disable @typescript-eslint/no-explicit-any */
import { LEVELS_OF_ACHIEVEMENT } from "@/types/projects";
import { Vote } from "@/types/voteEvents";
import { mount } from "cypress/react18";
import DeleteVoteModal from "./DeleteVoteModal";

describe("<DeleteVoteModal />", () => {
  let setOpenSpy: any;
  let mutateSpy: any;
  const voteEventId = 1;

  // Mock vote object
  const vote: Vote = {
    id: 1,
    projectId: 1,
    userId: null,
    voteEventId: voteEventId,
    externalVoterId: "voterID",
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
    setOpenSpy = cy.spy().as("setOpenSpy");
    mutateSpy = cy.spy().as("mutateSpy");
  });

  it("should render opened modal", () => {
    // Mount the component
    mount(
      <DeleteVoteModal
        voteEventId={voteEventId}
        vote={vote}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#delete-vote-confirm-button").should("exist");
  });

  it("should render closed modal", () => {
    // Mount the component
    mount(
      <DeleteVoteModal
        voteEventId={voteEventId}
        vote={vote}
        open={false}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#delete-vote-confirm-button").should("not.exist");
  });

  it("should delete vote on confirmation and close the modal", () => {
    // Mount the component
    mount(
      <DeleteVoteModal
        voteEventId={voteEventId}
        vote={vote}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Intercept DELETE request
    cy.intercept("DELETE", `/api/vote-events/${voteEventId}/votes/${vote.id}`, {
      statusCode: 200,
      body: {},
    }).as("deleteVote");

    // Click delete button
    cy.get("#delete-vote-confirm-button").click();

    cy.wait("@deleteVote");

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
    cy.get("@mutateSpy").should("be.calledOnce");
  });

  it("should not delete vote on cancellation", () => {
    // Mount the component
    mount(
      <DeleteVoteModal
        voteEventId={voteEventId}
        vote={vote}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Click cancel button
    cy.get("#delete-vote-cancel-button").click();

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
  });
});
