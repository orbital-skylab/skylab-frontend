import { generateSubmissionStatus } from "@/helpers/submissions";
import { Deadline } from "@/types/deadlines";
import { PossibleSubmission, STATUS } from "@/types/submissions";

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

export const mapEvaluationData = (
  evaluations: PossibleSubmission[],
  csvEvaluations: Deadline[]
) => {
  return evaluations.map((res) => {
    const evaluatorProject = res.fromProject;
    const evaluatorUser = res.fromUser;
    const evaluateeProject = res.toProject;

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
      "Evaluatee Team": evaluateeProject?.teamName ?? "N/A",
      "Evaluatee Student 1": evaluateeStudents[0]?.name ?? "",
      "Evaluatee Student 2": evaluateeStudents[1]?.name ?? "",
    };

    if (csvEvaluations.length === 1) {
      const selectedEvaluationDeadline = csvEvaluations[0];
      const sub = Array.isArray(res.submission)
        ? res.submission[0]
        : res.submission;
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
      };
    } else {
      const evaluationStatuses = csvEvaluations.map((evaluation) => {
        const submissionsArray = Array.isArray(res.submission)
          ? res.submission
          : res.submission
          ? [res.submission]
          : [];

        const sub = submissionsArray.find(
          (sub) => sub.deadlineId === evaluation.id
        );

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
        };
      });

      return {
        ...baseData,
        ...Object.assign({}, ...evaluationStatuses),
      };
    }
  });
};
