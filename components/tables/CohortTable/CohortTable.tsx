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

const columnHeadings: { heading: string; align: "left" | "right" }[] = [
  { heading: "Academic Year", align: "left" },
  { heading: "Start Date", align: "left" },
  { heading: "End Date", align: "left" },
  { heading: "Actions", align: "right" },
];

const CohortTable: FC<Props> = ({ cohorts, mutate }) => {
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
