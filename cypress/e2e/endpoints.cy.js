// /// <reference types="cypress" />

// const backendUrl = "http://localhost:4000/api/";

// context("Actions", () => {
//   beforeEach(() => {
//     cy.visit("http://localhost:3000/");
//     cy.clearCookies();

//     cy.get("#sign-in-email")
//       .type("admin@skylab.com")
//       .should("have.value", "admin@skylab.com");

//     cy.get("#sign-in-password")
//       .type("Password123")
//       .should("have.value", "password37");

//     cy.get("#sign-in-form").submit();
//   });

//   it("fetch latest cohort", () => {
//     cy.request(`${backendUrl}/cohorts/latest`).should((response) => {
//       expect(response.status).to.eq(200);
//       expect(response.body)
//         .to.have.property("cohort")
//         .and.to.have.property("academicYear");
//     });
//   });
// });
