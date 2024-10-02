/* eslint-disable @typescript-eslint/no-explicit-any */

import VotingGalleryGrid from "../VotingGalleryGrid";
import { FETCH_STATUS } from "../../../hooks/useFetch";
import { Project } from "../../../types/projects";
import { mount } from "cypress/react18";
import React from "react";

describe("<VotingGalleryGrid />", () => {
  const multiplier = 5;
  let setSelectedCandidatesSpy: any;
  let candidates: Project[];

  beforeEach(() => {
    setSelectedCandidatesSpy = cy.spy().as("setSelectedCandidatesSpy");
    cy.fixture("projects").then((projects) => {
      // duplicate the project based on the multiplier while changing its id
      candidates = Array.from({ length: multiplier }, (_, i) => {
        return {
          ...projects.mockProject1,
          id: projects.mockProject1.id + i,
        };
      });
    });
  });

  it("should display candidates correctly", () => {
    // Mount the component
    mount(
      <VotingGalleryGrid
        selectedCandidates={{}}
        status={FETCH_STATUS.FETCHED}
        candidates={candidates}
        isDisabled={false}
        setSelectedCandidates={setSelectedCandidatesSpy}
      />
    );

    cy.get("#voting-gallery-grid").children().should("have.length", multiplier);

    // assert each candidate
    candidates.forEach((candidate) => {
      cy.get(`#${candidate.id}-candidate-card`).should("be.visible");
      cy.contains(candidate.id).should("be.visible");
      cy.contains(candidate.teamName).should("be.visible");
    });
  });

  it("should display selected candidates correctly", () => {
    // Mount the component
    mount(
      <VotingGalleryGrid
        selectedCandidates={{
          [candidates[0].id]: true,
          [candidates[1].id]: true,
        }}
        status={FETCH_STATUS.FETCHED}
        candidates={candidates}
        isDisabled={false}
        setSelectedCandidates={setSelectedCandidatesSpy}
      />
    );

    cy.get("#voting-gallery-grid").children().should("have.length", multiplier);

    // assert selected candidates
    cy.get(`#candidate-${candidates[0].id}-vote-button`).should(
      "contain.text",
      "Voted"
    );
    cy.get(`#candidate-${candidates[1].id}-vote-button`).should(
      "contain.text",
      "Voted"
    );
  });

  it("should be loading when data is being fetched", () => {
    mount(
      <VotingGalleryGrid
        selectedCandidates={{}}
        status={FETCH_STATUS.FETCHING}
        candidates={candidates}
        isDisabled={false}
        setSelectedCandidates={setSelectedCandidatesSpy}
      />
    );

    cy.get("#loading-wrapper").should("exist");
  });

  it("should not display any candiate card if there is no data", () => {
    mount(
      <VotingGalleryGrid
        selectedCandidates={{}}
        status={FETCH_STATUS.FETCHED}
        candidates={[]}
        isDisabled={false}
        setSelectedCandidates={setSelectedCandidatesSpy}
      />
    );

    cy.contains("No candidates found").should("be.visible");
  });
});
