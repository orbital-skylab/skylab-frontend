/* eslint-disable no-undef */

describe("Testing student dashboard object-level authorization", () => {
  beforeEach(() => {
    cy.login("student1@skylab.com", "Password123");
  });

  afterEach(() => {
    cy.get("#nav-sign-out").click();
  });

  it("Denies a student reading another student's evaluations-feedbacks", () => {
    cy.request({
      url: "/dashboard/student/1/evaluations-feedbacks",
      failOnStatusCode: false,
    }).then(({ status }) => {
      expect(status).to.eq(401);
    });
  });

  it("Denies a student reading another student's deadlines", () => {
    cy.request({
      url: "/dashboard/student/1/deadlines",
      failOnStatusCode: false,
    }).then(({ status }) => {
      expect(status).to.eq(401);
    });
  });

  it("Allows a student reading their own evaluations-feedbacks", () => {
    cy.request({
      url: "/dashboard/student/2/evaluations-feedbacks",
      failOnStatusCode: false,
    }).then(({ status }) => {
      expect(status).to.eq(200);
    });
  });
});
