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

Cypress.Commands.add("externalVoterLogin", (voterId) => {
  cy.request("POST", "/auth/sign-in/external-voter", {
    voterId,
  })
    .then(({ status }) => {
      expect(status).to.eq(200);
    })
    .then(() => cy.visit("http://localhost:3000/"));
});
