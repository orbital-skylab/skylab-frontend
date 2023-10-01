/* eslint-disable no-undef */
Cypress.Commands.overwrite("type", (originalFn, element, text, options) => {
  const clearedText = `{selectall}{backspace}${text}`;

  return originalFn(element, clearedText, options);
});

Cypress.Commands.add("login", (email, password) => {
  cy.request("POST", "/auth/sign-in", {
    email,
    password,
  })
    .then(({ status }) => {
      expect(status).to.eq(200);
    })
    .then(() => cy.visit("http://localhost:3000/"));
});
