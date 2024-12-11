/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import DeleteCandidateModal from "./DeleteCandidateModal";
import { mount } from "cypress/react18";
import { Project } from "@/types/projects";

describe("<DeleteCandidateModal />", () => {
  let setOpenSpy: any;
  let mutateSpy: any;
  let candidate: Project;
  const voteEventId = 1;

  beforeEach(() => {
    setOpenSpy = cy.spy().as("setOpenSpy");
    mutateSpy = cy.spy().as("mutateSpy");
    cy.fixture("projects").then((projects) => {
      candidate = projects.mockProject1;
    });
  });

  it("should render opened modal", function () {
    // Mount the component
    mount(
      <DeleteCandidateModal
        voteEventId={voteEventId}
        candidate={candidate}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#delete-candidate-confirm-button").should("exist");
  });

  it("should render closed modal", function () {
    // Mount the component
    mount(
      <DeleteCandidateModal
        voteEventId={voteEventId}
        candidate={candidate}
        open={false}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#delete-candidate-confirm-button").should("not.exist");
  });

  it("should delete candidate on confirmation and close the modal", function () {
    // Mount the component
    mount(
      <DeleteCandidateModal
        voteEventId={voteEventId}
        candidate={candidate}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Intercept DELETE request
    cy.intercept(
      "DELETE",
      `/api/vote-events/${voteEventId}/candidates/${candidate.id}`,
      {
        statusCode: 200,
        body: {},
      }
    ).as("deleteCandidate");

    // Click delete button
    cy.get("#delete-candidate-confirm-button").click();

    cy.wait("@deleteCandidate");

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
    cy.get("@mutateSpy").should("be.calledOnce");
  });

  it("should not delete candidate on cancellation and close the modal", function () {
    // Mount the component
    mount(
      <DeleteCandidateModal
        voteEventId={voteEventId}
        candidate={candidate}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Click cancel button
    cy.get("#delete-candidate-cancel-button").click();

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
    cy.get("@mutateSpy").should("not.be.called");
  });
});
