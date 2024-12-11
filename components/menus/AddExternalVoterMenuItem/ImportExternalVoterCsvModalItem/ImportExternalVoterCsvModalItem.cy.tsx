/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import ImportExternalVoterCsvModalItem from "./ImportExternalVoterCsvModalItem";

describe("<ImportExternalVoterCsvModalItem />", () => {
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
      <ImportExternalVoterCsvModalItem
        voteEventId={voteEventId}
        handleCloseMenu={handleCloseMenuSpy}
        mutateExternalVoters={mutateExternalVotersSpy}
      />
    );

    // Click on the menu item
    cy.contains("Import CSV").click();

    // Assert that the modal is opened
    cy.get("#import-external-voter-csv-modal").should("be.visible");
  });
});
