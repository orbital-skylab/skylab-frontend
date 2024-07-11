/* eslint-disable @typescript-eslint/no-explicit-any */
import RoleWeightsModal from "@/components/modals/RoleWeightsModal/RoleWeightsModal";
import { ERRORS } from "@/helpers/errors";
import { DEFAULT_RESULTS_FILTER } from "@/helpers/voteEvent";
import { VoteEvent } from "@/types/voteEvents";
import { mount } from "cypress/react18";

const assertAllWeightsError = (error: string) => {
  cy.get("#administrator-weight-input")
    .parent()
    .parent()
    .contains(error)
    .should("be.visible");
  cy.get("#mentor-weight-input")
    .parent()
    .parent()
    .contains(error)
    .should("be.visible");
  cy.get("#adviser-weight-input")
    .parent()
    .parent()
    .contains(error)
    .should("be.visible");
  cy.get("#student-weight-input")
    .parent()
    .parent()
    .contains(error)
    .should("be.visible");
  cy.get("#public-weight-input")
    .parent()
    .parent()
    .contains(error)
    .should("be.visible");
};

describe("<RoleWeightsModal />", () => {
  let setOpenSpy: any;
  let mutateSpy: any;
  const voteEvent: VoteEvent = {
    id: 1,
    title: "Test Vote Event",
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    resultsFilter: DEFAULT_RESULTS_FILTER,
  };

  beforeEach(() => {
    setOpenSpy = cy.spy().as("setOpenSpy");
    mutateSpy = cy.spy().as("mutateSpy");
  });

  it("should render opened modal", () => {
    // Mount the component
    mount(
      <RoleWeightsModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#administrator-weight-input").should(
      "have.value",
      DEFAULT_RESULTS_FILTER.administratorWeight
    );
    cy.get("#mentor-weight-input").should(
      "have.value",
      DEFAULT_RESULTS_FILTER.mentorWeight
    );
    cy.get("#adviser-weight-input").should(
      "have.value",
      DEFAULT_RESULTS_FILTER.adviserWeight
    );
    cy.get("#student-weight-input").should(
      "have.value",
      DEFAULT_RESULTS_FILTER.studentWeight
    );
    cy.get("#public-weight-input").should(
      "have.value",
      DEFAULT_RESULTS_FILTER.publicWeight
    );

    cy.get("#save-role-weights-button").should("exist");
  });

  it("should render closed modal", () => {
    // Mount the component
    mount(
      <RoleWeightsModal
        voteEvent={voteEvent}
        open={false}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    cy.get("#save-role-weights-button").should("not.exist");
  });

  it("should submit form with valid data", () => {
    // Mount the component
    mount(
      <RoleWeightsModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Interact with form inputs
    cy.get("#administrator-weight-input").clear().type("2");
    cy.get("#mentor-weight-input").clear().type("3");
    cy.get("#adviser-weight-input").clear().type("4");
    cy.get("#student-weight-input").clear().type("5");
    cy.get("#public-weight-input").clear().type("6");

    // Submit the form
    cy.intercept("PUT", `/api/vote-events/${voteEvent.id}`, {
      statusCode: 200,
      body: {},
    }).as("editWeights");
    cy.get("#save-role-weights-button").click();

    cy.wait("@editWeights");

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
    cy.get("@mutateSpy").should("be.calledOnce");
  });

  it("should not submit form with empty weights", () => {
    // Mount the component
    mount(
      <RoleWeightsModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Submit the form with empty weights
    cy.get("#administrator-weight-input").clear();
    cy.get("#mentor-weight-input").clear();
    cy.get("#adviser-weight-input").clear();
    cy.get("#student-weight-input").clear();
    cy.get("#public-weight-input").clear();
    cy.get("#save-role-weights-button").click();

    cy.get("@setOpenSpy").should("not.be.called");
    cy.get("@mutateSpy").should("not.be.called");
    assertAllWeightsError(ERRORS.REQUIRED);
  });

  it("should not submit form with non integer weights", () => {
    // Mount the component
    mount(
      <RoleWeightsModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Submit form with non integer weights
    cy.get("#administrator-weight-input").clear().type("a");
    cy.get("#mentor-weight-input").clear().type("6.7");
    cy.get("#adviser-weight-input").clear().type("@");
    cy.get("#student-weight-input").clear().type("&");
    cy.get("#public-weight-input").clear().type("-");
    cy.get("#save-role-weights-button").click();

    cy.get("@setOpenSpy").should("not.be.called");
    cy.get("@mutateSpy").should("not.be.called");
    assertAllWeightsError("Weight must be an integer");
  });

  it("should not submit form with negative weights", () => {
    // Mount the component
    mount(
      <RoleWeightsModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Submit form with negative weights
    cy.get("#administrator-weight-input").clear().type("-1");
    cy.get("#mentor-weight-input").clear().type("-2");
    cy.get("#adviser-weight-input").clear().type("-3");
    cy.get("#student-weight-input").clear().type("-4");
    cy.get("#public-weight-input").clear().type("-99");
    cy.get("#save-role-weights-button").click();

    cy.get("@setOpenSpy").should("not.be.called");
    cy.get("@mutateSpy").should("not.be.called");
    assertAllWeightsError("Weight cannot be less than 0");
  });

  it("should not submit form with weights above 100", () => {
    // Mount the component
    mount(
      <RoleWeightsModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Submit form with weights above 100
    cy.get("#administrator-weight-input").clear().type("999");
    cy.get("#mentor-weight-input").clear().type("1000");
    cy.get("#adviser-weight-input").clear().type("101");
    cy.get("#student-weight-input").clear().type("102");
    cy.get("#public-weight-input").clear().type("50000");
    cy.get("#save-role-weights-button").click();

    cy.get("@setOpenSpy").should("not.be.called");
    cy.get("@mutateSpy").should("not.be.called");
    assertAllWeightsError("Weight cannot be greater than 100");
  });

  it("should have a functioning return button", () => {
    // Mount the component
    mount(
      <RoleWeightsModal
        voteEvent={voteEvent}
        open={true}
        setOpen={setOpenSpy}
        mutate={mutateSpy}
      />
    );

    // Click the return button
    cy.get("#role-weights-return-button").click();

    cy.get("@setOpenSpy").should("be.calledOnce");
    cy.get("@setOpenSpy").should("be.calledWith", false);
  });
});
