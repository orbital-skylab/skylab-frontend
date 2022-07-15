import { DeadlineDeliverable } from "@/types/deadlines";
import { STATUS } from "@/types/submissions";

export const generateSubmissionStatus = (
  deadlineDeliverable: DeadlineDeliverable
) => {
  if (!deadlineDeliverable.submission) {
    return STATUS.NOT_YET_STARTED;
  } else if (deadlineDeliverable.submission.isDraft) {
    return STATUS.SAVED_DRAFT;
  }
  const updatedAtDate = new Date(deadlineDeliverable.submission.updatedAt);
  const dueByDate = new Date(deadlineDeliverable.deadline.dueBy);
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
