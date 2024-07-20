/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import AddExternalVoterMenu from "./AddExternalVoterMenu";

describe("<AddExternalVoterMenu />", () => {
  let mutateSpy: any;
  const voteEventId = 1;

  beforeEach(() => {
    mutateSpy = cy.spy().as("mutateSpy");
  });

  it("should open the menu when clicked", () => {
    mount(
      <AddExternalVoterMenu voteEventId={voteEventId} mutate={mutateSpy} />
    );

    // Click on the button to open the menu
    cy.get("#add-external-voter-menu-button").click();

    // Assert that the menu is opened
    cy.get("#add-external-voter-menu").should("be.visible");
    cy.contains("Add External Voter").should("be.visible");
    cy.contains("Import CSV").should("be.visible");
    cy.contains("Generate Voter IDs").should("be.visible");
  });
});
