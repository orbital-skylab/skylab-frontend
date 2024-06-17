/* eslint-disable @typescript-eslint/no-explicit-any */
import CandidatesTab from "@/components/tabs/voteEvent/CandidatesTab/CandidatesTab";
import { mount } from "cypress/react18";

describe("<VoterManagementTab />", () => {
  let candidates: any;
  const voteEventId = 1;

  beforeEach(() => {
    cy.fixture("projects").then((projects) => {
      candidates = Object.values(projects);

      cy.intercept("GET", `/api/vote-events/${voteEventId}/candidates`, {
        statusCode: 200,
        body: { candidates: candidates },
      }).as("candidatesRequest");
    });
  });

  it("should render the component with candidates table and menu button", () => {
    mount(<CandidatesTab voteEventId={voteEventId} />);

    // Check if the header is rendered
    cy.get("#candidates-header").should("be.visible");

    // Check if candidates table is rendered
    cy.wait("@candidatesRequest");
    cy.get("#candidates-table").should("be.visible");

    // Check if correct number of rows are rendered
    cy.get("tbody").find("tr").should("have.length", candidates.length);

    // Check if Add Candidate menu button is rendered
    cy.get("#add-candidate-menu-button").should("be.visible");
  });
});
