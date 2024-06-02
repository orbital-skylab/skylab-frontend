/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import VoteEventRow from "./VoteEventRow";
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";

describe("<VoteEventRow />", () => {
  let mutateSpy: any;
  const voteEvent = {
    id: 1,
    title: "Sample Vote Event",
    startTime: "2024-06-01T08:00:00Z",
    endTime: "2024-06-02T08:00:00Z",
  };

  beforeEach(() => {
    mutateSpy = cy.spy().as("mutateSpy");
  });

  it("should render the vote event row", () => {
    mount(<VoteEventRow voteEvent={voteEvent} mutate={mutateSpy} />);

    cy.get("tr").should("be.visible");
    cy.get("td").should("have.length", 4);
    cy.contains("Sample Vote Event").should("be.visible");
    cy.contains(isoDateToLocaleDateWithTime(voteEvent.startTime)).should(
      "be.visible"
    );
    cy.contains(isoDateToLocaleDateWithTime(voteEvent.endTime)).should(
      "be.visible"
    );
    cy.get("#edit-vote-event-button").should("be.visible");
    cy.get("#delete-vote-event-button").should("be.visible");
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
