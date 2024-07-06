/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import SetVoterManagementConfigModal from "./SetVoterManagementConfigModal";
import { mount } from "cypress/react18";
import { DEFAULT_RESULTS_FILTER } from "@/helpers/voteEvent";

describe("<SetVoterManagementConfigModal />", () => {
  let setOpenSpy: any;
  let setOpenPreviousSpy: any;
  let setVoterManagementSpy: any;
  const voteEvent = {
    id: 1,
    title: "Test Vote Event Title",
    startTime: "2022-01-01T00:00:00.000Z",
    endTime: "2022-03-01T23:59:59.000Z",
    resultsFilter: DEFAULT_RESULTS_FILTER,
  };
  const processedValues = { voteEvent: voteEvent };

  beforeEach(() => {
    setOpenSpy = cy.spy().as("setOpenSpy");
    setOpenPreviousSpy = cy.spy().as("setOpenPreviousSpy");
    setVoterManagementSpy = cy.spy().as("setVoterManagementSpy");
  });

  it("should render opened modal", () => {
    // Mount the component
    mount(
      <SetVoterManagementConfigModal
        open={true}
        processedValues={processedValues}
        setOpen={setOpenSpy}
        setOpenPrevious={setOpenPreviousSpy}
        setVoterManagement={setVoterManagementSpy}
      />
    );

    cy.get("#set-voter-management-config-modal-confirm-button").should("exist");
  });

  it("should render closed modal", () => {
    // Mount the component
    mount(
      <SetVoterManagementConfigModal
        open={false}
        processedValues={processedValues}
        setOpen={setOpenSpy}
        setOpenPrevious={setOpenPreviousSpy}
        setVoterManagement={setVoterManagementSpy}
      />
    );

    cy.get("#set-voter-management-config-modal-confirm-button").should(
      "not.exist"
    );
  });

  it("should call setVoterManagement on confirmation", () => {
    // Mount the component
    mount(
      <SetVoterManagementConfigModal
        open={true}
        processedValues={processedValues}
        setOpen={setOpenSpy}
        setOpenPrevious={setOpenPreviousSpy}
        setVoterManagement={setVoterManagementSpy}
      />
    );

    // Click confirm button
    cy.get("#set-voter-management-config-modal-confirm-button").click();

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setVoterManagementSpy").should("be.calledOnce");
  });

  // TODO: Test return button
  it("should call setOpen and setOpenPrevious on cancel", () => {
    // Mount the component
    mount(
      <SetVoterManagementConfigModal
        open={true}
        processedValues={processedValues}
        setOpen={setOpenSpy}
        setOpenPrevious={setOpenPreviousSpy}
        setVoterManagement={setVoterManagementSpy}
      />
    );

    // Click cancel button
    cy.get("#set-voter-management-config-modal-cancel-button").click();

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenPreviousSpy").should("be.calledOnce");
    cy.get("@setVoterManagementSpy").should("not.have.been.called");
  });
});
