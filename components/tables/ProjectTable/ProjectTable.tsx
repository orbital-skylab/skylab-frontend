import SnackbarAlert from "@/components/layout/SnackbarAlert";
import { Mutate } from "@/hooks/useFetch";
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
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
import ProjectRow from "./ProjectRow";

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
  const { snackbar, handleClose, setSuccess, setError } = useSnackbarAlert();

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
            {projects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                mutate={mutate}
                setSuccess={setSuccess}
                setError={setError}
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
