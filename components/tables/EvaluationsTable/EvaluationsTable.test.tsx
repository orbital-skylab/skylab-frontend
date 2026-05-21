/* eslint-disable no-undef */
import { describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import { DEADLINE_TYPE, EVALUATOR_TYPE } from "@/types/deadlines";
import { LEVELS_OF_ACHIEVEMENT } from "@/types/projects";
import EvaluationsTable from "./EvaluationsTable";

jest.mock("./EvaluationsRow", () => {
  const MockEvaluationsRow = () => <tr data-testid="evaluation-row" />;
  MockEvaluationsRow.displayName = "MockEvaluationsRow";
  return MockEvaluationsRow;
});

const evaluationOne = {
  id: 21,
  cohortYear: 2026,
  name: "Peer Critique Round 1",
  dueBy: "2026-03-10T00:00:00.000Z",
  type: DEADLINE_TYPE.EVALUATION,
  createdAt: "2026-02-01T00:00:00.000Z",
  updatedAt: "2026-02-01T00:00:00.000Z",
  evaluatorType: EVALUATOR_TYPE.TEAM,
};

const evaluationTwo = {
  id: 22,
  cohortYear: 2026,
  name: "Adviser Feedback Review",
  dueBy: "2026-03-05T00:00:00.000Z",
  type: DEADLINE_TYPE.EVALUATION,
  createdAt: "2026-02-01T00:00:00.000Z",
  updatedAt: "2026-02-01T00:00:00.000Z",
  evaluatorType: EVALUATOR_TYPE.ADVISER,
};

const submissions = [
  {
    relationId: 1,
    deadline: evaluationOne,
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
    submission: [],
  },
];

describe("EvaluationsTable", () => {
  it("renders dynamic evaluation deadline headers instead of hardcoded labels", () => {
    render(
      <EvaluationsTable
        deadline={null}
        evaluationDeadlines={[evaluationOne, evaluationTwo]}
        submissions={submissions}
      />
    );

    expect(screen.getByText("Peer Critique Round 1")).toBeTruthy();
    expect(screen.getByText("Adviser Feedback Review")).toBeTruthy();
    expect(screen.queryByText("Evaluation 1")).toBeNull();
    expect(screen.queryByText("Evaluation 2")).toBeNull();
  });

  it("renders a single status column when a specific evaluation is selected", () => {
    render(
      <EvaluationsTable
        deadline={evaluationOne}
        evaluationDeadlines={[evaluationOne, evaluationTwo]}
        submissions={submissions}
      />
    );

    expect(screen.getByText("Status")).toBeTruthy();
    expect(screen.queryByText("Peer Critique Round 1")).toBeNull();
    expect(screen.queryByText("Adviser Feedback Review")).toBeNull();
  });
});
