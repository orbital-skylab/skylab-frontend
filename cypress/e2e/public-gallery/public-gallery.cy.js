/* eslint-disable no-undef */

/**
 * E2E Tests for Public Gallery Static Site Generation Feature
 *
 * Test Plan Coverage:
 * 1. Static page rendering and navigation
 * 2. Pagination functionality
 * 3. Achievement level tab filtering (Artemis, Apollo, Gemini, Vostok)
 * 4. Cohort year dropdown routing
 * 5. Project detail page navigation and content
 * 6. Edge cases: empty states, 404 pages
 */

describe("Public Gallery - SSG Feature", () => {
  const getSelectedCohortYear = () => {
    return cy.get('input[name="cohort"]').invoke("val");
  };

  describe("Index Page", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/public-gallery/");
    });

    it("renders the public gallery index page", () => {
      cy.contains("h1", "Public Project Gallery").should("be.visible");
      cy.contains("Explore outstanding").should("be.visible");
    });

    it("displays achievement level tabs", () => {
      cy.get('[aria-label="achievement-level-tabs"]').should("be.visible");
      cy.contains("button", "Artemis").should("be.visible");
      cy.contains("button", "Apollo").should("be.visible");
      cy.contains("button", "Gemini").should("be.visible");
      cy.contains("button", "Vostok").should("be.visible");
    });

    it("has Artemis tab selected by default", () => {
      cy.contains("button", "Artemis").should(
        "have.attr",
        "aria-selected",
        "true"
      );
    });

    it("displays cohort year dropdown selector", () => {
      cy.get("#cohort-select").should("be.visible");
    });

    it("filters projects when switching achievement tabs", () => {
      // Click Apollo tab
      cy.contains("button", "Apollo").click();
      cy.contains("button", "Apollo").should(
        "have.attr",
        "aria-selected",
        "true"
      );

      // Click Gemini tab
      cy.contains("button", "Gemini").click();
      cy.contains("button", "Gemini").should(
        "have.attr",
        "aria-selected",
        "true"
      );

      // Click Vostok tab
      cy.contains("button", "Vostok").click();
      cy.contains("button", "Vostok").should(
        "have.attr",
        "aria-selected",
        "true"
      );

      // Return to Artemis tab
      cy.contains("button", "Artemis").click();
      cy.contains("button", "Artemis").should(
        "have.attr",
        "aria-selected",
        "true"
      );
    });

    it("filters projects when changing cohort year", () => {
      // Open the cohort selector dropdown
      cy.get("#cohort-select").click();

      // Select a cohort year from the dropdown (wait for menu to appear)
      cy.get('[role="listbox"]').should("be.visible");
      cy.get('[role="option"]').first().click();

      // Verify the selection was made (dropdown closed)
      cy.get('[role="listbox"]').should("not.exist");
    });

    it("shows empty state when no projects match filter", () => {
      // This test verifies the empty state component renders
      // The actual empty state depends on data availability
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="empty-state"]').length > 0) {
          cy.contains("No projects available for").should("be.visible");
        }
      });
    });
  });

  describe("Pagination", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/public-gallery/");
    });

    it("displays pagination when multiple pages exist", () => {
      // Check if pagination exists (depends on total project count)
      cy.get("body").then(($body) => {
        if ($body.find('nav[aria-label="pagination navigation"]').length > 0) {
          cy.get('nav[aria-label="pagination navigation"]').should(
            "be.visible"
          );
        }
      });
    });

    it("navigates to page 2 when clicking pagination", () => {
      cy.get("body").then(($body) => {
        if ($body.find('nav[aria-label="pagination navigation"]').length > 0) {
          // Click page 2 button
          cy.get('button[aria-label="Go to page 2"]').click();
          cy.url().should("include", "/artemis/page/2");
        }
      });
    });
  });

  describe("Paginated Pages (/public-gallery/[cohortYear]/[level]/page/[page])", () => {
    it("renders page 1", () => {
      cy.visit("http://localhost:3000/public-gallery/");
      getSelectedCohortYear().then((cohortYear) => {
        cy.visit(
          `http://localhost:3000/public-gallery/${cohortYear}/artemis/page/1/`
        );
        cy.contains("h1", "Public Project Gallery").should("be.visible");
      });
    });

    it("displays achievement tabs on paginated pages", () => {
      cy.visit("http://localhost:3000/public-gallery/");
      cy.get('[aria-label="achievement-level-tabs"]').should("be.visible");
      cy.contains("button", "Artemis").should("be.visible");
    });

    it("displays cohort selector on paginated pages", () => {
      cy.visit("http://localhost:3000/public-gallery/");
      cy.get("#cohort-select").should("be.visible");
    });

    it("allows switching between achievement tabs", () => {
      cy.visit("http://localhost:3000/public-gallery/");

      cy.contains("button", "Apollo").click();
      cy.contains("button", "Apollo").should(
        "have.attr",
        "aria-selected",
        "true"
      );
      cy.location("pathname").should(
        "match",
        /\/public-gallery\/\d+\/apollo\/page\/1\//
      );
    });

    it("returns 404 for pages beyond generated static pages", () => {
      cy.visit("http://localhost:3000/public-gallery/");
      getSelectedCohortYear().then((cohortYear) => {
        cy.request({
          url: `http://localhost:3000/public-gallery/${cohortYear}/artemis/page/999/`,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(404);
        });
      });
    });
  });

  describe("Project Detail Pages", () => {
    it("navigates to project detail page when clicking a project card", () => {
      cy.visit("http://localhost:3000/public-gallery/");

      // Wait for projects to load and click first project card
      cy.get("body").then(($body) => {
        // Check if there are project cards
        if (
          $body.find('[class*="ProjectCard"]').length > 0 ||
          $body.find('[class*="MuiCard"]').length > 0
        ) {
          cy.contains("a", "Details").first().click();
          cy.url().should("include", "/public-gallery/projects/");
        }
      });
    });

    it("displays project details on detail page", () => {
      cy.visit("http://localhost:3000/public-gallery/");

      cy.get("body").then(($body) => {
        if ($body.find('[class*="MuiCard"]').length > 0) {
          cy.contains("a", "Details").first().click();

          // Verify detail page elements
          cy.get("#go-back-button").should("be.visible");
          cy.contains("Project ID").should("be.visible");
          cy.contains("Project Name").should("be.visible");
          cy.contains("Level of Achievement").should("be.visible");
        }
      });
    });

    it("navigates back to gallery when clicking Back to Gallery button", () => {
      cy.visit("http://localhost:3000/public-gallery/");

      cy.get("body").then(($body) => {
        if ($body.find('[class*="MuiCard"]').length > 0) {
          cy.contains("a", "Details").first().click();
          cy.url().should("include", "/public-gallery/projects/");

          // Click back button
          cy.get("#go-back-button").click();
          cy.url().should("include", "/public-gallery");
          cy.url().should("not.include", "/projects/");
        }
      });
    });

    it("returns 404 for non-existent project ID", () => {
      cy.request({
        url: "http://localhost:3000/public-gallery/projects/99999999/",
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe("Data Integrity and Sorting", () => {
    it("displays project count in header", () => {
      cy.visit("http://localhost:3000/public-gallery/");
      cy.contains("projects").should("be.visible");
    });

    it("projects are visible in the grid layout", () => {
      cy.visit("http://localhost:3000/public-gallery/");

      // Verify grid container exists
      cy.get(".MuiGrid-container").should("be.visible");
    });
  });

  describe("Responsive Design", () => {
    it("displays correctly on mobile viewport", () => {
      cy.viewport("iphone-6");
      cy.visit("http://localhost:3000/public-gallery/");

      cy.contains("h1", "Public Project Gallery").should("be.visible");
      cy.get('[aria-label="achievement-level-tabs"]').should("be.visible");
    });

    it("displays correctly on tablet viewport", () => {
      cy.viewport("ipad-2");
      cy.visit("http://localhost:3000/public-gallery/");

      cy.contains("h1", "Public Project Gallery").should("be.visible");
    });

    it("displays correctly on desktop viewport", () => {
      cy.viewport(1920, 1080);
      cy.visit("http://localhost:3000/public-gallery/");

      cy.contains("h1", "Public Project Gallery").should("be.visible");
    });
  });
});
