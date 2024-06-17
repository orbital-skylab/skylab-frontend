/* eslint-disable @typescript-eslint/no-explicit-any */
import BatchAddCandidateMenuItem from "@/components/menus/AddCandidateMenu/BatchAddCandidateMenuItem";
import { mount } from "cypress/react18";

describe("<BatchAddCandidateMenuItem />", () => {
  let handleCloseMenuSpy: any;
  let mutateCandidatesSpy: any;
  const voteEventId = 1;

  beforeEach(() => {
    handleCloseMenuSpy = cy.spy().as("handleCloseMenuSpy");
    mutateCandidatesSpy = cy.spy().as("mutateCandidatesSpy");

    cy.intercept("GET", `/api/cohorts`, {
      statusCode: 200,
      body: {
        cohorts: [],
      },
    }).as("cohortsRequest");
  });

  it("should open the modal when menu item is clicked", () => {
    // Mount the component
    mount(
      <BatchAddCandidateMenuItem
        voteEventId={voteEventId}
        handleCloseMenu={handleCloseMenuSpy}
        mutateCandidates={mutateCandidatesSpy}
      />
    );

    // Click on the menu item
    cy.contains("Batch Add Candidates").click();

    // Assert that the modal is opened
    cy.get("#batch-add-candidate-button").should("exist");
  });
});
