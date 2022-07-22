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
import ProjectRow from "./ProjectRow";
// Hooks
import { Mutate } from "@/hooks/useFetch";
// Types
import { Project } from "@/types/projects";

type Props = {
  projects: Project[];
  mutate: Mutate<Project[]>;
};

const ColumnHeadings = [
  "Project ID",
  "Project Name",
  "Level of Achievement",
  "Students",
  "Adviser",
  "Mentor",
  "Actions",
];

const ProjectTable: FC<Props> = ({ projects, mutate }) => {
  return (
    <>
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
            {projects.map((project) => (
              <ProjectRow key={project.id} project={project} mutate={mutate} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ProjectTable;
