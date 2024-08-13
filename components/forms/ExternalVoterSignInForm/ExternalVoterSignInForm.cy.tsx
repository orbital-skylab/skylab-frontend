/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { AuthContext } from "@/contexts/useAuth";
import { ERRORS } from "@/helpers/errors";
import { mount } from "cypress/react18";
import ExternalVoterSignInForm from "./ExternalVoterSignInForm";

describe("<ExternalVoterSignInForm />", () => {
  let externalVoterSignInSpy: any;
  let mockValues: any;

  beforeEach(() => {
    externalVoterSignInSpy = cy.spy().as("externalVoterSignInSpy");
    mockValues = {
      user: undefined,
      isExternalVoter: true,
      isLoading: false,
      isPreviewMode: false,
      signIn: async () => {},
      signOut: async () => {},
      externalVoterSignIn: externalVoterSignInSpy,
      externalVoterSignOut: async () => {},
      resetPassword: async () => {},
      changePassword: async () => {},
      previewSiteAs: () => {},
      stopPreview: () => {},
    };
  });

  it("should submit form with valid voter id", () => {
    // mount the component with auth context
    mount(
      <AuthContext.Provider value={mockValues}>
        <ExternalVoterSignInForm />
      </AuthContext.Provider>
    );

    // interact with form inputs
    const voterId = "123456";
    cy.get("#sign-in-voter-id-input").type(voterId);

    // submit the form
    cy.get("#sign-in-button").click();

    cy.get("@externalVoterSignInSpy").should("be.calledWith", voterId);
  });

  it("should not submit form with empty voter id", () => {
    // mount the component with auth context
    mount(
      <AuthContext.Provider value={mockValues}>
        <ExternalVoterSignInForm />
      </AuthContext.Provider>
    );

    // submit the form
    cy.get("#sign-in-button").click();

    // assert error message
    cy.contains(ERRORS.REQUIRED).should("be.visible");
    cy.get("@externalVoterSignInSpy").should("not.be.called");
  });
});
