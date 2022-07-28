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
import AllTeamsMilestoneRow from "./AllTeamsMilestoneRow";

// Types
import { Deadline } from "@/types/deadlines";
import { PossibleSubmission } from "@/types/submissions";

type Props = {
  deadline: Deadline;
  submissions: PossibleSubmission[];
};

const columnHeadings = [
  "Submitted By",
  "Level of Achievement",
  "Students",
  "Adviser",
  "Mentor",
  "Status",
  "Action",
];

const AllTeamsMilestoneTable: FC<Props> = ({ deadline, submissions }) => {
  const getKey = (deadline: Deadline, submission: PossibleSubmission) => {
    return `${deadline.id}-${submission.id}-${submission.fromProject?.id}-${submission.fromProject?.id}`;
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columnHeadings.map((heading) => (
              <TableCell key={heading}>{heading}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {submissions.map((submission) => (
            <AllTeamsMilestoneRow
              key={getKey(deadline, submission)}
              deadline={deadline}
              submission={submission}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default AllTeamsMilestoneTable;
