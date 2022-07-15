import { DeadlineDeliverable } from "@/types/deadlines";
import { STATUS } from "@/types/submissions";

export const generateSubmissionStatus = ({
  submissionId,
  isDraft,
  updatedAt,
  dueBy,
}: {
  submissionId: number | undefined;
  isDraft: boolean | undefined;
  updatedAt: string | undefined;
  dueBy: string;
}) => {
  if (
    submissionId === undefined ||
    updatedAt === undefined ||
    isDraft === undefined
  ) {
    return STATUS.NOT_YET_STARTED;
  } else if (isDraft === true) {
    return STATUS.SAVED_DRAFT;
  }
  const updatedAtDate = new Date(updatedAt);
  const dueByDate = new Date(dueBy);
  if (updatedAtDate < dueByDate) {
    return STATUS.SUBMITTED;
  } else {
    return STATUS.SUBMITTED_LATE;
  }
};

/**
 * Retrieve the toUserId or toProjectId, whichever the submission is addressed to
 * If the submission is not addressed to a user or project, return an empty object
 */
export const getToProjectOrUserId = (
  deadlineDeliverable: DeadlineDeliverable
) => {
  if (deadlineDeliverable.toProject && deadlineDeliverable.toUser) {
    alert(
      "There should not be a deadline deliverable addressed to a project and a user"
    );
    return {};
  } else if (deadlineDeliverable.toProject) {
    return { toProjectId: deadlineDeliverable.toProject.id };
  } else if (deadlineDeliverable.toUser) {
    return { toUserId: deadlineDeliverable.toUser.id };
  } else {
    return {};
  }
};
