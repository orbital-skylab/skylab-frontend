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
import UpcomingDeadlineRow from "./DeadlineDeliverableRow";

// Types
import { DeadlineDeliverable } from "@/types/deadlines";

type Props = {
  deadlineDeliverables: DeadlineDeliverable[] | undefined;
};

const ColumnHeadings = ["Deadline", "To", "Due By", "Status", "Actions"];

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
            <UpcomingDeadlineRow
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
