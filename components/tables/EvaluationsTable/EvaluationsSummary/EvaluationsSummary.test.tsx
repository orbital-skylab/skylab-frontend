/* eslint-disable no-undef */
import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import { DEADLINE_TYPE, EVALUATOR_TYPE } from "@/types/deadlines";
import { LEVELS_OF_ACHIEVEMENT } from "@/types/projects";
import EvaluationsSummary from "./EvaluationsSummary";

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

const bothEvaluationDeadline = {
  id: 22,
  cohortYear: 2026,
  name: "Final Review Panel",
  dueBy: "2026-03-20T00:00:00.000Z",
  type: DEADLINE_TYPE.EVALUATION,
  createdAt: "2026-02-01T00:00:00.000Z",
  updatedAt: "2026-02-01T00:00:00.000Z",
  evaluatorType: EVALUATOR_TYPE.BOTH,
};

const teamSubmission = {
  relationId: 1,
  deadline: teamEvaluationDeadline,
  fromProject: {
    id: 101,
    name: "Beta",
    teamName: "Team Beta",
    proposalPdf: "",
    videoUrl: "",
    posterUrl: "",
    students: [],
    achievement: LEVELS_OF_ACHIEVEMENT.APOLLO,
    cohortYear: 2026,
    hasDropped: false,
  },
  toProject: {
    id: 102,
    name: "Atlas",
    teamName: "Team Atlas",
    proposalPdf: "",
    videoUrl: "",
    posterUrl: "",
    students: [],
    achievement: LEVELS_OF_ACHIEVEMENT.GEMINI,
    cohortYear: 2026,
    hasDropped: false,
  },
  submission: [
    {
      id: 901,
      deadline: teamEvaluationDeadline,
      deadlineId: teamEvaluationDeadline.id,
      updatedAt: "2026-03-05T10:00:00.000Z",
      isDraft: false,
      answers: [],
      sections: [],
    },
    {
      id: 902,
      deadline: bothEvaluationDeadline,
      deadlineId: bothEvaluationDeadline.id,
      updatedAt: "2026-03-18T10:00:00.000Z",
      isDraft: false,
      answers: [],
      sections: [],
    },
  ],
};

const adviserSubmission = {
  relationId: "A-102",
  deadline: bothEvaluationDeadline,
  fromUser: {
    id: 301,
    name: "Prof Oak",
    email: "oak@example.com",
  },
  toProject: teamSubmission.toProject,
  submission: [
    {
      id: 903,
      deadline: bothEvaluationDeadline,
      deadlineId: bothEvaluationDeadline.id,
      updatedAt: "2026-03-22T10:00:00.000Z",
      isDraft: false,
      answers: [],
      sections: [],
    },
  ],
};

describe("EvaluationsSummary", () => {
  it("counts only applicable expected responses for each evaluation deadline", () => {
    render(
      <EvaluationsSummary
        deadline={null}
        submissions={[teamSubmission, adviserSubmission]}
        evaluationDeadlines={[teamEvaluationDeadline, bothEvaluationDeadline]}
        evaluatorTypeFilter="All"
      />
    );

    const teamCard = screen
      .getByText("Peer Critique Round 1")
      .closest(".MuiCard-root");
    const bothCard = screen
      .getByText("Final Review Panel")
      .closest(".MuiCard-root");

    expect(teamCard).toBeTruthy();
    expect(bothCard).toBeTruthy();

    if (teamCard && bothCard) {
      expect(teamCard.textContent).toContain("1 total expected");
      expect(bothCard.textContent).toContain("2 total expected");
    }
  });

  it("applies the evaluator type filter to expected response counts", () => {
    render(
      <EvaluationsSummary
        deadline={null}
        submissions={[teamSubmission, adviserSubmission]}
        evaluationDeadlines={[teamEvaluationDeadline, bothEvaluationDeadline]}
        evaluatorTypeFilter="Adviser"
      />
    );

    const teamCard = screen
      .getByText("Peer Critique Round 1")
      .closest(".MuiCard-root");
    const bothCard = screen
      .getByText("Final Review Panel")
      .closest(".MuiCard-root");

    expect(teamCard).toBeTruthy();
    expect(bothCard).toBeTruthy();

    if (teamCard && bothCard) {
      expect(teamCard.textContent).toContain("0 total expected");
      expect(bothCard.textContent).toContain("1 total expected");
    }
  });
});
