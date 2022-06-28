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
import CohortRow from "./CohortRow";

// Types
import { Mutate } from "@/hooks/useFetch";
import { Cohort, GetCohortsResponse } from "@/types/cohorts";

type Props = { cohorts: Cohort[]; mutate: Mutate<GetCohortsResponse> };

const ColumnHeadings = ["Academic Year", "Start Date", "End Date", "Actions"];

const CohortTable: FC<Props> = ({ cohorts, mutate }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {ColumnHeadings.map((heading) => (
              <TableCell key={heading} width="25%">
                {heading}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {cohorts.map((cohort) => (
            <CohortRow
              key={cohort.academicYear}
              cohort={cohort}
              mutate={mutate}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default CohortTable;
