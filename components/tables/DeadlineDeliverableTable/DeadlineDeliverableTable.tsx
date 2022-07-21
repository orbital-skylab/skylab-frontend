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
import DeadlineDeliverableRow from "./DeadlineDeliverableRow";

// Types
import { DeadlineDeliverable } from "@/types/deadlines";

type Props = {
  deadlineDeliverables: DeadlineDeliverable[] | undefined;
};

const ColumnHeadings = ["Deadline", "Due By", "Status", "Actions"];

/**
 * Renders a table to view YOUR OWN deadline deliverables.
 * Examples: Milestone 1 Submission, Milestone 1 Evaluation for Team X, Feedback for Team Y, etc.
 */
const DeadlineDeliverableTable: FC<Props> = ({ deadlineDeliverables = [] }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {ColumnHeadings.map((heading) => (
              <TableCell key={heading}>{heading}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {deadlineDeliverables.map((deadlineDeliverable) => (
            <DeadlineDeliverableRow
              key={`${deadlineDeliverable.deadline.id}-${deadlineDeliverable.toProject?.id}-${deadlineDeliverable.toUser?.id}`}
              deadlineDeliverable={deadlineDeliverable}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default DeadlineDeliverableTable;
