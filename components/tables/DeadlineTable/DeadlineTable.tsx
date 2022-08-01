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
import DeadlineRow from "./DeadlineRow";

// Types
import { Deadline } from "@/types/deadlines";
import { Mutate } from "@/hooks/useFetch";
import { GetDeadlinesResponse } from "@/types/api";

type Props = {
  deadlines: Deadline[] | undefined;
  mutate: Mutate<GetDeadlinesResponse>;
};

const columnHeadings: { heading: string; align: "left" | "right" }[] = [
  { heading: "Deadline ID", align: "left" },
  { heading: "Deadline Name", align: "left" },
  { heading: "Type", align: "left" },
  { heading: "Evaluating Milestone", align: "left" },
  { heading: "Due By", align: "left" },
  { heading: "Actions", align: "right" },
];

const DeadlineTable: FC<Props> = ({ deadlines = [], mutate }) => {
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
          {deadlines.map((deadline) => (
            <DeadlineRow
              key={deadline.id}
              deadline={deadline}
              deadlines={deadlines}
              mutate={mutate}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default DeadlineTable;
