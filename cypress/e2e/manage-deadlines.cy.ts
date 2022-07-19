/* eslint-disable no-undef */
/// <reference types="cypress" />

import { QUESTION_TYPE } from "@/types/deadlines";

context("Actions", () => {
  before(() => {
    cy.visit("http://localhost:3000/");
    cy.get("#nav-manage").click();
    cy.location("pathname").should("include", "manage");
    cy.get("#manage-deadlines-card").click();
    cy.location("pathname").should("include", "manage/deadlines");
  });

  it("delete deadline", () => {
    cy.contains(".deadline-name-td", "Test Milestone")
      .parent()
      .find(".deadline-actions-td>.deadline-options-button")
      .click();
    cy.get("#delete-deadline-button").click();
    cy.get("#delete-deadline-confirm-button").click();

    cy.contains(".deadline-name-td", "Test Milestone").should("not.exist");
  });

  it("add deadline", () => {
    cy.get("#add-deadline-button").click();
    cy.get("#deadline-name-input").type("Test Milestone");
    cy.get("#submit-deadline-button").click();
    cy.contains(".deadline-name-td", "Test Milestone").should("exist");
  });

  it("view questions of Test Milestone", () => {
    cy.contains(".deadline-name-td", "Test Milestone")
      .parent()
      .find(".deadline-actions-td>.deadline-options-button")
      .click();
    cy.get("#view-questions-button").click();
    cy.location("pathname").should("include", "deadlines/");
  });

  it("add deadline description", () => {
    cy.get("#deadline-description-input").type("description of test milestone");
  });

  it("fill up details of section 1", () => {
    cy.get(".section-name-input").first().type("section 1");
    cy.get(".section-description-input")
      .first()
      .type("description for section 1");
  });

  it("fill up first mcq question to section 1", () => {
    cy.get(".question-input").first().type("question 1 of section 1");
    cy.get(".question-description-input").first().type("mcq question");
    cy.get(".option-input")
      .first()
      .type("option 1 for question 1 of section 1");
  });

  it("add short answer question to section 1", () => {
    cy.get("#add-question-button").click();
    cy.get(".question-type-select").eq(1).click();
    cy.contains(
      "li",
      QUESTION_TYPE.SHORT_ANSWER.split(/(?=[A-Z])/).join(" ")
    ).click();
    cy.get(".question-input").eq(1).type("question 2 for section 1");
    cy.get(".question-description-input").eq(1).type("short answer question");

    cy.get(".option-input").should("have.length", 2);
  });

  it("fill up details of section 2", () => {
    cy.get(".section-name-input").last().type("section 2");
    cy.get(".section-description-input")
      .last()
      .type("description for section 2");
  });

  it("add paragraph question to section 2", () => {
    cy.get(".question-type-select").first().click();
    cy.contains("li", QUESTION_TYPE.PARAGRAPH).click();
    cy.get(".question-input").last().type("question 1 of section 2");
    cy.get(".question-description-input").last().type("paragraph question");

    cy.get(".option-input").should("have.length", 1);
  });

  it("add and fill up details for section 3", () => {
    cy.get("#add-section-button").click();
    cy.get(".section-name-input").last().type("section 3");
    cy.get(".section-description-input")
      .last()
      .type("description for section 3");
  });

  it("add checkboxes question to section 3", () => {
    cy.get(".question-type-select").first().click();
    cy.contains("li", QUESTION_TYPE.CHECKBOXES).click();

    cy.get(".question-input").last().type("question 1 of section 3");
    cy.get(".question-description-input").last().type("checkboxes question");
    cy.get(".option-input").last().type("option 1 for question 1 of section 3");

    cy.get(".option-input").should("have.length", 2);
  });

  it("add option 2 to question 1 in section 3", () => {
    cy.get(".add-option-button").first().click();
    cy.get(".option-input").last().type("option 2 for question 1 of section 3");

    cy.get(".option-input").should("have.length", 3);
  });

  it("add dropdown question to section 3", () => {
    cy.get("#add-question-button").click();
    cy.get(".question-type-select").last().click();
    cy.contains("li", QUESTION_TYPE.DROPDOWN).click();
    cy.get(".question-input").last().type("question 2 of section 3");
    cy.get(".question-description-input").last().type("dropdown question");
    cy.get(".option-input").last().type("option 1 for question 2 of section 3");

    cy.get(".option-input").should("have.length", 4);
  });

  it("add option 2 to question 2 in section 3", () => {
    cy.get(".add-option-button").last().click();
    cy.get(".option-input").last().type("option 2 for question 2 of section 3");

    cy.get(".option-input").should("have.length", 5);
  });

  it("add option 3 to question 2 in section 3", () => {
    cy.get(".add-option-button").last().click();
    cy.get(".option-input").last().type("option 3 for question 2 of section 3");

    cy.get(".option-input").should("have.length", 6);
  });

  it("add and fill up details for section 4", () => {
    cy.get("#add-section-button").click();
    cy.get(".section-name-input").last().type("section 4");
    cy.get(".section-description-input")
      .last()
      .type("description for section 4");
  });

  it("add url question to section 4", () => {
    cy.get(".question-type-select").first().click();
    cy.contains("li", QUESTION_TYPE.URL).click();
    cy.get(".question-input").last().type("question 1 of section 4");
    cy.get(".question-description-input").last().type("url question");

    cy.get(".option-input").should("have.length", 6);
  });

  it("add date question to section 4", () => {
    cy.get("#add-question-button").click();
    cy.get(".question-type-select").last().click();
    cy.contains("li", QUESTION_TYPE.DATE).click();
    cy.get(".question-input").last().type("question 2 of section 4");
    cy.get(".question-description-input").last().type("date question");

    cy.get(".option-input").should("have.length", 6);
  });

  it("add time question to section 4", () => {
    cy.get("#add-question-button").click();
    cy.get(".question-type-select").last().click();
    cy.contains("li", QUESTION_TYPE.TIME).click();
    cy.get(".question-input").last().type("question 3 of section 4");
    cy.get(".question-description-input").last().type("time question");

    cy.get(".option-input").should("have.length", 6);
  });

  it("save", () => {
    cy.get("#save-deadline-questions-button").click();
  });

  it("enter preview mode", () => {
    cy.get("#preview-questions-button").click();
    cy.get("#question-section-list-div").should("exist");
  });

  it("check section 1 details", () => {
    cy.get(".section-div")
      .first()
      .find(".section-number-span")
      .should("have.text", "Section 1 of 4")
      .parent()
      .find(".section-name-span")
      .should("have.text", "section 1")
      .parent()
      .find(".section-description-span")
      .should("have.text", "description for section 1");
  });

  it("check mcq question in section 1", () => {
    cy.get(".section-div")
      .first()
      .find(".mcq-question")
      .should("have.length", 1)
      .parent()
      .find(".question-description-span")
      .should("have.text", "mcq question")
      .parent()
      .find(".question-span")
      .should("have.text", "question 1 of section 1");

    cy.get(".section-div")
      .first()
      .find(".mcq-option")
      .should("have.length", 1)
      .should("have.text", "option 1 for question 1 of section 1");
  });

  it("check short answer question in section 1", () => {
    cy.get(".section-div")
      .first()
      .find(".short-answer-question")
      .should("have.length", 1)
      .parent()
      .find(".question-description-span")
      .should("have.text", "short answer question")
      .parent()
      .find(".question-span")
      .should("have.text", "question 2 for section 1");

    cy.get(".section-div")
      .first()
      .find(".short-answer-input")
      .should("have.length", 1);
  });

  it("check section 2 details", () => {
    cy.get(".section-div")
      .eq(1)
      .find(".section-number-span")
      .should("have.text", "Section 2 of 4")
      .parent()
      .find(".section-name-span")
      .should("have.text", "section 2")
      .parent()
      .find(".section-description-span")
      .should("have.text", "description for section 2");
  });

  it("check paragraph question in section 2", () => {
    cy.get(".section-div")
      .eq(1)
      .find(".paragraph-question")
      .should("have.length", 1)
      .parent()
      .find(".question-description-span")
      .should("have.text", "paragraph question")
      .parent()
      .find(".question-span")
      .should("have.text", "question 1 of section 2");

    cy.get(".section-div")
      .eq(1)
      .find(".paragraph-input")
      .should("have.length", 1);
  });

  it("check section 3 details", () => {
    cy.get(".section-div")
      .eq(2)
      .find(".section-number-span")
      .should("have.text", "Section 3 of 4")
      .parent()
      .find(".section-name-span")
      .should("have.text", "section 3")
      .parent()
      .find(".section-description-span")
      .should("have.text", "description for section 3");
  });

  it("check checkbox question in section 3", () => {
    cy.get(".section-div")
      .eq(2)
      .find(".checkbox-question")
      .should("have.length", 1)
      .parent()
      .find(".question-description-span")
      .should("have.text", "checkboxes question")
      .parent()
      .find(".question-span")
      .should("have.text", "question 1 of section 3");

    cy.get(".section-div")
      .eq(2)
      .find(".checkbox-option")
      .should("have.length", 2)
      .first()
      .should("have.text", "option 1 for question 1 of section 3")
      .siblings()
      .first()
      .should("have.text", "option 2 for question 1 of section 3");
  });

  it("check dropdown question in section 3", () => {
    cy.get(".section-div")
      .eq(2)
      .find(".dropdown-question")
      .should("have.length", 1)
      .parent()
      .find(".question-description-span")
      .should("have.text", "dropdown question")
      .parent()
      .find(".question-span")
      .should("have.text", "question 2 of section 3");

    cy.get(".section-div").eq(2).find(".dropdown-select").click();

    cy.get(".dropdown-option")
      .should("have.length", 3)
      .first()
      .should("have.text", "option 1 for question 2 of section 3")
      .siblings()
      .first()
      .should("have.text", "option 2 for question 2 of section 3")
      .siblings()
      .last()
      .should("have.text", "option 3 for question 2 of section 3")
      .parent();
  });

  it("check section 4 details", () => {
    cy.get(".section-div")
      .eq(3)
      .find(".section-number-span")
      .should("have.text", "Section 4 of 4")
      .parent()
      .find(".section-name-span")
      .should("have.text", "section 4")
      .parent()
      .find(".section-description-span")
      .should("have.text", "description for section 4");
  });

  it("check url question in section 4", () => {
    cy.get(".section-div")
      .eq(3)
      .find(".url-question")
      .should("have.length", 1)
      .parent()
      .find(".question-description-span")
      .should("have.text", "url question")
      .parent()
      .find(".question-span")
      .should("have.text", "question 1 of section 4");

    cy.get(".section-div").eq(3).find(".url-input").should("have.length", 1);
  });

  it("check date question in section 4", () => {
    cy.get(".section-div")
      .eq(3)
      .find(".date-question")
      .should("have.length", 1)
      .parent()
      .find(".question-description-span")
      .should("have.text", "date question")
      .parent()
      .find(".question-span")
      .should("have.text", "question 2 of section 4");

    cy.get(".section-div").eq(3).find(".date-input").should("have.length", 1);
  });

  it("check time question in section 4", () => {
    cy.get(".section-div")
      .eq(3)
      .find(".time-question")
      .should("have.length", 1)
      .parent()
      .find(".question-description-span")
      .should("have.text", "time question")
      .parent()
      .find(".question-span")
      .should("have.text", "question 3 of section 4");

    cy.get(".section-div").eq(3).find(".time-input").should("have.length", 1);
  });
});
