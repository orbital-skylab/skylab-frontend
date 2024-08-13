/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { mount } from "cypress/react18";
import VoteEventRow from "./VoteEventRow";
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
import { DISPLAY_TYPES } from "@/types/voteEvents";
import { DEFAULT_RESULTS_FILTER } from "@/helpers/voteEvent";
import { AuthContext } from "@/contexts/useAuth";

describe("<VoteEventRow />", () => {
  let mutateSpy: any;
  const voteEvent = {
    id: 1,
    title: "Sample Vote Event",
    startTime: "2014-06-01T08:00:00Z",
    endTime: "2094-06-02T08:00:00Z",
    voterManagement: {
      isRegistrationOpen: false,
      hasInternalList: true,
      hasExternalList: false,
    },
    voteConfig: {
      minVotes: 1,
      maxVotes: 1,
      displayType: DISPLAY_TYPES.TABLE,
      instructions: "Sample Instructions",
      isRandomOrder: false,
    },
    resultsFilter: DEFAULT_RESULTS_FILTER,
  };

  const user = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    profilePicUrl: "https://example.com/profile-pic.jpg",
    githubUrl: "https://github.com/johndoe",
    linkedinUrl: "https://linkedin.com/in/johndoe",
    personalSiteUrl: "https://johndoe.com",
    selfIntro: "Hello, I'm John Doe!",
    administrator: {
      userId: 1,
      id: 1,
      startDate: "2022-06-01T08:00:00Z",
      endDate: "2024-06-01T08:00:00Z",
    },
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

  beforeEach(() => {
    mutateSpy = cy.spy().as("mutateSpy");
  });

  const assertCommonElements = (startTime: string, endTime: string) => {
    cy.get("tr").should("be.visible");
    cy.get("td").should("have.length", 5);
    cy.contains("Sample Vote Event").should("be.visible");
    cy.contains(isoDateToLocaleDateWithTime(startTime)).should("be.visible");
    cy.contains(isoDateToLocaleDateWithTime(endTime)).should("be.visible");
    cy.get(`#edit-vote-event-${voteEvent.id}-button`).should("be.visible");
    cy.get(`#delete-vote-event-${voteEvent.id}-button`).should("be.visible");
  };

  it("should render the in progress vote event row", () => {
    mount(
      <AuthContext.Provider value={mockValues}>
        <VoteEventRow voteEvent={voteEvent} mutate={mutateSpy} />
      </AuthContext.Provider>
    );

    assertCommonElements(voteEvent.startTime, voteEvent.endTime);

    cy.contains("In Progress").should("be.visible");
    cy.get(`#vote-event-${voteEvent.id}-vote-button`).should(
      "have.attr",
      "href",
      `/vote-events/${voteEvent.id}`
    );
  });

  it("should render the incomplete vote event row", () => {
    mount(
      <AuthContext.Provider value={mockValues}>
        <VoteEventRow
          voteEvent={{ ...voteEvent, voteConfig: undefined }}
          mutate={mutateSpy}
        />
      </AuthContext.Provider>
    );

    assertCommonElements(voteEvent.startTime, voteEvent.endTime);

    cy.contains("Incomplete").should("be.visible");
    cy.get(`#vote-event-${voteEvent.id}-vote-button`).should("not.exist");
  });

  it("should render the upcoming vote event row", () => {
    mount(
      <AuthContext.Provider value={mockValues}>
        <VoteEventRow
          voteEvent={{ ...voteEvent, startTime: "2094-06-01T08:00:00Z" }}
          mutate={mutateSpy}
        />
      </AuthContext.Provider>
    );

    assertCommonElements("2094-06-01T08:00:00Z", voteEvent.endTime);

    cy.contains("Upcoming").should("be.visible");
    cy.get(`#vote-event-${voteEvent.id}-vote-button`).should("not.exist");
  });

  it("should render the completed vote event row", () => {
    mount(
      <AuthContext.Provider value={mockValues}>
        <VoteEventRow
          voteEvent={{ ...voteEvent, endTime: "2014-06-01T08:00:00Z" }}
          mutate={mutateSpy}
        />
      </AuthContext.Provider>
    );

    assertCommonElements(voteEvent.startTime, "2014-06-01T08:00:00Z");

    cy.contains("Completed").should("be.visible");
    cy.get(`#vote-event-${voteEvent.id}-vote-button`).should("not.exist");
  });

  it("should have an edit button with link", () => {
    mount(
      <AuthContext.Provider value={mockValues}>
        <VoteEventRow voteEvent={voteEvent} mutate={mutateSpy} />
      </AuthContext.Provider>
    );

    cy.get(`#edit-vote-event-${voteEvent.id}-button`).should(
      "have.attr",
      "href",
      `/vote-events/${voteEvent.id}/edit`
    );
  });

  it("should have a results button with link if results are published", () => {
    mount(
      <AuthContext.Provider value={mockValues}>
        <VoteEventRow
          voteEvent={{
            ...voteEvent,
            resultsFilter: {
              ...DEFAULT_RESULTS_FILTER,
              areResultsPublished: true,
            },
          }}
          mutate={mutateSpy}
        />
      </AuthContext.Provider>
    );

    cy.get(`#vote-event-${voteEvent.id}-results-button`).should(
      "have.attr",
      "href",
      `/vote-events/${voteEvent.id}/results`
    );
  });

  it("should have a register button if registration is open", () => {
    mount(
      <AuthContext.Provider value={mockValues}>
        <VoteEventRow
          voteEvent={{
            ...voteEvent,
            voterManagement: {
              ...voteEvent.voterManagement,
              isRegistrationOpen: true,
            },
          }}
          mutate={mutateSpy}
        />
      </AuthContext.Provider>
    );

    cy.get(`#register-vote-event-${voteEvent.id}-button`).should("be.visible");
    cy.get(`#vote-event-${voteEvent.id}-results-button`).should("not.exist");
    cy.get(`#vote-event-${voteEvent.id}-vote-button`).should("not.exist");
    cy.get(`#register-vote-event-${voteEvent.id}-button`).click();
    cy.get("#register-for-vote-event-modal").should("be.visible");
  });

  it("should not have edit and delete buttons if the user is not an admin", () => {
    mount(
      <AuthContext.Provider
        value={{
          ...mockValues,
          user: { ...mockValues.user, administrator: undefined },
        }}
      >
        <VoteEventRow voteEvent={voteEvent} mutate={mutateSpy} />
      </AuthContext.Provider>
    );

    cy.get(`#edit-vote-event-${voteEvent.id}-button`).should("not.exist");
    cy.get(`#delete-vote-event-${voteEvent.id}-button`).should("not.exist");
  });

  it("should open the delete modal when the delete button is clicked", () => {
    mount(
      <AuthContext.Provider value={mockValues}>
        <VoteEventRow voteEvent={voteEvent} mutate={mutateSpy} />
      </AuthContext.Provider>
    );

    cy.get(`#delete-vote-event-${voteEvent.id}-button`).click();

    cy.contains("Delete Vote Event").should("be.visible");
    cy.get("@mutateSpy").should("not.have.been.called");
  });
});
