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
import { GetDeadlinesResponse } from "@/pages/deadlines";

type Props = { deadlines: Deadline[]; mutate: Mutate<GetDeadlinesResponse> };

const ColumnHeadings = ["Deadline Name", "Due By", "Actions"];

const DeadlineTable: FC<Props> = ({ deadlines }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {ColumnHeadings.map((heading) => (
              <TableCell key={heading} width="33.33%">
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
              mutate={mutate}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default DeadlineTable;
