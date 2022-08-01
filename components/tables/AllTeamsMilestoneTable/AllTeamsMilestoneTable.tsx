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

const columnHeadings: { heading: string; align: "left" | "right" }[] = [
  { heading: "Submitted By", align: "left" },
  { heading: "Level of Achievement", align: "left" },
  { heading: "Students", align: "left" },
  { heading: "Adviser", align: "left" },
  { heading: "Mentor", align: "left" },
  { heading: "Status", align: "left" },
  { heading: "Actions", align: "right" },
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
            {columnHeadings.map(({ heading, align }) => (
              <TableCell key={heading} align={align}>
                {heading}
              </TableCell>
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
