/* eslint-disable no-undef */
import { describe, expect, it } from "@jest/globals";

import {
  DEADLINE_TYPE,
  EVALUATOR_TYPE,
  QUESTION_TYPE,
} from "@/types/deadlines";
import { LEVELS_OF_ACHIEVEMENT } from "@/types/projects";
import { mapEvaluationData } from "./EvaluationsActionRow.helpers";

const teamEvaluationDeadline = {
  id: 21,
  cohortYear: 2026,
  name: "Peer Critique Round 1",
  dueBy: "2026-03-10T00:00:00.000Z",
  type: DEADLINE_TYPE.EVALUATION,
  createdAt: "2026-02-01T00:00:00.000Z",
  updatedAt: "2026-02-01T00:00:00.000Z",
  evaluatorType: EVALUATOR_TYPE.TEAM,
};

const adviserEvaluationDeadline = {
  id: 22,
  cohortYear: 2026,
  name: "Adviser Feedback Review",
  dueBy: "2026-03-05T00:00:00.000Z",
  type: DEADLINE_TYPE.EVALUATION,
  createdAt: "2026-02-01T00:00:00.000Z",
  updatedAt: "2026-02-01T00:00:00.000Z",
  evaluatorType: EVALUATOR_TYPE.ADVISER,
};

const evaluateeProject = {
  id: 102,
  name: "Atlas",
  teamName: "Team Atlas",
  proposalPdf: "",
  videoUrl: "",
  posterUrl: "",
  students: [
    {
      id: 1,
      studentId: 1,
      name: "Alice",
      email: "alice@example.com",
      cohortYear: 2026,
      projectId: 102,
      nusnetId: "e0000001",
      matricNo: "A0000001A",
    },
    {
      id: 2,
      studentId: 2,
      name: "Bob",
      email: "bob@example.com",
      cohortYear: 2026,
      projectId: 102,
      nusnetId: "e0000002",
      matricNo: "A0000002A",
    },
  ],
  achievement: LEVELS_OF_ACHIEVEMENT.GEMINI,
  cohortYear: 2026,
  hasDropped: false,
};

const teamEvaluation = {
  relationId: 1,
  deadline: teamEvaluationDeadline,
  fromProject: {
    id: 101,
    name: "Beta",
    teamName: "Team Beta",
    proposalPdf: "",
    videoUrl: "",
    posterUrl: "",
    students: [
      {
        id: 11,
        studentId: 11,
        name: "Chloe",
        email: "chloe@example.com",
        cohortYear: 2026,
        projectId: 101,
        nusnetId: "e0000011",
        matricNo: "A0000011A",
      },
      {
        id: 12,
        studentId: 12,
        name: "Dan",
        email: "dan@example.com",
        cohortYear: 2026,
        projectId: 101,
        nusnetId: "e0000012",
        matricNo: "A0000012A",
      },
    ],
    achievement: LEVELS_OF_ACHIEVEMENT.APOLLO,
    cohortYear: 2026,
    hasDropped: false,
  },
  toProject: evaluateeProject,
  submission: [
    {
      id: 801,
      deadline: teamEvaluationDeadline,
      deadlineId: teamEvaluationDeadline.id,
      updatedAt: "2026-03-03T10:00:00.000Z",
      isDraft: false,
      answers: [],
      sections: [],
    },
  ],
};

const adviserEvaluation = {
  relationId: "A-102",
  deadline: adviserEvaluationDeadline,
  fromUser: {
    id: 301,
    name: "Prof Oak",
    email: "oak@example.com",
  },
  toProject: evaluateeProject,
  submission: [
    {
      id: 802,
      deadline: adviserEvaluationDeadline,
      deadlineId: adviserEvaluationDeadline.id,
      updatedAt: "2026-03-08T10:00:00.000Z",
      isDraft: false,
      answers: [],
      sections: [],
    },
  ],
};

describe("mapEvaluationData", () => {
  it("uses nested submissions for a single-evaluation all export", () => {
    const [result] = mapEvaluationData(
      [adviserEvaluation],
      [adviserEvaluationDeadline],
      false
    );

    expect(result).toMatchObject({
      "Relation ID": "A-102",
      "Evaluator Type": "Adviser",
      "Evaluator Team": "N/A",
      "Evaluator Student 1": "Prof Oak",
      "Evaluator Email 1": "oak@example.com",
      "Evaluatee Team": "Team Atlas",
      "Evaluatee Student 1": "Alice",
      "Evaluatee Student 2": "Bob",
      "Adviser Feedback Review Status": "SUBMITTED_LATE",
    });
  });

  it("uses the selected evaluation submission for a selected evaluation export", () => {
    const [result] = mapEvaluationData(
      [
        {
          ...adviserEvaluation,
          submission: adviserEvaluation.submission[0],
        },
      ],
      [adviserEvaluationDeadline],
      true
    );

    expect(result).toMatchObject({
      "Relation ID": "A-102",
      "Evaluator Type": "Adviser",
      "Adviser Feedback Review Submission Updated At":
        "2026-03-08T10:00:00.000Z",
      "Adviser Feedback Review Status": "SUBMITTED_LATE",
    });
  });

  it("adds submitted answers as question columns", () => {
    const [result] = mapEvaluationData(
      [
        {
          ...teamEvaluation,
          submission: {
            ...teamEvaluation.submission[0],
            answers: [
              {
                questionId: 91,
                answer: "Clear and actionable",
                question: {
                  id: 91,
                  sectionId: 9,
                  questionNumber: 2,
                  question: "What was useful?",
                  type: QUESTION_TYPE.PARAGRAPH,
                },
              },
            ],
          },
        },
      ],
      [teamEvaluationDeadline],
      true
    );

    expect(result).toMatchObject({
      "Peer Critique Round 1 - Q2: What was useful?": "Clear and actionable",
    });
  });

  it("keeps answer columns when the first exported row is unsubmitted", () => {
    const submittedEvaluation = {
      ...teamEvaluation,
      submission: {
        ...teamEvaluation.submission[0],
        answers: [
          {
            questionId: 91,
            answer: "Useful examples",
            question: {
              id: 91,
              sectionId: 9,
              questionNumber: 2,
              question: "What was useful?",
              type: QUESTION_TYPE.PARAGRAPH,
            },
          },
        ],
      },
    };
    const [unsubmittedResult] = mapEvaluationData(
      [{ ...teamEvaluation, submission: undefined }, submittedEvaluation],
      [teamEvaluationDeadline],
      true
    );

    expect(unsubmittedResult).toHaveProperty(
      "Peer Critique Round 1 - Q2: What was useful?",
      ""
    );
  });

  it("creates dynamic status columns across multiple evaluation deadlines", () => {
    const [teamResult, adviserResult] = mapEvaluationData(
      [teamEvaluation, adviserEvaluation],
      [teamEvaluationDeadline, adviserEvaluationDeadline]
    );

    expect(teamResult).toMatchObject({
      "Evaluator Type": "Team",
      "Evaluator Team": "Team Beta",
      "Evaluator Student 1": "Chloe",
      "Evaluator Email 1": "chloe@example.com",
      "Peer Critique Round 1 Status": "SUBMITTED",
      "Adviser Feedback Review Status": "N/A",
    });

    expect(adviserResult).toMatchObject({
      "Evaluator Type": "Adviser",
      "Peer Critique Round 1 Status": "N/A",
      "Adviser Feedback Review Status": "SUBMITTED_LATE",
    });
  });
});
