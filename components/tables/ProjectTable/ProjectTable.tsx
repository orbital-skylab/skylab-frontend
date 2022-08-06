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

const columnHeadings: { heading: string; align: "left" | "right" }[] = [
  { heading: "ID", align: "left" },
  { heading: "Team Name", align: "left" },
  { heading: "Project Name", align: "left" },
  { heading: "Level of Achievement", align: "left" },
  { heading: "Students", align: "left" },
  { heading: "Adviser", align: "left" },
  { heading: "Mentor", align: "left" },
  { heading: "Actions", align: "right" },
];

const ProjectTable: FC<Props> = ({
  projects,
  mutate,
  showAdviserColumn,
  showMentorColumn,
  showEditAction,
  showDeleteAction,
}) => {
  const filteredColumnHeadings = columnHeadings.filter(({ heading }) => {
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
              {filteredColumnHeadings.map(({ heading, align }) => (
                <TableCell key={heading} align={align}>
                  {heading}
                </TableCell>
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
