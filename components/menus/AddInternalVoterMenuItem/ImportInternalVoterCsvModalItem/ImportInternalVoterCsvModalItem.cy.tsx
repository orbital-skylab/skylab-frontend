/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import ImportInternalVoterCsvModalItem from "./ImportInternalVoterCsvModalItem";

describe("<ImportInternalVoterCsvModalItem />", () => {
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
      <ImportInternalVoterCsvModalItem
        voteEventId={voteEventId}
        handleCloseMenu={handleCloseMenuSpy}
        mutateInternalVoters={mutateInternalVotersSpy}
      />
    );

    // Click on the menu item
    cy.contains("Import CSV").click();

    // Assert that the modal is opened
    cy.get("#import-internal-voter-csv-modal").should("be.visible");
  });
});
