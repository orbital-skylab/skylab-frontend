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

export const mapData = (
  submissions: PossibleSubmission[],
  csvEvaluations: Deadline[]
) => {
  return submissions.map((submission) => {
    const evaluatorType = submission.fromProject ? "Team" : "Adviser";
    const evaluatorName =
      submission.fromProject?.name || submission.fromUser?.name || "N/A";
    const adviserName = submission.fromProject?.adviser?.name || "N/A"; // If it's an adviser evaluating, they don't have an "adviser"

    const baseData = {
      "Relation Id": submission.relationId ?? "",
      "Evaluator Type": evaluatorType,
      "Evaluator Name": evaluatorName,
      "Evaluatee Name": submission.toProject?.name ?? "",
      "Adviser Name": adviserName,
    };

    if (csvEvaluations.length === 1) {
      const selectedEvaluationsDeadline = csvEvaluations[0];
      const submissionStatus = generateSubmissionStatus({
        submissionId: submission.id,
        isDraft: false,
        updatedAt: submission.updatedAt,
        dueBy: selectedEvaluationsDeadline.dueBy,
      });

      return {
        ...baseData,
        "Submission ID": submission.id ?? "",
        "Submission Updated At": submission.updatedAt ?? "",
        "Submission Status": getStatusText(submissionStatus),
      };
    } else {
      const evaluationStatuses = csvEvaluations.map((evaluation, index) => {
        const sub = submission.submission?.find(
          (sub) => sub.deadlineId === evaluation.id
        );
        if (!sub) {
          return {
            [`Evaluation ${index + 1} Submission ID`]: "",
            [`Evaluation ${index + 1} Submission Updated At`]: "",
            [`Evaluation ${index + 1}`]: "NOT_SUBMITTED",
          };
        }
        const submissionStatus = generateSubmissionStatus({
          submissionId: sub.id,
          isDraft: false,
          updatedAt: sub.updatedAt,
          dueBy: evaluation.dueBy,
        });
        return {
          [`Evaluation ${index + 1} Submission ID`]: sub.id ?? "",
          [`Evaluation ${index + 1} Submission Updated At`]:
            sub.updatedAt ?? "",
          [`Evaluation ${index + 1}`]: getStatusText(submissionStatus),
        };
      });

      return {
        ...baseData,
        ...Object.assign({}, ...evaluationStatuses),
      };
    }
  });
};
