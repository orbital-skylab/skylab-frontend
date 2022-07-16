import SnackbarAlert from "@/components/layout/SnackbarAlert";
import { Mutate } from "@/hooks/useFetch";
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
import { GetProjectsResponse } from "@/types/api";
import { Project } from "@/types/projects";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FC } from "react";
import GroupRow from "./GroupRow";

type Props = {
  projectsByGroupMap: Map<number, Set<Project>>;
  mutate: Mutate<GetProjectsResponse>;
  showAdviserColumn?: boolean;
};

const columnHeadings = ["Group ID", "Teams", "Adviser", "Actions"];

const GroupTable: FC<Props> = ({
  projectsByGroupMap,
  mutate,
  showAdviserColumn,
}) => {
  const { snackbar, handleClose, setSuccess, setError } = useSnackbarAlert();

  const filteredColumnHeadings = columnHeadings.filter((heading) => {
    switch (heading) {
      case "Adviser":
        return Boolean(showAdviserColumn);

      default:
        return true;
    }
  });

  return (
    <>
      <SnackbarAlert snackbar={snackbar} handleClose={handleClose} />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {filteredColumnHeadings.map((heading) => (
                <TableCell key={heading}>{heading}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from(projectsByGroupMap).map(([groupId, groupSet]) => (
              <GroupRow
                key={groupId}
                groupId={groupId}
                groupSet={groupSet}
                mutate={mutate}
                showAdviserColumn={Boolean(showAdviserColumn)}
                setSuccess={setSuccess}
                setError={setError}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default GroupTable;
