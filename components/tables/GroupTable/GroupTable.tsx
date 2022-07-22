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
import GroupRow from "./GroupRow";
// Types
import { Mutate } from "@/hooks/useFetch";
import { GetProjectsResponse } from "@/types/api";
import { Project } from "@/types/projects";

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
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default GroupTable;
