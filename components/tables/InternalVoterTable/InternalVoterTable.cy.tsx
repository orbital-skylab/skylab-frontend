/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "cypress/react18";
import InternalVoterTable from "./InternalVoterTable";
import { FETCH_STATUS } from "@/hooks/useFetch";
import { getMostImportantRole, toSingular } from "@/helpers/roles";

describe("<InternalVoterTable />", () => {
  let mutateSpy: any;
  const voteEventId = 1;
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

  beforeEach(() => {
    mutateSpy = cy.spy().as("mutateSpy");
  });

  it("should render the internal voter table with correct headings and rows", () => {
    mount(
      <InternalVoterTable
        voteEventId={voteEventId}
        internalVoters={internalVoters}
        status={FETCH_STATUS.FETCHED}
        mutate={mutateSpy}
      />
    );

    cy.get("#search-internal-voters").should("exist");

    // Check column headings
    cy.get("thead").contains("Email").should("be.visible");
    cy.get("thead").contains("Name").should("be.visible");
    cy.get("thead").contains("Role").should("be.visible");
    cy.get("thead").contains("Actions").should("be.visible");

    // Check rows
    cy.get("tbody").find("tr").should("have.length", internalVoters.length);
    internalVoters.forEach((internalVoter) => {
      cy.get("tbody").contains(internalVoter.email).should("be.visible");
      cy.get("tbody").contains(internalVoter.name).should("be.visible");
      cy.get("tbody")
        .contains(toSingular(getMostImportantRole(internalVoter)))
        .should("be.visible");
    });
  });

  it("should be loading when data is being fetched", () => {
    mount(
      <InternalVoterTable
        voteEventId={voteEventId}
        internalVoters={internalVoters}
        status={FETCH_STATUS.FETCHING}
        mutate={mutateSpy}
      />
    );

    cy.get("#loading-wrapper").should("exist");
  });

  it("should not display any table if there is no data", () => {
    mount(
      <InternalVoterTable
        voteEventId={voteEventId}
        internalVoters={[]}
        status={FETCH_STATUS.FETCHED}
        mutate={mutateSpy}
      />
    );

    cy.contains("No internal voters found").should("be.visible");
  });

  it("should filter internal voters based on search text", () => {
    mount(
      <InternalVoterTable
        voteEventId={voteEventId}
        internalVoters={internalVoters}
        status={FETCH_STATUS.FETCHED}
        mutate={mutateSpy}
      />
    );

    const searchText = internalVoters[0].name;
    cy.get("#search-internal-voters").type(searchText);

    cy.get("tbody").find("tr").should("have.length", 1);
    cy.get("tbody").contains(searchText).should("be.visible");
  });
});
