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
import ApplicationRow from "./ApplicationRow";

// Types
import { Mutate } from "@/hooks/useFetch";
import { Application } from "@/types/applications";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = {
  applications: Application[];
  mutate: Mutate<Application[]>;
};

const columnHeadings: { heading: string; align: "left" | "right" }[] = [
  { heading: "Application ID", align: "left" },
  { heading: "Team Name", align: "left" },
  { heading: "Achievement Level", align: "left" },
  { heading: "Status", align: "left" },
  { heading: "Actions", align: "right" },
];

const ApplicationsTable: FC<Props> = ({ applications, mutate }) => {
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
          {applications.map((application, idx) => (
            <ApplicationRow
              key={application.submissionId}
              id={idx + 1}
              application={application}
              mutate={mutate}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default ApplicationsTable;
