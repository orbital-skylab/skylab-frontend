/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import AddInternalVoterModalItem from "./AddInternalVoterModalItem";
import { mount } from "cypress/react18";

describe("<AddInternalVoterModalItem />", () => {
  let handleCloseMenuSpy: any;
  let mutateInternalVotersSpy: any;
  const voteEventId = 1;

  beforeEach(() => {
    handleCloseMenuSpy = cy.spy().as("handleCloseMenuSpy");
    mutateInternalVotersSpy = cy.spy().as("mutateInternalVotersSpy");
  });

  it("should open the modal when menu item is clicked", () => {
    // Mount the component
    mount(
      <AddInternalVoterModalItem
        voteEventId={voteEventId}
        handleCloseMenu={handleCloseMenuSpy}
        mutateInternalVoters={mutateInternalVotersSpy}
      />
    );

    // Click on the menu item
    cy.contains("Add By Email").click();

    // Assert that the modal is opened
    cy.get("body").should("contain", "Add By Email");
  });
});
