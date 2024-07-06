/* eslint-disable @typescript-eslint/no-explicit-any */
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
import { DEFAULT_RESULTS_FILTER } from "@/helpers/voteEvent";
import { mount } from "cypress/react18";
import VoteEventTable from "./VoteEventTable";

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

  beforeEach(() => {
    mutateSpy = cy.spy().as("mutateSpy");
  });

  it("should render the vote event table with correct headings and rows", () => {
    mount(<VoteEventTable voteEvents={voteEvents} mutate={mutateSpy} />);

    // Check column headings
    cy.get("thead").contains("Title").should("be.visible");
    cy.get("thead").contains("Start Time").should("be.visible");
    cy.get("thead").contains("End Time").should("be.visible");
    cy.get("thead").contains("Actions").should("be.visible");

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
  });
});
