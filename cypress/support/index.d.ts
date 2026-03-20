declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in
     * @example cy.login('username', 'password')
     */
    login(email?: string, password?: string): Chainable<void>;
  }
}
