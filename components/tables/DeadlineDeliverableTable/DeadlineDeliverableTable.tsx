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
import { DeadlineDeliverable, VIEWER_ROLE } from "@/types/deadlines";

type Props = {
  deadlineDeliverables: DeadlineDeliverable[] | undefined;
  viewerRole: VIEWER_ROLE;
};

const columnHeadings: { heading: string; align: "left" | "right" }[] = [
  { heading: "Deadline", align: "left" },
  { heading: "Due By", align: "left" },
  { heading: "Status", align: "left" },
  { heading: "Actions", align: "right" },
];

/**
 * Renders a table to view YOUR OWN deadline deliverables.
 * Examples: Milestone 1 Submission, Milestone 1 Evaluation for Team X, Feedback for Team Y, etc.
 */
const DeadlineDeliverableTable: FC<Props> = ({
  deadlineDeliverables = [],
  viewerRole,
}) => {
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
          {deadlineDeliverables.map((deadlineDeliverable) => (
            <DeadlineDeliverableRow
              key={`${deadlineDeliverable.deadline.id}-${deadlineDeliverable.toProject?.id}-${deadlineDeliverable.toUser?.id}`}
              deadlineDeliverable={deadlineDeliverable}
              viewerRole={viewerRole}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default DeadlineDeliverableTable;
