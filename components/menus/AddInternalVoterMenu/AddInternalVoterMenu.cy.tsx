/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import AddInternalVoterMenu from "./AddInternalVoterMenu";

describe("<AddInternalVoterMenu />", () => {
  let mutateVoteEventSpy: any;
  let mutateInternalVotersSpy: any;
  const voteEventId = 1;
  const voterManagement = {
    isRegistrationOpen: false,
    hasInternalList: true,
    hasExternalList: false,
  };

  beforeEach(() => {
    mutateVoteEventSpy = cy.spy().as("mutateVoteEventSpy");
    mutateInternalVotersSpy = cy.spy().as("mutateInternalVotersSpy");
  });

  it("should open the menu when clicked", () => {
    mount(
      <AddInternalVoterMenu
        voteEventId={voteEventId}
        voterManagement={voterManagement}
        mutateVoteEvent={mutateVoteEventSpy}
        mutateInternalVoters={mutateInternalVotersSpy}
      />
    );

    // Click on the button to open the menu
    cy.get("#add-internal-voter-button").click();

    // Assert that the menu is opened
    cy.get("#add-internal-voter-menu").should("be.visible");
    cy.contains("Add Internal Voter").should("be.visible");
    cy.contains("Import CSV").should("be.visible");
    cy.contains("Registration").should("be.visible");
  });
});
