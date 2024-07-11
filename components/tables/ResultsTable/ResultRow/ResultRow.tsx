import { Project } from "@/types/projects";
import { TableCell, TableRow } from "@mui/material";
import { FC } from "react";

type Props = {
  rank: number | null;
  project: Project;
  votes: number | null;
  points: number | null;
  percentage: number | null;
};

const ResultRow: FC<Props> = ({ rank, project, votes, points, percentage }) => {
  return (
    <>
      <TableRow>
        {rank && <TableCell>{rank}</TableCell>}
        <TableCell>{project.id}</TableCell>
        <TableCell>{project.name}</TableCell>
        {votes && <TableCell>{votes}</TableCell>}
        {points && <TableCell>{points}</TableCell>}
        {percentage && <TableCell>{percentage}</TableCell>}
      </TableRow>
    </>
  );
};
export default ResultRow;
