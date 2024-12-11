/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import ExternalVoterGenerationModalItem from "./ExternalVoterGenerationModalItem";

describe("<ExternalVoterGenerationModalItem />", () => {
  let handleCloseMenuSpy: any;
  let mutateExternalVotersSpy: any;
  const voteEventId = 1;

  beforeEach(() => {
    handleCloseMenuSpy = cy.spy().as("handleCloseMenuSpy");
    mutateExternalVotersSpy = cy.spy().as("mutateExternalVotersSpy");
  });

  it("should open the modal when menu item is clicked", () => {
    // Mount the component
    mount(
      <ExternalVoterGenerationModalItem
        voteEventId={voteEventId}
        handleCloseMenu={handleCloseMenuSpy}
        mutateExternalVoters={mutateExternalVotersSpy}
      />
    );

    // Click on the menu item
    cy.contains("Generate Voter IDs").click();

    // Assert that the modal is opened
    cy.get("#external-voter-generation-modal").should("be.visible");
  });
});
