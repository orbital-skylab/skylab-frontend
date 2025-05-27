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
  csvMilestones: Deadline[]
) => {
  return submissions.map((submission) => {
    const baseData = {
      "Project Id": submission.fromProject?.id ?? "",
      "Project Name": submission.fromProject?.name ?? "",
      "Level of Achievement": submission.fromProject?.achievement ?? "",
      "Adviser Name": submission.fromProject?.adviser?.name ?? "",
      "Mentor Name": submission.fromProject?.mentor?.name ?? "",
    };

    if (csvMilestones.length === 1) {
      const selectedMilestoneDeadline = csvMilestones[0];
      const submissionStatus = generateSubmissionStatus({
        submissionId: submission.id,
        isDraft: false,
        updatedAt: submission.updatedAt,
        dueBy: selectedMilestoneDeadline.dueBy,
      });

      return {
        ...baseData,
        "Submission ID": submission.id ?? "",
        "Submission Updated At": submission.updatedAt ?? "",
        "Submission Status": getStatusText(submissionStatus),
      };
    } else {
      const milestoneStatuses = csvMilestones.map((milestone, index) => {
        const sub = submission.submission?.find(
          (sub) => sub.deadlineId === milestone.id
        );
        if (!sub) {
          return {
            [`Milestone ${index + 1} Submission ID`]: "",
            [`Milestone ${index + 1} Submission Updated At`]: "",
            [`Milestone ${index + 1}`]: "NOT_SUBMITTED",
          };
        }
        const submissionStatus = generateSubmissionStatus({
          submissionId: sub.id,
          isDraft: false,
          updatedAt: sub.updatedAt,
          dueBy: milestone.dueBy,
        });
        return {
          [`Milestone ${index + 1} Submission ID`]: sub.id ?? "",
          [`Milestone ${index + 1} Submission Updated At`]: sub.updatedAt ?? "",
          [`Milestone ${index + 1}`]: getStatusText(submissionStatus),
        };
      });

      return {
        ...baseData,
        ...Object.assign({}, ...milestoneStatuses),
      };
    }
  });
};
