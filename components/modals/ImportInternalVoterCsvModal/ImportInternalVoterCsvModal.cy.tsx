/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ImportInternalVoterCsvModal from "./ImportInternalVoterCsvModal";
import { mount } from "cypress/react18";

describe("<ImportInternalVoterCsvModal />", () => {
  let setOpenSpy: any;
  let mutateSpy: any;
  let handleCloseMenuSpy: any;
  const voteEventId = 1;

  beforeEach(() => {
    setOpenSpy = cy.spy().as("setOpenSpy");
    mutateSpy = cy.spy().as("mutateSpy");
    handleCloseMenuSpy = cy.spy().as("handleCloseMenuSpy");
  });

  it("should render opened modal", () => {
    // Mount the component
    mount(
      <ImportInternalVoterCsvModal
        voteEventId={voteEventId}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#upload-csv-drag-area").should("exist");
  });

  it("should render closed modal", () => {
    // Mount the component
    mount(
      <ImportInternalVoterCsvModal
        voteEventId={voteEventId}
        open={false}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#upload-csv-drag-area").should("not.exist");
  });

  it("should have a functioning return button", () => {
    // Mount the component
    mount(
      <ImportInternalVoterCsvModal
        voteEventId={voteEventId}
        open={true}
        handleCloseMenu={handleCloseMenuSpy}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Click the return button
    cy.get("#import-internal-voter-csv-return-button").click();

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
    cy.get("@handleCloseMenuSpy").should("be.calledOnce");
  });
});
