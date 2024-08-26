/* eslint-disable @typescript-eslint/no-explicit-any */
import VotingForm from "@/components/forms/VotingForm";
import { mount } from "cypress/react18";

describe("<VotingForm />", () => {
  let setSelectedCandidatesSpy: any;

  beforeEach(() => {
    setSelectedCandidatesSpy = cy.spy().as("setSelectedCandidatesSpy");
  });

  it("should render the correct elements", () => {
    // Mount the component
    mount(<VotingForm setSelectedCandidates={setSelectedCandidatesSpy} />);

    cy.get("#voting-form-description").should("be.visible");
    cy.get("#votes-input").should("be.visible");
  });

  it("should set selected candidates on change to text field", () => {
    // Mount the component
    mount(<VotingForm setSelectedCandidates={setSelectedCandidatesSpy} />);

    cy.get("#votes-input").type("1, 2, 3, 4, 5");

    cy.wrap(setSelectedCandidatesSpy).should("be.calledWith", {
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
    });
  });

  it("should only detect valid integers in the input", () => {
    // Mount the component
    mount(<VotingForm setSelectedCandidates={setSelectedCandidatesSpy} />);

    cy.get("#votes-input").type("0.1, 1, 2, 3,4,  5, a, @,, -1,");

    cy.wrap(setSelectedCandidatesSpy).should("be.calledWith", {
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
    });
  });
});
