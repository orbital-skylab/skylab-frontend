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
  deadline: Deadline | null;
  submissions: PossibleSubmission[];
  milestoneDeadlines: Deadline[];
};

const AllTeamsMilestoneTable: FC<Props> = ({
  deadline,
  submissions,
  milestoneDeadlines,
}) => {
  const columnHeadings: { heading: string; align: "left" | "right" }[] = [
    { heading: "ID", align: "left" },
    { heading: "Team Name", align: "left" },
    { heading: "Project Name", align: "left" },
    { heading: "Level of Achievement", align: "left" },
    { heading: "Students", align: "left" },
    { heading: "Adviser", align: "left" },
    { heading: "Mentor", align: "left" },
  ];

  if (!deadline) {
    milestoneDeadlines.forEach((milestone) => {
      columnHeadings.push({ heading: milestone.name, align: "left" });
    });
  } else {
    columnHeadings.push({ heading: "Status", align: "left" });
  }

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
              key={deadline ? getKey(deadline, submission) : submission.id}
              deadline={deadline}
              submission={submission}
              milestoneDeadlines={milestoneDeadlines}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default AllTeamsMilestoneTable;
