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
  deadline: Deadline | null;
  evaluationDeadlines: Deadline[];
  submissions: PossibleSubmission[];
};

const EvaluationsTable: FC<Props> = ({
  deadline,
  evaluationDeadlines,
  submissions,
}) => {
  const getEvaluationRowKey = (data: PossibleSubmission, index: number) => {
    if (data.relationId !== undefined && data.relationId !== null) {
      return data.relationId;
    }

    const evaluatorKey = data.fromProject
      ? `project-${data.fromProject.id}`
      : data.fromUser
      ? `user-${data.fromUser.id}`
      : "unknown-evaluator";

    const evaluateeKey = data.toProject
      ? `project-${data.toProject.id}`
      : data.toUser
      ? `user-${data.toUser.id}`
      : "unknown-evaluatee";

    const deadlineKey = deadline?.id ?? data.deadline?.id ?? "all";
    const submissionKey = Array.isArray(data.submission)
      ? data.submission.map((submission) => submission.id).join("-")
      : data.id ?? index;

    return `${evaluatorKey}-${evaluateeKey}-${deadlineKey}-${submissionKey}`;
  };

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
          {submissions.map((data, index) => (
            <EvaluationsRow
              key={getEvaluationRowKey(data, index)}
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
