/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import DeleteInternalVoterModal from "./DeleteInternalVoterModal";
import { mount } from "cypress/react18";

describe("<DeleteInternalVoterModal />", () => {
  let setOpenSpy: any;
  let mutateSpy: any;
  const voteEventId = 1;

  // Mock internalVoter object
  const internalVoter = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    profilePicUrl: "https://example.com/profile-pic.jpg",
    githubUrl: "https://github.com/johndoe",
    linkedinUrl: "https://linkedin.com/in/johndoe",
    personalSiteUrl: "https://johndoe.com",
    selfIntro: "Hello, I'm John Doe!",
    student: {
      userId: 1,
      id: 1,
      cohortYear: 2022,
      projectId: 123,
      nusnetId: "e0123456",
      matricNo: "A0123456Z",
    },
  };

  beforeEach(() => {
    setOpenSpy = cy.spy().as("setOpenSpy");
    mutateSpy = cy.spy().as("mutateSpy");
  });

  it("should render opened modal", () => {
    // Mount the component
    mount(
      <DeleteInternalVoterModal
        voteEventId={voteEventId}
        internalVoter={internalVoter}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#delete-internal-voter-confirm-button").should("exist");
  });

  it("should render closed modal", () => {
    // Mount the component
    mount(
      <DeleteInternalVoterModal
        voteEventId={voteEventId}
        internalVoter={internalVoter}
        open={false}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#delete-internal-voter-confirm-button").should("not.exist");
  });

  it("should delete internal voter on confirmation", () => {
    // Mount the component
    mount(
      <DeleteInternalVoterModal
        voteEventId={voteEventId}
        internalVoter={internalVoter}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Intercept DELETE request
    cy.intercept(
      "DELETE",
      `/api/vote-events/${voteEventId}/voter-management/internal-voters/${internalVoter.id}`,
      {
        statusCode: 200,
        body: {},
      }
    ).as("deleteInternalVoter");

    // Click delete button
    cy.get("#delete-internal-voter-confirm-button").click();

    cy.wait("@deleteInternalVoter");

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
    cy.get("@mutateSpy").should("be.calledOnce");
  });

  it("should not delete internal voter on cancellation", () => {
    // Mount the component
    mount(
      <DeleteInternalVoterModal
        voteEventId={voteEventId}
        internalVoter={internalVoter}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Click cancel button
    cy.get("#delete-internal-voter-cancel-button").click();

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
  });
});
