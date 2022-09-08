import { generateSubmissionStatus } from "@/helpers/submissions";
import { Deadline } from "@/types/deadlines";
import { PossibleSubmission } from "@/types/submissions";

export const mapData = (
  submissions: PossibleSubmission[],
  selectedMilestoneDeadline: Deadline
) => {
  const mappedData = submissions.map((submission) => ({
    "Project Id": submission.fromProject?.id ?? "",
    "Project Name": submission.fromProject?.name ?? "",
    "Level of Achievement": submission.fromProject?.achievement ?? "",
    "Adviser Name": submission.fromProject?.adviser?.name ?? "",
    "Mentor Name": submission.fromProject?.mentor?.name ?? "",
    "Submission ID": submission.id ?? "",
    "Submission Updated At": submission.updatedAt ?? "",
    "Submission Status": generateSubmissionStatus({
      submissionId: submission.id,
      isDraft: false,
      updatedAt: submission.updatedAt,
      dueBy: selectedMilestoneDeadline.dueBy,
    }),
  }));

  return mappedData;
};
