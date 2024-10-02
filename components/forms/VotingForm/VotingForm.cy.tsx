/* eslint-disable @typescript-eslint/no-explicit-any */
import { LEVELS_OF_ACHIEVEMENT, Project } from "@/types/projects";
import VotingForm from "../VotingForm";
import { mount } from "cypress/react18";
import React from "react";

describe("<VotingForm />", () => {
  let setSelectedCandidatesSpy: any;
  const candidates: Project[] = [
    {
      id: 1,
      name: "Project 1",
      achievement: "Vostok" as LEVELS_OF_ACHIEVEMENT,
      cohortYear: 2023,
      proposalPdf: "https://www.google.com",
      posterUrl: "https://loremflickr.com/640/480",
      videoUrl: "https://www.youtube.com/watch?v=6n3pFFPSlW4",
      teamName: "Team 1",
      hasDropped: false,
      students: [],
    },
    {
      id: 2,
      name: "Project 2",
      achievement: "Vostok" as LEVELS_OF_ACHIEVEMENT,
      cohortYear: 2023,
      proposalPdf: "https://www.google.com",
      posterUrl: "https://loremflickr.com/640/480",
      videoUrl: "https://www.youtube.com/watch?v=6n3pFFPSlW4",
      teamName: "Team 2",
      hasDropped: false,
      students: [],
    },
    {
      id: 3,
      name: "Project 3",
      achievement: "Vostok" as LEVELS_OF_ACHIEVEMENT,
      cohortYear: 2023,
      proposalPdf: "https://www.google.com",
      posterUrl: "https://loremflickr.com/640/480",
      videoUrl: "https://www.youtube.com/watch?v=6n3pFFPSlW4",
      teamName: "Team 3",
      hasDropped: false,
      students: [],
    },
    {
      id: 4,
      name: "Project 4",
      achievement: "Vostok" as LEVELS_OF_ACHIEVEMENT,
      cohortYear: 2023,
      proposalPdf: "https://www.google.com",
      posterUrl: "https://loremflickr.com/640/480",
      videoUrl: "https://www.youtube.com/watch?v=6n3pFFPSlW4",
      teamName: "Team 4",
      hasDropped: false,
      students: [],
    },
    {
      id: 5,
      name: "Project 5",
      achievement: "Vostok" as LEVELS_OF_ACHIEVEMENT,
      cohortYear: 2023,
      proposalPdf: "https://www.google.com",
      posterUrl: "https://loremflickr.com/640/480",
      videoUrl: "https://www.youtube.com/watch?v=6n3pFFPSlW4",
      teamName: "Team 5",
      hasDropped: false,
      students: [],
    },
  ];

  beforeEach(() => {
    setSelectedCandidatesSpy = cy.spy().as("setSelectedCandidatesSpy");
  });

  it("should render the correct elements", () => {
    // Mount the component
    mount(
      <VotingForm
        setSelectedCandidates={setSelectedCandidatesSpy}
        candidates={candidates}
      />
    );

    cy.get("#voting-form-description").should("be.visible");
    cy.get("#votes-input").should("be.visible");
  });

  it("should set selected candidates on change to text field", () => {
    // Mount the component
    mount(
      <VotingForm
        setSelectedCandidates={setSelectedCandidatesSpy}
        candidates={candidates}
      />
    );

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
    mount(
      <VotingForm
        setSelectedCandidates={setSelectedCandidatesSpy}
        candidates={candidates}
      />
    );

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
