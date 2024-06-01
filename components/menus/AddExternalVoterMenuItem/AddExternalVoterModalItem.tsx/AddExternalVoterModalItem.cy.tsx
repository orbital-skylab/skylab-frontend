/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import AddExternalVoterModalItem from "./AddExternalVoterModalItem";
import { mount } from "cypress/react18";

describe("<AddExternalVoterModalItem />", () => {
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
      <AddExternalVoterModalItem
        voteEventId={voteEventId}
        handleCloseMenu={handleCloseMenuSpy}
        mutateExternalVoters={mutateExternalVotersSpy}
      />
    );

    // Click on the menu item
    cy.contains("Add Voter ID").click();

    // Assert that the modal is opened
    cy.get("body").should("contain", "Add Voter ID");
  });
});
