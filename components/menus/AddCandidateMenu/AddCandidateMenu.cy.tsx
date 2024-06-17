/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import AddCandidateMenu from "./AddCandidateMenu";

describe("<AddCandidateMenu />", () => {
  let mutateSpy: any;
  const voteEventId = 1;

  beforeEach(() => {
    mutateSpy = cy.spy().as("mutateSpy");
  });

  it("should open the menu when clicked", () => {
    mount(<AddCandidateMenu voteEventId={voteEventId} mutate={mutateSpy} />);

    // Click on the button to open the menu
    cy.get("#add-candidate-menu-button").click();

    // Assert that the menu is opened
    cy.get("#add-external-voter-menu").should("be.visible");
    cy.contains("Add Candidate").should("be.visible");
    cy.contains("Batch Add Candidates").should("be.visible");
  });
});
