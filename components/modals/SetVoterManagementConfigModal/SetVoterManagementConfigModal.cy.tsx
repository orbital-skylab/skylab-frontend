/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import SetVoterManagementConfigModal from "./SetVoterManagementConfigModal";

describe("<SetVoterManagementConfigModal />", () => {
  let setOpenSpy: any;
  let setOpenPreviousSpy: any;
  let setVoterManagementSpy: any;
  const voterManagement = {
    hasInternalList: true,
    hasExternalList: true,
    isRegistrationOpen: true,
  };
  const processedValues = { voterManagement };

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

  it("should set voter management on confirmation", () => {
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

  it("should have a functioning cancel button", () => {
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
