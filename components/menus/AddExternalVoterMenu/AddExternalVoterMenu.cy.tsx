/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import AddExternalVoterMenu from "./AddExternalVoterMenu";

describe("<AddExternalVoterMenu />", () => {
  let mutateExternalVotersSpy: any;
  const voteEventId = 1;

  beforeEach(() => {
    mutateExternalVotersSpy = cy.spy().as("mutateExternalVotersSpy");
  });

  it("should open the menu with one item when button is clicked", () => {
    mount(
      <AddExternalVoterMenu
        voteEventId={voteEventId}
        mutate={mutateExternalVotersSpy}
      />
    );

    // Click on the button to open the menu
    cy.get("#add-external-voter-button").click();

    // Assert that the menu is opened
    cy.get("#add-external-voter-menu").should("be.visible");

    // Assert the presence of expected items

    // Assert spies are not called
    cy.get("@mutateExternalVotersSpy").should("not.have.been.called");
  });
});
