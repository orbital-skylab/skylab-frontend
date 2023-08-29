/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
// <reference types="cypress" />

Cypress.Commands.overwrite(
  "type",
  (
    originalFn: any,
    element: any,
    text: string,
    options: string | Partial<Cypress.TypeOptions> | undefined
  ) => {
    const clearedText = `{selectall}{backspace}${text}`;

    return originalFn(element, clearedText, options);
  }
);

Cypress.Commands.add("login", (email, password) => {
  cy.request("POST", "auth/sign-in", {
    email,
    password,
  }).then(({ status }) => {
    expect(status).to.eq(200);
    cy.getCookie("token")
      .should("exist")
      .then((cookie) => {
        window.localStorage.setItem("token", cookie?.value ?? "");
      });
  });
  // .then(() => cy.visit("http://frontend:3000/"));
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
    }
  }
}

export {};
