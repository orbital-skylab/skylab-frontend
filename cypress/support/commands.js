/* eslint-disable no-undef */
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
