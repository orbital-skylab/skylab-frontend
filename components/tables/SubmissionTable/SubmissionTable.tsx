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
import { Deadline, DEADLINE_TYPE } from "@/types/deadlines";
import { PossibleSubmission } from "@/types/submissions";

type Props = {
  deadline: Deadline;
  submissions: PossibleSubmission[];
};

const columnHeadings = ["Submitted By", "To", "Status", "Action"];

/**
 * Renders a table to view OTHER's submissions.
 * Examples: Peer teams' Milestone submissions, Peer teams' evaluations, Adviser evaluations, Peer teams' feedback, Student's feedbacks, etc.
 */
const SubmissionTable: FC<Props> = ({ deadline, submissions }) => {
  const getKey = (deadline: Deadline, submission: PossibleSubmission) => {
    return `${deadline.id}-${submission.id}-${submission.fromProject?.id}-${submission.fromUser?.id}-${submission.toProject?.id}-${submission.toUser?.id}`;
  };

  const shouldIncludeToColumn =
    deadline.type === DEADLINE_TYPE.EVALUATION ||
    deadline.type === DEADLINE_TYPE.FEEDBACK;

  const filteredColumnHeadings = columnHeadings.filter((heading) => {
    switch (heading) {
      case "To":
        return shouldIncludeToColumn;

      default:
        return true;
    }
  });

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {filteredColumnHeadings.map((heading) => (
              <TableCell key={heading}>{heading}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {submissions.map((submission) => (
            <SubmissionRow
              key={getKey(deadline, submission)}
              deadline={deadline}
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
