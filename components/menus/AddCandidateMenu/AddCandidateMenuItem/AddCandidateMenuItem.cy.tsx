/* eslint-disable @typescript-eslint/no-explicit-any */
import AddCandidateMenuItem from "@/components/menus/AddCandidateMenu/AddCandidateMenuItem/AddCandidateMenuItem";
import { mount } from "cypress/react18";

describe("<AddCandidateMenuItem />", () => {
  let handleCloseMenuSpy: any;
  let mutateCandidatesSpy: any;
  const voteEventId = 1;

  beforeEach(() => {
    handleCloseMenuSpy = cy.spy().as("handleCloseMenuSpy");
    mutateCandidatesSpy = cy.spy().as("mutateCandidatesSpy");
  });

  it("should open the modal when menu item is clicked", () => {
    // Mount the component
    mount(
      <AddCandidateMenuItem
        voteEventId={voteEventId}
        handleCloseMenu={handleCloseMenuSpy}
        mutateCandidates={mutateCandidatesSpy}
      />
    );

    // Click on the menu item
    cy.contains("Add By Project ID").click();

    // Assert that the modal is opened
    cy.get("#add-candidate-button").should("exist");
  });
});
