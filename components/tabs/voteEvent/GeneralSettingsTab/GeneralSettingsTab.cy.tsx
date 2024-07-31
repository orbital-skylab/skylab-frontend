/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import GeneralSettingsTab from "./GeneralSettingsTab";
import { isoDateToDateTimeLocalInput } from "@/helpers/dates";
import { DEFAULT_RESULTS_FILTER } from "@/helpers/voteEvent";

describe("<GeneralSettingsTab />", () => {
  let mutateSpy: any;
  const voteEvent = {
    id: 1,
    title: "Test Vote Event",
    startTime: "2024-06-01T08:00:00Z",
    endTime: "2024-06-02T08:00:00Z",
    resultsFilter: DEFAULT_RESULTS_FILTER,
  };

  beforeEach(() => {
    mutateSpy = cy.spy().as("mutateSpy");
  });

  it("should render the form with correct initial values", () => {
    mount(<GeneralSettingsTab voteEvent={voteEvent} mutate={mutateSpy} />);

    // Check if form elements are rendered with correct initial values
    cy.get("#title-input").should("have.value", voteEvent.title);
    cy.get("#start-time-input").should(
      "have.value",
      isoDateToDateTimeLocalInput("2024-06-01T08:00:00Z")
    );
    cy.get("#end-time-input").should(
      "have.value",
      isoDateToDateTimeLocalInput("2024-06-02T08:00:00Z")
    );
  });

  it("should show validation errors for empty fields", () => {
    mount(<GeneralSettingsTab voteEvent={voteEvent} mutate={mutateSpy} />);

    // Submit the form after clearing fields

    cy.get("#title-input").clear();
    cy.get("#start-time-input").clear();
    cy.get("#end-time-input").clear();
    cy.get("#edit-vote-event-general-settings-button").click();

    // Check if validation errors are displayed
    cy.contains("This field is required").should("be.visible");
    cy.get("@mutateSpy").should("not.be.called");
  });

  it("", () => {
    mount(<GeneralSettingsTab voteEvent={voteEvent} mutate={mutateSpy} />);

    // Fill the form with invalid input
    cy.get("#start-time-input").clear().type("2024-06-02T09:00");
    cy.get("#end-time-input").clear().type("2024-06-02T08:00");

    // Submit the form
    cy.get("#edit-vote-event-general-settings-button").click();

    // Check if validation error is displayed
    cy.contains("End date time must be greater than start date time").should(
      "be.visible"
    );
    cy.get("@mutateSpy").should("not.be.called");
  });

  it("", () => {
    const mutateSpy = cy.spy().as("mutateSpy");
    mount(<GeneralSettingsTab voteEvent={voteEvent} mutate={mutateSpy} />);

    // Fill the form
    cy.get('input[name="title"]').clear().type("New Title");
    cy.get('input[name="startTime"]').clear().type("2024-06-01T09:00");
    cy.get('input[name="endTime"]').clear().type("2024-06-02T09:00");

    // Submit the form
    cy.intercept("PUT", `/api/vote-events/${voteEvent.id}`, {
      statusCode: 200,
      body: {},
    }).as("editVoteEvent");
    cy.get("button[type='submit']").click();

    cy.wait("@editVoteEvent");

    // Check if spy is called
    cy.get("@mutateSpy").should("be.calledOnce");
  });
});
