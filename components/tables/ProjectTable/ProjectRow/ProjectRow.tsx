import { FC, useState } from "react";
// Components
import DeleteProjectModal from "@/components/modals/DeleteProjectModal";
import { Button, Chip, Stack, TableCell, TableRow } from "@mui/material";
import Link from "next/link";
import UsersName from "@/components/typography/UsersName";
// Helpers
import { PAGES } from "@/helpers/navigation";
// Types
import { Mutate } from "@/hooks/useFetch";
import { LEVELS_OF_ACHIEVEMENT, Project } from "@/types/projects";
import { BASE_TRANSITION } from "@/styles/constants";

type Props = {
  project: Project;
  mutate: Mutate<Project[]>;
};

const ProjectRow: FC<Props> = ({ project, mutate }) => {
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);

  const handleOpenDeleteModal = () => {
    setIsDeleteProjectOpen(true);
  };

  const renderTag = () => {
    if (!project?.achievement) return;

    switch (project.achievement) {
      case LEVELS_OF_ACHIEVEMENT.VOSTOK:
        return (
          <Chip
            key={`project ${project.id}`}
            label={LEVELS_OF_ACHIEVEMENT.VOSTOK}
            color="primary"
            size="small"
          />
        );
      case LEVELS_OF_ACHIEVEMENT.GEMINI:
        return (
          <Chip
            key={`project ${project.id}`}
            label={LEVELS_OF_ACHIEVEMENT.GEMINI}
            color="secondary"
            size="small"
          />
        );
      case LEVELS_OF_ACHIEVEMENT.APOLLO:
        return (
          <Chip
            key={`project ${project.id}`}
            label={LEVELS_OF_ACHIEVEMENT.APOLLO}
            color="info"
            size="small"
          />
        );

      case LEVELS_OF_ACHIEVEMENT.ARTEMIS:
        return (
          <Chip
            key={`project ${project.id}`}
            label={LEVELS_OF_ACHIEVEMENT.ARTEMIS}
            color="success"
            size="small"
          />
        );
    }
  };

  return (
    <>
      <DeleteProjectModal
        open={isDeleteProjectOpen}
        setOpen={setIsDeleteProjectOpen}
        project={project}
        mutate={mutate}
      />
      <TableRow>
        <TableCell>{project.id}</TableCell>
        <TableCell>{project.name}</TableCell>
        <TableCell>
          <Stack direction="row" spacing="0.25rem">
            {renderTag()}
          </Stack>
        </TableCell>
        <TableCell>
          {project.students
            ? project.students.map((student) => (
                <UsersName key={student.id} user={student} />
              ))
            : null}
        </TableCell>
        <TableCell>
          {project.adviser && project.adviser.id ? (
            <UsersName user={project.adviser} />
          ) : null}
        </TableCell>
        <TableCell>
          {project.mentor && project.mentor.id ? (
            <UsersName user={project.mentor} />
          ) : null}
        </TableCell>
        <TableCell>
          <Stack direction="row" spacing="0.5rem">
            <Link href={`${PAGES.PROJECTS}/${project.id}`} passHref>
              <Button>View</Button>
            </Link>
            <Link href={`${PAGES.PROJECTS}/${project.id}/edit`} passHref>
              <Button>Edit</Button>
            </Link>
            <Button
              onClick={handleOpenDeleteModal}
              sx={{
                transition: BASE_TRANSITION,
                "&:hover": {
                  backgroundColor: "error.main",
                  color: "white",
                },
              }}
            >
              Delete
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ProjectRow;
