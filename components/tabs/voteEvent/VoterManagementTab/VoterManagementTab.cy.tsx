/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import VoterManagementTab from "./VoterManagementTab";
import { DEFAULT_RESULTS_FILTER } from "@/helpers/voteEvent";

describe("<VoterManagementTab />", () => {
  let mutateSpy: any;
  const voteEvent = {
    id: 1,
    title: "test Vote Event",
    startTime: "2024-06-01T08:00:00Z",
    endTime: "2024-06-02T08:00:00Z",
    resultsFilter: DEFAULT_RESULTS_FILTER,
  };
  const voterManagement = {
    isRegistrationOpen: false,
    hasInternalList: false,
    hasExternalList: false,
  };

  const internalVoters = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      profilePicUrl: "https://example.com/profile-pic.jpg",
      githubUrl: "https://github.com/johndoe",
      linkedinUrl: "https://linkedin.com/in/johndoe",
      personalSiteUrl: "https://johndoe.com",
      selfIntro: "Hello, I'm John Doe!",
      student: {
        userId: 1,
        id: 1,
        cohortYear: 2022,
        projectId: 123,
        nusnetId: "e0123456",
        matricNo: "A0123456Z",
      },
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane.doe@example.com",
      profilePicUrl: "https://example.com/profile-pic.jpg",
      githubUrl: "https://github.com/janedoe",
      linkedinUrl: "https://linkedin.com/in/janedoe",
      personalSiteUrl: "https://janedoe.com",
      selfIntro: "Hello, I'm Jane Doe!",
      advisor: {
        userId: 2,
        id: 1,
        cohortYear: 2022,
        projectIds: [123],
        nusnetId: "e0123457",
        matricNo: "A0123457Z",
      },
      student: {
        userId: 2,
        id: 2,
        cohortYear: 2022,
        projectId: 456,
        nusnetId: "e0123457",
        matricNo: "A0123457Z",
      },
    },
    {
      id: 3,
      name: "Jason Doe",
      email: "jason.doe@example.com",
      profilePicUrl: "https://example.com/profile-pic.jpg",
      githubUrl: "https://github.com/jasondoe",
      linkedinUrl: "https://linkedin.com/in/jasondoe",
      personalSiteUrl: "https://jasondoe.com",
      selfIntro: "Hello, I'm Jason Doe!",
      mentor: {
        userId: 3,
        id: 1,
        cohortYear: 2022,
        projectIds: [456],
      },
    },
  ];
  const externalVoters = [
    { id: "VoterId1", voteEventId: 1 },
    { id: "VoterId2", voteEventId: 1 },
    { id: "VoterId3", voteEventId: 1 },
  ];

  beforeEach(() => {
    mutateSpy = cy.spy().as("mutateSpy");
    cy.intercept(
      "GET",
      `/api/vote-events/${voteEvent.id}/voter-management/internal-voters`,
      {
        statusCode: 200,
        body: { internalVoters: internalVoters },
      }
    ).as("internalVotersRequest");
    cy.intercept(
      "GET",
      `/api/vote-events/${voteEvent.id}/voter-management/external-voters`,
      {
        statusCode: 200,
        body: { externalVoters: externalVoters },
      }
    ).as("externalVotersRequest");
  });

  it("should render the component with correct UI elements if voter management has both internal and external lists", () => {
    const setVoterManagement = {
      ...voterManagement,
      hasInternalList: true,
      hasExternalList: true,
    };
    mount(
      <VoterManagementTab
        voteEvent={{ ...voteEvent, voterManagement: setVoterManagement }}
        mutate={mutateSpy}
      />
    );

    // Check if Management Config button is rendered
    cy.get("#open-voter-management-config-button").should("be.visible");

    // Check if tabs are rendered
    cy.get("#voter-list-tabs").should("be.visible");
    cy.get("#internal-tab").should("exist");
    cy.get("#external-tab").should("be.visible");

    // check if internal voter table is rendered
    cy.wait("@internalVotersRequest");
    cy.get("#internal-voter-table").should("be.visible");
    cy.contains(internalVoters[0].email).should("be.visible");

    // check if external voter table is rendered
    cy.wait("@externalVotersRequest");
    cy.get("#external-tab").click();
    cy.get("#external-voter-table").should("be.visible");
    cy.contains(externalVoters[0].id).should("be.visible");
  });

  it("should render the component with correct UI elements if voter management has internal list only", () => {
    const setVoterManagement = {
      ...voterManagement,
      hasInternalList: true,
    };
    mount(
      <VoterManagementTab
        voteEvent={{ ...voteEvent, voterManagement: setVoterManagement }}
        mutate={mutateSpy}
      />
    );

    // Check if Management Config button is rendered
    cy.get("#open-voter-management-config-button").should("be.visible");

    // Check if single header is rendered
    cy.get("#internal-voters-header").should("be.visible");
    cy.get("#external-voters-header").should("not.exist");

    cy.wait("@internalVotersRequest");
    cy.get("#internal-voter-table").should("be.visible");
    cy.contains(internalVoters[0].email).should("be.visible");
  });

  it("should render the component with correct UI elements if voter management has external list only", () => {
    const setVoterManagement = {
      ...voterManagement,
      hasExternalList: true,
    };
    mount(
      <VoterManagementTab
        voteEvent={{ ...voteEvent, voterManagement: setVoterManagement }}
        mutate={mutateSpy}
      />
    );

    // Check if Management Config button is rendered
    cy.get("#open-voter-management-config-button").should("be.visible");

    // Check if single header is rendered
    cy.get("#internal-voters-header").should("not.exist");
    cy.get("#external-voters-header").should("be.visible");

    cy.wait("@externalVotersRequest");
    cy.get("#external-voter-table").should("be.visible");
    cy.contains(externalVoters[0].id).should("be.visible");
  });

  it("should render the component with correct UI elements if voter management has not been set", () => {
    mount(<VoterManagementTab voteEvent={voteEvent} mutate={mutateSpy} />);

    // Check if Management Config button is rendered
    cy.get("#open-voter-management-config-button").should("be.visible");

    // Check if single header is rendered
    cy.get("#internal-voters-header").should("not.exist");
    cy.get("#external-voters-header").should("not.exist");
    cy.get("#internal-tab").should("not.exist");
    cy.get("#external-tab").should("not.exist");
  });

  it("should open the voter management config modal when button is clicked", () => {
    mount(<VoterManagementTab voteEvent={voteEvent} mutate={mutateSpy} />);

    // Click on Management Config button
    cy.get("#open-voter-management-config-button").click();

    // Check if modal is opened
    cy.contains("Edit Voter Management").should("be.visible");
  });

  it("should switch between internal and external voters when tabs are clicked", () => {
    const setVoterManagement = {
      ...voterManagement,
      hasInternalList: true,
      hasExternalList: true,
    };
    mount(
      <VoterManagementTab
        voteEvent={{ ...voteEvent, voterManagement: setVoterManagement }}
        mutate={mutateSpy}
      />
    );

    // Click on External Voters tab
    cy.get("#external-tab").click();

    // Check if External Voter Table is rendered
    cy.get("#external-voter-table").should("be.visible");

    // Click on Internal Voters tab
    cy.get("#internal-tab").click();

    // Check if Internal Voter Table is rendered
    cy.get("#internal-voter-table").should("be.visible");
  });
});
