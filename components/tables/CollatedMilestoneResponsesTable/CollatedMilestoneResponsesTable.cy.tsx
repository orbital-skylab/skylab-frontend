/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentProps } from "react";

import CollatedMilestoneResponsesTable from "@/components/tables/CollatedMilestoneResponsesTable/CollatedMilestoneResponsesTable";
import {
  DEADLINE_TYPE,
  EVALUATOR_TYPE,
  QUESTION_TYPE,
} from "@/types/deadlines";
import { SUBMISSION_STATUS } from "@/types/submissions";
import { mount } from "cypress/react18";

type Props = ComponentProps<typeof CollatedMilestoneResponsesTable>;

const milestoneDeadline = {
  id: 1,
  cohortYear: 2026,
  name: "Milestone 1",
  dueBy: "2026-03-01T00:00:00.000Z",
  type: DEADLINE_TYPE.MILESTONE,
  createdAt: "2026-02-01T00:00:00.000Z",
  updatedAt: "2026-02-01T00:00:00.000Z",
};

const buildProps = (overrides?: Partial<Props>): Props => ({
  collated: [
    {
      deadline: milestoneDeadline,
      questions: [
        {
          questionId: 11,
          sectionId: 1,
          sectionName: "Section 1",
          sectionNumber: 1,
          questionNumber: 1,
          question: "Project link",
          description: "",
          isAnonymous: false,
          isRequired: true,
          type: QUESTION_TYPE.URL,
          urlType: "Generic",
          responses: [
            {
              projectId: 101,
              teamName: "Team Atlas",
              projectName: "Atlas",
              submissionId: 501,
              submittedAt: "2026-02-20T10:00:00.000Z",
              answer: "https://example.com/demo",
            },
            {
              projectId: 102,
              teamName: "Team Nova",
              projectName: "Nova",
              answer: "",
            },
          ],
        },
        {
          questionId: 12,
          sectionId: 1,
          sectionName: "Section 1",
          sectionNumber: 1,
          questionNumber: 2,
          question: "Selected features",
          description: "",
          isAnonymous: false,
          isRequired: true,
          type: QUESTION_TYPE.CHECKBOXES,
          responses: [
            {
              projectId: 101,
              teamName: "Team Atlas",
              projectName: "Atlas",
              submissionId: 501,
              submittedAt: "2026-02-20T10:00:00.000Z",
              answer: '{"Alpha":true,"Beta":false,"Gamma":true}',
            },
            {
              projectId: 102,
              teamName: "Team Nova",
              projectName: "Nova",
              answer: "",
            },
          ],
        },
        {
          questionId: 13,
          sectionId: 1,
          sectionName: "Section 1",
          sectionNumber: 1,
          questionNumber: 3,
          question: "Overview",
          description: "",
          isAnonymous: false,
          isRequired: false,
          type: QUESTION_TYPE.RICH_TEXT_EDITOR,
          responses: [
            {
              projectId: 101,
              teamName: "Team Atlas",
              projectName: "Atlas",
              submissionId: 501,
              submittedAt: "2026-02-20T10:00:00.000Z",
              answer: "<p>Hello&nbsp;<strong>team</strong></p>",
            },
            {
              projectId: 102,
              teamName: "Team Nova",
              projectName: "Nova",
              answer: "",
            },
          ],
        },
      ],
    },
  ],
  evaluationCollated: [
    {
      deadline: {
        id: 2,
        cohortYear: 2026,
        name: "Milestone 1 Peer Review",
        dueBy: "2026-03-05T00:00:00.000Z",
        type: DEADLINE_TYPE.EVALUATION,
        createdAt: "2026-02-01T00:00:00.000Z",
        updatedAt: "2026-02-01T00:00:00.000Z",
        evaluatorType: EVALUATOR_TYPE.TEAM,
      },
      questions: [
        {
          questionId: 21,
          sectionId: 2,
          sectionName: "Evaluation",
          sectionNumber: 1,
          questionNumber: 1,
          question: "Anonymous feedback",
          description: "",
          isAnonymous: true,
          isRequired: true,
          type: QUESTION_TYPE.PARAGRAPH,
          responses: [
            {
              responseId: "team-1",
              evaluateeProjectId: 101,
              evaluatorType: "Team" as const,
              evaluatorName: "Team Beta",
              evaluateeName: "Atlas",
              submissionId: 801,
              submittedAt: "2026-03-04T10:00:00.000Z",
              answer: "Well done",
            },
          ],
        },
      ],
    },
  ],
  milestoneDeadlines: [milestoneDeadline],
  selectedMilestoneDeadline: milestoneDeadline,
  handleSelectedMilestoneDeadlineChange: cy.spy().as("milestoneChangeSpy"),
  selectedSubmissionStatus: SUBMISSION_STATUS.ALL,
  handleSubmissionStatusChange: cy.spy().as("submissionStatusSpy"),
  searchTextInput: "",
  handleSearchInputChange: cy.spy().as("searchSpy"),
  viewAnonymousAnswers: false,
  handleToggleViewAnonymousAnswers: cy.spy().as("anonymousSpy"),
  isLoading: false,
  viewHasDropped: false,
  handleToggleViewDropped: cy.spy().as("droppedSpy"),
  ...overrides,
});

const buildAnonymousMilestoneProps = (): Props =>
  buildProps({
    collated: [
      {
        deadline: milestoneDeadline,
        questions: [
          {
            questionId: 31,
            sectionId: 3,
            sectionName: "Anonymous Section",
            sectionNumber: 1,
            questionNumber: 1,
            question: "Anonymous reflection",
            description: "",
            isAnonymous: true,
            isRequired: true,
            type: QUESTION_TYPE.PARAGRAPH,
            responses: [
              {
                projectId: 101,
                teamName: "Team Atlas",
                projectName: "Atlas",
                submissionId: 901,
                submittedAt: "2026-02-20T10:00:00.000Z",
                answer: "Private milestone answer",
              },
              {
                projectId: 102,
                teamName: "Team Nova",
                projectName: "Nova",
                answer: "",
              },
            ],
          },
        ],
      },
    ],
    evaluationCollated: [],
    viewAnonymousAnswers: true,
  });

describe("<CollatedMilestoneResponsesTable />", () => {
  it("renders formatted milestone and evaluation answers", () => {
    mount(<CollatedMilestoneResponsesTable {...buildProps()} />);

    cy.get("thead").contains("Team Name").should("be.visible");
    cy.get("thead").contains("Project Name").should("be.visible");
    cy.get("tbody").contains("Team Atlas").should("be.visible");
    cy.get("tbody").contains("Atlas").should("be.visible");
    cy.get("tbody").contains("Alpha, Gamma").should("be.visible");
    cy.get("tbody").contains("Hello team").should("be.visible");
    cy.get("tbody").contains("Response 1: Well done").should("be.visible");
    cy.get("tbody").contains("No submission").should("be.visible");
    cy.get('a[href="https://example.com/demo"]').should("be.visible");
  });

  it("switches to anonymous milestone mode and hides evaluation columns", () => {
    mount(
      <CollatedMilestoneResponsesTable {...buildAnonymousMilestoneProps()} />
    );

    cy.get("thead").contains("Response").should("be.visible");
    cy.get("thead").contains("Team Name").should("not.exist");
    cy.get("thead").contains("Project Name").should("not.exist");
    cy.get("tbody").contains("Response 1").should("be.visible");
    cy.get("tbody").contains("Private milestone answer").should("be.visible");
    cy.contains("Milestone 1 Peer Review").should("not.exist");
  });
});
