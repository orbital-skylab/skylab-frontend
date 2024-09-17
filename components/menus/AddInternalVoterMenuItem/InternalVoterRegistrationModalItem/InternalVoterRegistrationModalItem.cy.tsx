/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import InternalVoterRegistrationModalItem from "./InternalVoterRegistrationModalItem";
import { DEFAULT_REGISTRATION_PERIOD } from "@/helpers/voteEvent";

describe("<InternalVoterRegistrationModalItem />", () => {
  let handleCloseMenuSpy: any;
  let mutateVoteEventSpy: any;
  const voteEventId = 1;
  const voterManagement = {
    hasInternalList: true,
    hasExternalList: false,
    ...DEFAULT_REGISTRATION_PERIOD,
  };

  beforeEach(() => {
    handleCloseMenuSpy = cy.spy().as("handleCloseMenuSpy");
    mutateVoteEventSpy = cy.spy().as("mutateVoteEventSpy");
  });

  it("should open the modal when menu item is clicked", () => {
    // Mount the component
    mount(
      <InternalVoterRegistrationModalItem
        voteEventId={voteEventId}
        voterManagement={voterManagement}
        handleCloseMenu={handleCloseMenuSpy}
        mutateVoteEvent={mutateVoteEventSpy}
      />
    );

    // Click on the menu item
    cy.contains("Registration").click();

    // Assert that the modal is opened
    cy.get("#internal-voter-registration-modal").should("be.visible");
  });
});
