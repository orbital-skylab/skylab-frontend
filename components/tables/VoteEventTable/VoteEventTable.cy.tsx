/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
import { DEFAULT_RESULTS_FILTER } from "@/helpers/voteEvent";
import { mount } from "cypress/react18";
import VoteEventTable from "./VoteEventTable";
import { AuthContext } from "@/contexts/useAuth";

describe("<VoteEventTable />", () => {
  let mutateSpy: any;
  const voteEvents = [
    {
      id: 1,
      title: "Sample Vote Event 1",
      startTime: "2024-06-01T08:00:00Z",
      endTime: "2024-06-02T08:00:00Z",
      resultsFilter: DEFAULT_RESULTS_FILTER,
    },
    {
      id: 2,
      title: "Sample Vote Event 2",
      startTime: "2024-06-03T08:00:00Z",
      endTime: "2024-06-04T08:00:00Z",
      resultsFilter: DEFAULT_RESULTS_FILTER,
    },
    {
      id: 3,
      title: "Sample Vote Event 3",
      startTime: "2024-07-03T08:00:00Z",
      endTime: "2024-08-04T08:00:00Z",
      resultsFilter: DEFAULT_RESULTS_FILTER,
    },
  ];

  const user = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    profilePicUrl: "https://example.com/profile-pic.jpg",
    githubUrl: "https://github.com/johndoe",
    linkedinUrl: "https://linkedin.com/in/johndoe",
    personalSiteUrl: "https://johndoe.com",
    selfIntro: "Hello, I'm John Doe!",
  };

  const mockValues = {
    user: user,
    isExternalVoter: false,
    isLoading: false,
    isPreviewMode: false,
    signIn: async () => {},
    signOut: async () => {},
    externalVoterSignIn: async () => {},
    externalVoterSignOut: async () => {},
    resetPassword: async () => {},
    changePassword: async () => {},
    previewSiteAs: () => {},
    stopPreview: () => {},
  };

  const assertCommonElements = () => {
    // Check column headings
    cy.get("thead").contains("Title").should("be.visible");
    cy.get("thead").contains("Start Time").should("be.visible");
    cy.get("thead").contains("End Time").should("be.visible");
    cy.get("thead").contains("Voter Actions").should("be.visible");

    // Check rows
    cy.get("tbody").find("tr").should("have.length", voteEvents.length);
    voteEvents.forEach((voteEvent) => {
      cy.get("tbody").contains(voteEvent.title).should("be.visible");
      cy.get("tbody")
        .contains(isoDateToLocaleDateWithTime(voteEvent.startTime))
        .should("be.visible");
      cy.get("tbody")
        .contains(isoDateToLocaleDateWithTime(voteEvent.endTime))
        .should("be.visible");
    });
  };

  beforeEach(() => {
    mutateSpy = cy.spy().as("mutateSpy");
  });

  it("should render the vote event table with correct headings and rows for non admins", () => {
    mount(
      <AuthContext.Provider value={mockValues}>
        <VoteEventTable voteEvents={voteEvents} mutate={mutateSpy} />
      </AuthContext.Provider>
    );

    assertCommonElements;
  });

  it("should render the vote event table with correct headings and rows for admins", () => {
    const adminUser = {
      ...user,
      administrator: {
        userId: 1,
        id: 1,
        startDate: "2022-06-01T08:00:00Z",
        endDate: "2024-06-01T08:00:00Z",
      },
    };

    const adminMockValues = {
      ...mockValues,
      user: adminUser,
    };

    mount(
      <AuthContext.Provider value={adminMockValues}>
        <VoteEventTable voteEvents={voteEvents} mutate={mutateSpy} />
      </AuthContext.Provider>
    );

    // Check admin headings
    cy.get("thead").contains("Admin Actions").should("exist");

    assertCommonElements();
  });
});
