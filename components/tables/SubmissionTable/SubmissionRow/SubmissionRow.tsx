import { FC } from "react";
import Link from "next/link";
// Components
import { Box, Button, TableCell, TableRow } from "@mui/material";
// Helpers
import { generateSubmissionStatus } from "@/helpers/submissions";
import { PAGES } from "@/helpers/navigation";
// Hooks
import useAuth from "@/hooks/useAuth";
// Types
import { PossibleSubmission, STATUS } from "@/types/submissions";

type Props = {
  deadlineDueBy: string;
  submission: PossibleSubmission;
  shouldIncludeToColumn: boolean;
};

const SubmissionRow: FC<Props> = ({
  deadlineDueBy,
  submission,
  shouldIncludeToColumn,
}) => {
  const { user } = useAuth();
  const status = generateSubmissionStatus({
    submissionId: submission.submissionId,
    isDraft: false, // You cannot view other's drafts
    updatedAt: submission.updatedAt,
    dueBy: deadlineDueBy,
  });

  const generateFromCell = (submission: PossibleSubmission) => {
    if (
      (submission.fromProject && submission.fromUser) ||
      (!submission.fromProject && !submission.fromUser)
    ) {
      alert("The submission should be from EITHER a project OR a user");
      return "Error";
    } else if (submission.fromProject) {
      return (
        <Link href={`${PAGES.PROJECTS}/${submission.fromProject.id}`}>
          {submission.fromProject.name}
        </Link>
      );
    } else if (submission.fromUser) {
      return (
        <Link href={`${PAGES.USERS}/${submission.fromUser.id}`}>
          {submission.fromUser.name}
        </Link>
      );
    } else {
      alert("This line should never be read");
      return "Error";
    }
  };

  const generateToCell = (submission: PossibleSubmission) => {
    if (submission.toProject && submission.toUser) {
      alert(
        "There should not be a submission addressed to a project and a user"
      );
      return "Error";
    } else if (submission.toProject) {
      if (submission.toProject.id === user?.student?.projectId) {
        return "<Should not be visible>"; // Column should not be showing
      }
      return (
        <Link href={`${PAGES.PROJECTS}/${submission.toProject.id}`}>
          {submission.toProject.name}
        </Link>
      );
    } else if (submission.toUser) {
      if (submission.toUser.id === user?.id) {
        return "<Should not be visible>"; // Column should not be showing
      }
      return (
        <Link href={`${PAGES.USERS}/${submission.toUser.id}`}>
          {submission.toUser.name}
        </Link>
      );
    } else {
      return "-";
    }
  };

  const generateStatusCell = (status: STATUS) => {
    switch (status) {
      case STATUS.NOT_YET_STARTED: {
        return (
          <Box component="span" sx={{ color: "gray" }}>
            Not Yet Submitted
          </Box>
        );
      }
      case STATUS.SAVED_DRAFT: {
        return "Saved Draft";
      }
      case STATUS.SUBMITTED: {
        return (
          <Box component="span" sx={{ color: "success.main" }}>
            Submitted
          </Box>
        );
      }
      case STATUS.SUBMITTED_LATE: {
        return (
          <Box component="span" sx={{ color: "error.main" }}>
            Submitted Late
          </Box>
        );
      }
      default:
        alert("An error has occurred while rendering statuses");
        return "Error";
    }
  };

  const generateActionCell = (
    submissionId: number | undefined,
    status: STATUS
  ) => {
    return (
      <Link href={`${PAGES.SUBMISSIONS}/${submissionId}`} passHref>
        <Button disabled={status === STATUS.NOT_YET_STARTED}>View</Button>
      </Link>
    );
  };

  return (
    <>
      <TableRow>
        <TableCell>{generateFromCell(submission)}</TableCell>
        {shouldIncludeToColumn && (
          <TableCell>{generateToCell(submission)}</TableCell>
        )}
        <TableCell>{generateStatusCell(status)}</TableCell>
        <TableCell>
          {generateActionCell(submission.submissionId, status)}
        </TableCell>
      </TableRow>
    </>
  );
};
export default SubmissionRow;
