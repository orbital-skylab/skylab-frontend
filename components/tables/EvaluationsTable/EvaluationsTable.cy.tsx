import EvaluationsTable from "@/components/tables/EvaluationsTable";
import { DEADLINE_TYPE, EVALUATOR_TYPE } from "@/types/deadlines";
import { LEVELS_OF_ACHIEVEMENT } from "@/types/projects";
import { mount } from "cypress/react18";

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
  dueBy: "2026-03-15T00:00:00.000Z",
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

describe("<EvaluationsTable />", () => {
  it("renders dynamic evaluation deadline headers in all-evaluations mode", () => {
    mount(
      <EvaluationsTable
        deadline={null}
        evaluationDeadlines={[evaluationOne, evaluationTwo]}
        submissions={submissions}
      />
    );

    cy.get("thead").contains("Relation ID").should("be.visible");
    cy.get("thead").contains("Evaluator Type").should("be.visible");
    cy.get("thead").contains("Evaluator").should("be.visible");
    cy.get("thead").contains("Evaluatee").should("be.visible");
    cy.get("thead").contains("Peer Critique Round 1").should("be.visible");
    cy.get("thead")
      .contains("Adviser Feedback Review")
      .scrollIntoView()
      .should("be.visible");
    cy.get("thead").should("not.contain.text", "Status");
  });

  it("renders a single status column for a selected evaluation", () => {
    mount(
      <EvaluationsTable
        deadline={evaluationOne}
        evaluationDeadlines={[evaluationOne, evaluationTwo]}
        submissions={submissions}
      />
    );

    cy.get("thead").contains("Status").should("be.visible");
    cy.get("thead").should("not.contain.text", "Peer Critique Round 1");
    cy.get("thead").should("not.contain.text", "Adviser Feedback Review");
  });
});
