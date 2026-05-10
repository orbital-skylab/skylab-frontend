import { generateSubmissionStatus } from "@/helpers/submissions";
import { Deadline } from "@/types/deadlines";
import { PossibleSubmission, STATUS } from "@/types/submissions";

export const getSubmissionArray = (submission: PossibleSubmission) => {
  if (Array.isArray(submission.submission)) {
    return submission.submission;
  }

  return submission.submission ? [submission.submission] : [];
};

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
    const students = submission.fromProject?.students ?? [];
    const submissionArray = getSubmissionArray(submission);
    const baseData = {
      "Project Id": submission.fromProject?.id ?? "",
      "Project Name": submission.fromProject?.name ?? "",
      "Team Name": submission.fromProject?.teamName ?? "",
      "Level of Achievement": submission.fromProject?.achievement ?? "",
      "Adviser Name": submission.fromProject?.adviser?.name ?? "",
      "Mentor Name": submission.fromProject?.mentor?.name ?? "",
      "Student 1 Name": students[0]?.name ?? "",
      "Student 1 Email": students[0]?.email ?? "",
      "Student 2 Name": students[1]?.name ?? "",
      "Student 2 Email": students[1]?.email ?? "",
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
        [`${selectedMilestoneDeadline.name} Submission Updated At`]:
          submission.updatedAt ?? "",
        [`${selectedMilestoneDeadline.name} Status`]:
          getStatusText(submissionStatus),
      };
    } else {
      const milestoneStatuses = csvMilestones.map((milestone) => {
        const sub = submissionArray.find(
          (sub) => sub.deadlineId === milestone.id
        );
        if (!sub) {
          return {
            [`${milestone.name} Submission Updated At`]: "",
            [`${milestone.name} Status`]: "NOT_SUBMITTED",
          };
        }
        const submissionStatus = generateSubmissionStatus({
          submissionId: sub.id,
          isDraft: false,
          updatedAt: sub.updatedAt,
          dueBy: milestone.dueBy,
        });
        return {
          [`${milestone.name} Submission Updated At`]: sub.updatedAt ?? "",
          [`${milestone.name} Status`]: getStatusText(submissionStatus),
        };
      });

      return {
        ...baseData,
        ...Object.assign({}, ...milestoneStatuses),
      };
    }
  });
};
