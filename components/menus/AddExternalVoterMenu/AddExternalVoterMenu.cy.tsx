/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import AddExternalVoterMenu from "./AddExternalVoterMenu";

describe("<AddExternalVoterMenu />", () => {
  let mutateExternalVotersSpy: any;
  const voteEventId = 1;
  const additionalOptions = [
    {
      configName: "hasExternalCsvImport",
      label: "Import CSV",
    },
    {
      configName: "hasGeneration",
      label: "Generate Voter IDs",
    },
  ];
  const voterManagement = {
    hasInternalCsvImport: false, // don't care
    hasRegistration: false, // don't care
    isRegistrationOpen: false, // don't care
    hasExternalCsvImport: false,
    hasGeneration: false,
    hasInternalList: true, // don't care
    hasExternalList: false, // don't care
  };

  beforeEach(() => {
    mutateExternalVotersSpy = cy.spy().as("mutateExternalVotersSpy");
  });

  const openMenuAndAssertItems = (
    voterManagement: any,
    expectedItems: string[]
  ) => {
    mount(
      <AddExternalVoterMenu
        voteEventId={voteEventId}
        voterManagement={voterManagement}
        mutate={mutateExternalVotersSpy}
      />
    );

    // Click on the button to open the menu
    cy.get("#add-external-voter-button").click();

    // Assert that the menu is opened
    cy.get("#add-external-voter-menu").should("be.visible");

    // Assert the presence of expected items
    expectedItems.forEach((item) => {
      cy.contains(item).should("be.visible");
    });

    // Assert spies are not called
    cy.get("@mutateExternalVotersSpy").should("not.have.been.called");
  };

  it("should open the menu with one item when button is clicked", () => {
    openMenuAndAssertItems(voterManagement, ["Add Voter ID"]);
  });

  additionalOptions.forEach((option) => {
    it(`should open the menu with two items when button is clicked and ${option.label} is visible`, () => {
      openMenuAndAssertItems(
        { ...voterManagement, [option.configName]: true },
        ["Add Voter ID", option.label]
      );
    });
  });

  it("should open the menu with three items when button is clicked and hasInternalCsvImport and hasRegistration are true", () => {
    openMenuAndAssertItems(
      { ...voterManagement, hasExternalCsvImport: true, hasGeneration: true },
      ["Add Voter ID", "Import CSV", "Generate Voter IDs"]
    );
  });
});
