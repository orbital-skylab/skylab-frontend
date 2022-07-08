import SnackbarAlert from "@/components/SnackbarAlert";
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
  const { snackbar, handleClose, setSuccess, setError } = useSnackbarAlert();

  return (
    <>
      <SnackbarAlert snackbar={snackbar} handleClose={handleClose} />
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
              <ProjectRow
                key={project.id}
                project={project}
                mutate={mutate}
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

export default ProjectTable;
