/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="cypress" />

Cypress.Commands.overwrite(
  "type",
  (
    originalFn: any,
    element: any,
    text: any,
    options: string | Partial<Cypress.TypeOptions> | undefined
  ) => {
    const clearedText = `{selectall}{backspace}${text}`;

    return originalFn(element, clearedText, options);
  }
);

Cypress.Commands.add("login", (user) => {
  cy.session(
    user,
    () => {
      cy.fixture(user).then(({ email, password }) => {
        cy.visit("http://localhost:3000/");
        cy.get("#sign-in-email-input").type(email);
        cy.get("#sign-in-password-input").type(password);
        cy.get("#sign-in-button").click();
        cy.wait(1000); // timeout for login api request to be fulfilled
        cy.getCookie("token").then((token) =>
          window.sessionStorage.setItem("token", token?.value || "")
        );
      });
    },
    {
      validate() {
        cy.request("http://localhost:4000/api/auth/info")
          .its("status")
          .should("eq", 200);
      },
    }
  );
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(user: string): Chainable<void>;
    }
  }
}
export {};
