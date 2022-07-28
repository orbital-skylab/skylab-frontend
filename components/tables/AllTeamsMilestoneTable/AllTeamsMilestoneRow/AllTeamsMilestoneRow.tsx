import { FC } from "react";
import Link from "next/link";
// Components
import { Box, Button, TableCell, TableRow } from "@mui/material";
import HoverLink from "@/components/typography/HoverLink";
import UsersName from "@/components/typography/UsersName";
// Helpers
import { generateSubmissionStatus } from "@/helpers/submissions";
import { PAGES } from "@/helpers/navigation";
// Types
import { PossibleSubmission, STATUS } from "@/types/submissions";
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
import { Deadline } from "@/types/deadlines";

type Props = {
  deadline: Deadline;
  submission: PossibleSubmission;
};

const AllTeamsMilestoneRow: FC<Props> = ({ deadline, submission }) => {
  const status = generateSubmissionStatus({
    submissionId: submission.id,
    isDraft: false, // You cannot view other's drafts
    updatedAt: submission.updatedAt,
    dueBy: deadline.dueBy,
  });

  const generateFromCell = (submission: PossibleSubmission) => {
    if (submission.fromProject) {
      return (
        <HoverLink href={`${PAGES.PROJECTS}/${submission.fromProject.id}`}>
          {submission.fromProject.name}
        </HoverLink>
      );
    } else {
      alert("The milestone submission MUST be submitted from a project");
      return "Error";
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
        <TableCell>{submission.fromProject?.achievement}</TableCell>
        <TableCell>
          {submission.fromProject?.students
            ? submission.fromProject?.students.map((student) => (
                <UsersName key={student.id} user={student} />
              ))
            : "-"}
        </TableCell>
        <TableCell>
          {submission.fromProject?.adviser &&
          submission.fromProject?.adviser.id ? (
            <UsersName user={submission.fromProject?.adviser} />
          ) : (
            "-"
          )}
        </TableCell>
        <TableCell>
          {submission.fromProject?.mentor &&
          submission.fromProject?.mentor.id ? (
            <UsersName user={submission.fromProject?.mentor} />
          ) : (
            "-"
          )}
        </TableCell>
        <TableCell>
          {generateStatusCell(status, submission.updatedAt)}
        </TableCell>
        <TableCell>{generateActionCell(status, submission.id)}</TableCell>
      </TableRow>
    </>
  );
};
export default AllTeamsMilestoneRow;
