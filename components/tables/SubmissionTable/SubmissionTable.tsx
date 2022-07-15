import { FC } from "react";
// Components
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import SubmissionRow from "./SubmissionRow";

// Types
import { Deadline } from "@/types/deadlines";
import { PossibleSubmission } from "@/types/submissions";

type Props = {
  deadline: Deadline;
  submissions: PossibleSubmission[];
  shouldIncludeToColumn?: boolean;
};

const ColumnHeadings = ["From", "To", "Status", "Actions"];

/**
 * Renders a table to view OTHER's submissions.
 * Examples: Peer teams' Milestone submissions, Peer teams' evaluations, Adviser evaluations, Peer teams' feedback, Student's feedbacks, etc.
 */
const SubmissionTable: FC<Props> = ({
  deadline,
  submissions,
  shouldIncludeToColumn = false,
}) => {
  const getKey = (deadline: Deadline, submission: PossibleSubmission) => {
    return `${deadline.id}-${submission.submissionId}-${submission.fromProject?.id}-${submission.fromUser?.id}-${submission.toProject?.id}-${submission.toUser?.id}`;
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {ColumnHeadings.filter(
              (heading) => heading !== "To" || shouldIncludeToColumn
            ).map((heading) => (
              <TableCell key={heading}>{heading}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {submissions.map((submission) => (
            <SubmissionRow
              key={getKey(deadline, submission)}
              deadlineDueBy={deadline.dueBy}
              submission={submission}
              shouldIncludeToColumn={shouldIncludeToColumn}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default SubmissionTable;
