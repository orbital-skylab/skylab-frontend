/* eslint-disable no-undef */
import { describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

import { DEADLINE_TYPE, EVALUATOR_TYPE } from "@/types/deadlines";
import { LEVELS_OF_ACHIEVEMENT } from "@/types/projects";

jest.mock("@/components/typography/HoverLink", () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("@/helpers/dates", () => ({
  isoDateToLocaleDateWithTime: () => "16 Apr 2026, 10:00",
}));

const EvaluationsRow = require("./EvaluationsRow").default;

const teamOnlyDeadline = {
  id: 21,
  cohortYear: 2026,
  name: "Team Peer Review",
  dueBy: "2026-03-10T00:00:00.000Z",
  type: DEADLINE_TYPE.EVALUATION,
  createdAt: "2026-02-01T00:00:00.000Z",
  updatedAt: "2026-02-01T00:00:00.000Z",
  evaluatorType: EVALUATOR_TYPE.TEAM,
};

const bothDeadline = {
  id: 22,
  cohortYear: 2026,
  name: "Final Evaluation",
  dueBy: "2026-03-15T00:00:00.000Z",
  type: DEADLINE_TYPE.EVALUATION,
  createdAt: "2026-02-01T00:00:00.000Z",
  updatedAt: "2026-02-01T00:00:00.000Z",
  evaluatorType: EVALUATOR_TYPE.BOTH,
};

const evaluatorProject = {
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
};

const evaluateeProject = {
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
};

describe("EvaluationsRow", () => {
  it("renders a team evaluation row with a submission link for a selected deadline", () => {
    render(
      <table>
        <tbody>
          <EvaluationsRow
            data={{
              relationId: 18,
              deadline: bothDeadline,
              fromProject: evaluatorProject,
              toProject: evaluateeProject,
              submission: [
                {
                  id: 501,
                  deadline: bothDeadline,
                  deadlineId: bothDeadline.id,
                  updatedAt: "2026-03-12T10:00:00.000Z",
                  isDraft: false,
                  answers: [],
                  sections: [],
                },
              ],
            }}
            deadline={bothDeadline}
            evaluationDeadlines={[teamOnlyDeadline, bothDeadline]}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText("18")).toBeTruthy();
    expect(screen.getByText("Team")).toBeTruthy();

    const evaluatorLink = screen.getByRole("link", { name: "Team Beta" });
    const evaluateeLink = screen.getByRole("link", { name: "Team Atlas" });
    const submissionLink = screen.getByRole("link", {
      name: "Submitted on 16 Apr 2026, 10:00",
    });

    expect(evaluatorLink.getAttribute("href")).toBe("/projects/101");
    expect(evaluateeLink.getAttribute("href")).toBe("/projects/102");
    expect(submissionLink.getAttribute("href")).toBe("/submissions/501");
  });

  it("renders N/A for non-applicable deadlines and late status for adviser rows", () => {
    render(
      <table>
        <tbody>
          <EvaluationsRow
            data={{
              relationId: "A-102",
              deadline: bothDeadline,
              fromUser: {
                id: 301,
                name: "Prof Oak",
                email: "oak@example.com",
              },
              toProject: evaluateeProject,
              submission: [
                {
                  id: 601,
                  deadline: bothDeadline,
                  deadlineId: bothDeadline.id,
                  updatedAt: "2026-03-18T10:00:00.000Z",
                  isDraft: false,
                  answers: [],
                  sections: [],
                },
              ],
            }}
            deadline={null}
            evaluationDeadlines={[teamOnlyDeadline, bothDeadline]}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText("Adviser")).toBeTruthy();

    const evaluatorLink = screen.getByRole("link", { name: "Prof Oak" });
    expect(evaluatorLink.getAttribute("href")).toBe("/users/301");

    expect(screen.getByText("N/A")).toBeTruthy();
    const lateSubmissionLink = screen.getByRole("link", {
      name: "Submitted late on 16 Apr 2026, 10:00",
    });
    expect(lateSubmissionLink.getAttribute("href")).toBe("/submissions/601");
  });
});
