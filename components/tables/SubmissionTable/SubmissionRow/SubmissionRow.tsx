import { FC } from "react";
import Link from "next/link";
// Components
import { Box, Button, TableCell, TableRow } from "@mui/material";
import HoverLink from "@/components/typography/HoverLink";
// Helpers
import { generateSubmissionStatus } from "@/helpers/submissions";
import { PAGES } from "@/helpers/navigation";
// Hooks
import useAuth from "@/contexts/useAuth";
// Types
import { PossibleSubmission, STATUS } from "@/types/submissions";
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
import { Deadline } from "@/types/deadlines";

type Props = {
  deadline: Deadline;
  submission: PossibleSubmission;
  shouldIncludeToColumn: boolean;
};

const SubmissionRow: FC<Props> = ({
  deadline,
  submission,
  shouldIncludeToColumn,
}) => {
  const { user } = useAuth();
  const status = generateSubmissionStatus({
    submissionId: submission.id,
    isDraft: false, // You cannot view other's drafts
    updatedAt: submission.updatedAt,
    dueBy: deadline.dueBy,
  });

  const generateFromCell = (submission: PossibleSubmission) => {
    if (
      (submission.fromTeam && submission.fromUser) ||
      (!submission.fromTeam && !submission.fromUser)
    ) {
      alert("The submission should be from EITHER a team OR a user");
      return "Error";
    }

    if (submission.fromTeam) {
      return (
        <HoverLink href={`${PAGES.TEAMS}/${submission.fromTeam.id}`}>
          {submission.fromTeam.name}
        </HoverLink>
      );
    } else if (submission.fromUser) {
      return (
        <HoverLink href={`${PAGES.USERS}/${submission.fromUser.id}`}>
          {submission.fromUser.name}
        </HoverLink>
      );
    }
  };

  const generateToCell = (submission: PossibleSubmission) => {
    if (submission.toTeam && submission.toUser) {
      alert("There should not be a submission addressed to a team and a user");
      return "Error";
    } else if (submission.toTeam) {
      if (submission.toTeam.id === user?.student?.teamId) {
        return "<Should not be visible>"; // Column should not be showing
      }
      return (
        <HoverLink href={`${PAGES.TEAMS}/${submission.toTeam.id}`}>
          {submission.toTeam.name}
        </HoverLink>
      );
    } else if (submission.toUser) {
      if (submission.toUser.id === user?.id) {
        return "<Should not be visible>"; // Column should not be showing
      }
      return (
        <HoverLink href={`${PAGES.USERS}/${submission.toUser.id}`}>
          {submission.toUser.name}
        </HoverLink>
      );
    } else {
      return "-";
    }
  };

  const generateStatusCell = (
    status: STATUS,
    updatedAt: string | undefined
  ) => {
    const dateOn = updatedAt
      ? `on ${isoDateToLocaleDateWithTime(updatedAt)}`
      : "";

    switch (status) {
      case STATUS.NOT_YET_STARTED: {
        return (
          <Box component="span" sx={{ color: "gray" }}>
            Not yet submitted
          </Box>
        );
      }
      case STATUS.SAVED_DRAFT: {
        return "Saved Draft";
      }
      case STATUS.SUBMITTED: {
        return (
          <Box component="span" sx={{ color: "success.main" }}>
            Submitted {dateOn}
          </Box>
        );
      }
      case STATUS.SUBMITTED_LATE: {
        return (
          <Box component="span" sx={{ color: "error.main" }}>
            Submitted late {dateOn}
          </Box>
        );
      }
      default:
        alert("An error has occurred while rendering statuses");
        return "Error";
    }
  };

  const generateActionCell = (
    status: STATUS,
    submissionId: number | undefined
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
        <TableCell>
          {generateStatusCell(status, submission.updatedAt)}
        </TableCell>
        <TableCell align="right">
          {generateActionCell(status, submission.id)}
        </TableCell>
      </TableRow>
    </>
  );
};
export default SubmissionRow;
