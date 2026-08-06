import { generateSubmissionStatus } from "@/helpers/submissions";
import { Deadline } from "@/types/deadlines";
import { PossibleSubmission, STATUS, Submission } from "@/types/submissions";

const getStatusText = (status: STATUS): string => {
  switch (status) {
    case STATUS.SUBMITTED:
      return "SUBMITTED";
    case STATUS.SUBMITTED_LATE:
      return "SUBMITTED_LATE";
    default:
      return "NOT_SUBMITTED";
  }
};

const getAnswerColumn = (
  deadline: Deadline,
  answer: Submission["answers"][number]
) =>
  `${deadline.name} - Q${
    answer.question?.questionNumber ?? answer.questionId
  }: ${answer.question?.question ?? `Question ${answer.questionId}`}`;

const getSubmissionForDeadline = (
  evaluation: PossibleSubmission,
  deadlineId: number
) => {
  const submission = evaluation.submission;
  if (Array.isArray(submission)) {
    return submission.find((item) => item.deadlineId === deadlineId);
  }
  return submission?.deadlineId === deadlineId ? submission : undefined;
};

const isDeadlineApplicable = (
  deadline: Deadline,
  evaluation: PossibleSubmission
) =>
  !deadline.evaluatorType ||
  deadline.evaluatorType === "Both" ||
  (deadline.evaluatorType === "Team" && !!evaluation.fromProject) ||
  (deadline.evaluatorType === "Adviser" && !!evaluation.fromUser);

const getAnswerColumnsByDeadline = (
  evaluations: PossibleSubmission[],
  deadlines: Deadline[]
) =>
  new Map(
    deadlines.map((deadline) => [
      deadline.id,
      Array.from(
        new Set(
          evaluations.flatMap((evaluation) =>
            (
              getSubmissionForDeadline(evaluation, deadline.id)?.answers ?? []
            ).map((answer) => getAnswerColumn(deadline, answer))
          )
        )
      ),
    ])
  );

const mapAnswerColumns = (
  submission: Submission | undefined,
  deadline: Deadline,
  columns: string[]
) => ({
  ...Object.fromEntries(columns.map((column) => [column, ""])),
  ...Object.fromEntries(
    (submission?.answers ?? []).map((answer) => [
      getAnswerColumn(deadline, answer),
      answer.answer ?? "",
    ])
  ),
});

export const mapEvaluationData = (
  evaluations: PossibleSubmission[],
  csvEvaluations: Deadline[],
  isSelectedEvaluationExport = false
) => {
  const answerColumnsByDeadline = getAnswerColumnsByDeadline(
    evaluations,
    csvEvaluations
  );

  return evaluations.map((res) => {
    const evaluatorProject = res.fromProject;
    const evaluatorUser = res.fromUser;
    const evaluateeProject = res.toProject;
    const evaluateeUser = res.toUser;

    const evaluatorStudents = evaluatorProject?.students ?? [];
    const evaluateeStudents = evaluateeProject?.students ?? [];

    const evaluatorTeam = evaluatorProject?.teamName ?? "N/A";
    const evaluatorName1 = evaluatorUser
      ? evaluatorUser.name
      : evaluatorStudents[0]?.name ?? "";
    const evaluatorEmail1 = evaluatorUser
      ? evaluatorUser.email
      : evaluatorStudents[0]?.email ?? "";
    const evaluatorName2 = evaluatorUser
      ? ""
      : evaluatorStudents[1]?.name ?? "";
    const evaluatorEmail2 = evaluatorUser
      ? ""
      : evaluatorStudents[1]?.email ?? "";

    const baseData = {
      "Relation ID": res.relationId,
      "Evaluator Type": evaluatorUser ? "Adviser" : "Team",

      // Evaluator Info
      "Evaluator Team": evaluatorTeam,
      "Evaluator Student 1": evaluatorName1,
      "Evaluator Email 1": evaluatorEmail1,
      "Evaluator Student 2": evaluatorName2,
      "Evaluator Email 2": evaluatorEmail2,

      // Evaluatee Info
      "Evaluatee Type": evaluateeProject ? "Team" : "Adviser",
      Evaluatee:
        evaluateeProject?.teamName ??
        evaluateeProject?.name ??
        evaluateeUser?.name ??
        "N/A",
      "Evaluatee Team": evaluateeProject?.teamName ?? "N/A",
      "Evaluatee Student 1": evaluateeStudents[0]?.name ?? "",
      "Evaluatee Student 2": evaluateeStudents[1]?.name ?? "",
    };

    if (isSelectedEvaluationExport) {
      const selectedEvaluationDeadline = csvEvaluations[0];
      const sub = getSubmissionForDeadline(
        res,
        selectedEvaluationDeadline.id
      );
      const submissionStatus = generateSubmissionStatus({
        submissionId: sub?.id,
        isDraft: false,
        updatedAt: sub?.updatedAt,
        dueBy: selectedEvaluationDeadline.dueBy,
      });

      return {
        ...baseData,
        [`${selectedEvaluationDeadline.name} Submission Updated At`]:
          sub?.updatedAt ?? "",
        [`${selectedEvaluationDeadline.name} Status`]:
          getStatusText(submissionStatus),
        ...mapAnswerColumns(
          sub,
          selectedEvaluationDeadline,
          answerColumnsByDeadline.get(selectedEvaluationDeadline.id) ?? []
        ),
      };
    } else {
      const evaluationStatuses = csvEvaluations.map((evaluation) => {
        if (!isDeadlineApplicable(evaluation, res)) {
          return {
            [`${evaluation.name} Submission Updated At`]: "",
            [`${evaluation.name} Status`]: "N/A",
            ...mapAnswerColumns(
              undefined,
              evaluation,
              answerColumnsByDeadline.get(evaluation.id) ?? []
            ),
          };
        }

        const sub = getSubmissionForDeadline(res, evaluation.id);

        if (!sub) {
          return {
            [`${evaluation.name} Submission Updated At`]: "",
            [`${evaluation.name} Status`]: "NOT_SUBMITTED",
          };
        }
        const submissionStatus = generateSubmissionStatus({
          submissionId: sub.id,
          isDraft: false,
          updatedAt: sub.updatedAt,
          dueBy: evaluation.dueBy,
        });

        return {
          [`${evaluation.name} Submission Updated At`]: sub.updatedAt ?? "",
          [`${evaluation.name} Status`]: getStatusText(submissionStatus),
          ...mapAnswerColumns(
            sub,
            evaluation,
            answerColumnsByDeadline.get(evaluation.id) ?? []
          ),
        };
      });

      return {
        ...baseData,
        ...Object.assign({}, ...evaluationStatuses),
      };
    }
  });
};
