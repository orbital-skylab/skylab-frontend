/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import VoteEventRow from "./VoteEventRow";
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
import { DISPLAY_TYPES } from "@/types/voteEvents";
import { DEFAULT_RESULTS_FILTER } from "@/helpers/voteEvent";

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

  beforeEach(() => {
    mutateSpy = cy.spy().as("mutateSpy");
  });

  const assertCommonElements = (startTime: string, endTime: string) => {
    cy.get("tr").should("be.visible");
    cy.get("td").should("have.length", 5);
    cy.contains("Sample Vote Event").should("be.visible");
    cy.contains(isoDateToLocaleDateWithTime(startTime)).should("be.visible");
    cy.contains(isoDateToLocaleDateWithTime(endTime)).should("be.visible");
    cy.get("#edit-vote-event-button").should("be.visible");
    cy.get("#delete-vote-event-button").should("be.visible");
  };

  it("should render the in progress vote event row", () => {
    mount(<VoteEventRow voteEvent={voteEvent} mutate={mutateSpy} />);

    assertCommonElements(voteEvent.startTime, voteEvent.endTime);

    cy.contains("In Progress").should("be.visible");
    cy.get("#vote-event-vote-button").should(
      "have.attr",
      "href",
      `/vote-events/${voteEvent.id}`
    );
  });

  it("should render the incomplete vote event row", () => {
    mount(
      <VoteEventRow
        voteEvent={{ ...voteEvent, voteConfig: undefined }}
        mutate={mutateSpy}
      />
    );

    assertCommonElements(voteEvent.startTime, voteEvent.endTime);

    cy.contains("Incomplete").should("be.visible");
    cy.get("#vote-event-vote-button").should("not.exist");
  });

  it("should render the upcoming vote event row", () => {
    mount(
      <VoteEventRow
        voteEvent={{ ...voteEvent, startTime: "2094-06-01T08:00:00Z" }}
        mutate={mutateSpy}
      />
    );

    assertCommonElements("2094-06-01T08:00:00Z", voteEvent.endTime);

    cy.contains("Upcoming").should("be.visible");
    cy.get("#vote-event-vote-button").should("not.exist");
  });

  it("should render the completed vote event row", () => {
    mount(
      <VoteEventRow
        voteEvent={{ ...voteEvent, endTime: "2014-06-01T08:00:00Z" }}
        mutate={mutateSpy}
      />
    );

    assertCommonElements(voteEvent.startTime, "2014-06-01T08:00:00Z");

    cy.contains("Completed").should("be.visible");
    cy.get("#vote-event-vote-button").should("not.exist");
  });

  it("should have an edit button with link", () => {
    mount(<VoteEventRow voteEvent={voteEvent} mutate={mutateSpy} />);

    cy.get("#edit-vote-event-button").should(
      "have.attr",
      "href",
      `/vote-events/${voteEvent.id}/edit`
    );
  });

  it("should open the delete modal when the delete button is clicked", () => {
    mount(<VoteEventRow voteEvent={voteEvent} mutate={mutateSpy} />);

    cy.get("#delete-vote-event-button").click();

    cy.contains("Delete Vote Event").should("be.visible");
    cy.get("@mutateSpy").should("not.have.been.called");
  });
});
