import EvaluationsRow from "@/components/tables/EvaluationsTable/EvaluationsRow";
import { DEADLINE_TYPE, EVALUATOR_TYPE } from "@/types/deadlines";
import { LEVELS_OF_ACHIEVEMENT } from "@/types/projects";
import { mount } from "cypress/react18";

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

describe("<EvaluationsRow />", () => {
  it("renders a team row with submission details for a selected deadline", () => {
    mount(
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

    cy.contains("td", "18").should("be.visible");
    cy.contains("td", "Team").should("be.visible");
    cy.contains("Team Beta").should("be.visible");
    cy.contains("Team Atlas").should("be.visible");
    cy.contains("Submitted").should("be.visible");
  });

  it("renders N/A and a late status for adviser rows in all-evaluations mode", () => {
    mount(
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

    cy.contains("td", "Adviser").should("be.visible");
    cy.contains("Prof Oak").should("be.visible");
    cy.contains("td", "N/A").should("be.visible");
    cy.contains("Submitted late").should("be.visible");
  });
});
