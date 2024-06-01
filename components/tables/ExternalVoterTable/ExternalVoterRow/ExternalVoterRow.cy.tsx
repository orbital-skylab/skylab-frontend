/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import ExternalVoterRow from "./ExternalVoterRow";

describe("<ExternalVoterRow />", () => {
  let mutateSpy: any;
  const externalVoter = {
    id: "testID",
    voteEventId: 1,
  };

  beforeEach(() => {
    mutateSpy = cy.spy().as("mutateSpy");
  });

  it("should render the external voter row", () => {
    mount(
      <ExternalVoterRow externalVoter={externalVoter} mutate={mutateSpy} />
    );

    cy.get("tr").should("be.visible");
    cy.get("td").should("have.length", 2);
    cy.contains(externalVoter.id).should("be.visible");
    cy.get("#delete-external-voter-button").should("be.visible");
  });

  it("should open the delete modal when the delete button is clicked", () => {
    mount(
      <ExternalVoterRow externalVoter={externalVoter} mutate={mutateSpy} />
    );

    cy.get("#delete-external-voter-button").click();

    cy.contains("Delete External Voter").should("be.visible");
    cy.contains(externalVoter.id).should("be.visible");
  });
});
