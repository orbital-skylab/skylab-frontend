import { DeadlineDeliverable, VIEWER_ROLE } from "@/types/deadlines";
import { STATUS, Submission } from "@/types/submissions";
import { User } from "@/types/users";

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

export const getFromTeamOrUserId = (
  user: User | undefined,
  viewerRole: VIEWER_ROLE
) => {
  if (!user || viewerRole === undefined) {
    return {};
  }

  switch (viewerRole) {
    case VIEWER_ROLE.TEAMS:
      return { fromTeamId: user.student?.teamId };

    case VIEWER_ROLE.ADVISERS:
      return { fromUserId: user.adviser?.id };
  }
};

/**
 * Retrieve the toUserId or toTeamId, whichever the submission is addressed to
 * If the submission is not addressed to a user or team, return an empty object
 */
export const getToTeamOrUserId = (deadlineDeliverable: DeadlineDeliverable) => {
  if (deadlineDeliverable.toTeam && deadlineDeliverable.toUser) {
    alert(
      "There should not be a deadline deliverable addressed to a team and a user"
    );
    return {};
  } else if (deadlineDeliverable.toTeam) {
    return { toTeamId: deadlineDeliverable.toTeam.id };
  } else if (deadlineDeliverable.toUser) {
    return { toUserId: deadlineDeliverable.toUser.id };
  } else {
    return {};
  }
};

export const isSubmissionsFromTeamOrUser = (
  submission: Submission | undefined,
  user: User | undefined
) => {
  if (!submission || !user) {
    return false;
  }

  // Submitter is a team
  if (submission.fromTeam) {
    return user.student?.teamId === submission.fromTeam.id;
  }
  // Submitter is a user
  if (submission.fromUser) {
    return user.id === submission.fromUser.id;
  }

  return false;
};
