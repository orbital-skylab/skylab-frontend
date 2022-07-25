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
  mutate?: Mutate<Project[]>;
  showAdviserColumn?: boolean;
  showMentorColumn?: boolean;
  showEditAction?: boolean;
  showDeleteAction?: boolean;
};

const columnHeadings = [
  "Project ID",
  "Project Name",
  "Level of Achievement",
  "Students",
  "Adviser",
  "Mentor",
  "Actions",
];

const ProjectTable: FC<Props> = ({
  projects,
  mutate,
  showAdviserColumn,
  showMentorColumn,
  showEditAction,
  showDeleteAction,
}) => {
  const filteredColumnHeadings = columnHeadings.filter((heading) => {
    switch (heading) {
      case "Adviser":
        return showAdviserColumn;

      case "Mentor":
        return showMentorColumn;

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
            {projects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                mutate={mutate}
                showAdviserColumn={Boolean(showAdviserColumn)}
                showMentorColumn={Boolean(showMentorColumn)}
                showEditAction={Boolean(showEditAction)}
                showDeleteAction={Boolean(showDeleteAction)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ProjectTable;
