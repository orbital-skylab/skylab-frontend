/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import ExternalVoterTable from "./ExternalVoterTable";
import { FETCH_STATUS } from "@/hooks/useFetch";

describe("<ExternalVoterTable />", () => {
  let mutateSpy: any;
  const externalVoters = [
    { id: "VoterId1", voteEventId: 1 },
    { id: "VoterId2", voteEventId: 1 },
    { id: "VoterId3", voteEventId: 1 },
  ];

  beforeEach(() => {
    mutateSpy = cy.spy().as("mutateSpy");
  });

  it("should render the external voter table with correct headings and rows", () => {
    mount(
      <ExternalVoterTable
        externalVoters={externalVoters}
        status={FETCH_STATUS.FETCHED}
        mutate={mutateSpy}
      />
    );

    cy.get("#search-external-voters").should("exist");

    // Check column headings
    cy.get("thead").contains("Voter ID").should("be.visible");
    cy.get("thead").contains("Actions").should("be.visible");

    // Check rows
    cy.get("tbody").find("tr").should("have.length", externalVoters.length);
    externalVoters.forEach((externalVoter) => {
      cy.get("tbody").contains(externalVoter.id).should("be.visible");
    });
  });

  it("should be loading when data is being fetched", () => {
    mount(
      <ExternalVoterTable
        externalVoters={externalVoters}
        status={FETCH_STATUS.FETCHING}
        mutate={mutateSpy}
      />
    );

    cy.get("#loading-wrapper").should("exist");
  });

  it("should not display any table if there is no data", () => {
    mount(
      <ExternalVoterTable
        externalVoters={[]}
        status={FETCH_STATUS.FETCHED}
        mutate={mutateSpy}
      />
    );

    cy.contains("No external voters found").should("be.visible");
  });

  it("should filter external voters based on search text", () => {
    mount(
      <ExternalVoterTable
        externalVoters={externalVoters}
        status={FETCH_STATUS.FETCHED}
        mutate={mutateSpy}
      />
    );

    // Search for a voter
    const searchText = externalVoters[0].id;
    cy.get("#search-external-voters").type(searchText);

    // Check if correct number of rows are rendered
    cy.get("tbody").find("tr").should("have.length", 1);
    cy.get("tbody").find("tr").contains(searchText);
  });
});
