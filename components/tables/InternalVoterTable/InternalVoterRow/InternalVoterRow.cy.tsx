/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import InternalVoterRow from "./InternalVoterRow";

describe("<InternalVoterRow />", () => {
  let mutateSpy: any;
  const voteEventId = 1;

  // Mock internalVoter object
  const internalVoter = {
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
  };

  beforeEach(() => {
    mutateSpy = cy.spy().as("mutateSpy");
  });

  it("should render the internal voter row", () => {
    mount(
      <InternalVoterRow
        voteEventId={voteEventId}
        internalVoter={internalVoter}
        mutate={mutateSpy}
      />
    );

    cy.get("tr").should("be.visible");
    cy.get("td").should("have.length", 4);
    cy.contains(internalVoter.email).should("be.visible");
    cy.contains(internalVoter.name).should("be.visible");
    cy.contains("Student").should("be.visible");
    cy.get(`#delete-internal-voter-${internalVoter.id}-button`).should(
      "be.visible"
    );
  });

  it("should open the delete modal when the delete button is clicked", () => {
    mount(
      <InternalVoterRow
        voteEventId={voteEventId}
        internalVoter={internalVoter}
        mutate={mutateSpy}
      />
    );

    cy.get(`#delete-internal-voter-${internalVoter.id}-button`).click();

    cy.contains("Delete Internal Voter").should("be.visible");
    cy.contains(internalVoter.email).should("be.visible");
  });
});
