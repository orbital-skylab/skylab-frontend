/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import AddInternalVoterMenu from "./AddInternalVoterMenu";

describe("<AddInternalVoterMenu />", () => {
  let mutateInternalVotersSpy: any;
  let mutateVoteEventSpy: any;
  const voteEventId = 1;
  const additionalOptions = [
    {
      configName: "hasInternalCsvImport",
      label: "Import CSV",
    },
    {
      configName: "hasRegistration",
      label: "Registration",
    },
  ];
  const voterManagement = {
    hasInternalCsvImport: false,
    hasRegistration: false,
    isRegistrationOpen: false, // don't care
    hasExternalCsvImport: false, // don't care
    hasGeneration: false, // don't care
    hasInternalList: true, // don't care
    hasExternalList: false, // don't care
  };

  beforeEach(() => {
    mutateInternalVotersSpy = cy.spy().as("mutateInternalVotersSpy");
    mutateVoteEventSpy = cy.spy().as("mutateVoteEventSpy");
  });

  const openMenuAndAssertItems = (
    voterManagement: any,
    expectedItems: string[]
  ) => {
    mount(
      <AddInternalVoterMenu
        voteEventId={voteEventId}
        voterManagement={voterManagement}
        mutateInternalVoters={mutateInternalVotersSpy}
        mutateVoteEvent={mutateVoteEventSpy}
      />
    );

    // Click on the button to open the menu
    cy.get("#add-internal-voter-button").click();

    // Assert that the menu is opened
    cy.get("#add-internal-voter-menu").should("be.visible");

    // Assert the presence of expected items
    expectedItems.forEach((item) => {
      cy.contains(item).should("be.visible");
    });

    // Assert spies are not called
    cy.get("@mutateInternalVotersSpy").should("not.have.been.called");
    cy.get("@mutateVoteEventSpy").should("not.have.been.called");
  };

  it("should open the menu with one item when button is clicked", () => {
    openMenuAndAssertItems(voterManagement, ["Add By Email"]);
  });

  additionalOptions.forEach((option) => {
    it(`should open the menu with two items when button is clicked and ${option.label} is visible`, () => {
      openMenuAndAssertItems(
        { ...voterManagement, [option.configName]: true },
        ["Add By Email", option.label]
      );
    });
  });

  it("should open the menu with three items when button is clicked and hasInternalCsvImport and hasRegistration are true", () => {
    openMenuAndAssertItems(
      { ...voterManagement, hasInternalCsvImport: true, hasRegistration: true },
      ["Add By Email", "Import CSV", "Registration"]
    );
  });
});
