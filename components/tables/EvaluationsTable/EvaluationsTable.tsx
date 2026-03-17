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
import EvaluationsRow from "./EvaluationsRow";
// Types
import { Deadline } from "@/types/deadlines";
import { PossibleSubmission } from "@/types/submissions";

type Props = {
  showAdviserColumn?: boolean;
  deadline: Deadline | null;
  evaluationDeadlines: Deadline[];
  submissions: PossibleSubmission[];
};

const EvaluationsTable: FC<Props> = ({
  showAdviserColumn,
  deadline,
  evaluationDeadlines,
  submissions,
}) => {
  const columnHeadings: { heading: string; align: "left" | "right" }[] = [
    { heading: "Relation ID", align: "left" },
    { heading: "Evaluator Type", align: "left" },
    { heading: "Evaluator", align: "left" },
    { heading: "Evaluatee", align: "left" },
  ];

  if (!deadline) {
    evaluationDeadlines.forEach((evaluation) => {
      columnHeadings.push({ heading: evaluation.name, align: "left" });
    });
  } else {
    columnHeadings.push({ heading: "Status", align: "left" });
  }

  const filteredColumnHeadings = columnHeadings.filter(({ heading }) => {
    switch (heading) {
      case "Adviser":
        return Boolean(showAdviserColumn);
      default:
        return true;
    }
  });

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {filteredColumnHeadings.map(({ heading, align }) => (
              <TableCell key={heading} align={align}>
                {heading}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {submissions.map((data) => (
            <EvaluationsRow
              key={data.relationId} // Unique key that supports both Relations and Advisers
              data={data}
              deadline={deadline}
              evaluationDeadlines={evaluationDeadlines}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EvaluationsTable;
