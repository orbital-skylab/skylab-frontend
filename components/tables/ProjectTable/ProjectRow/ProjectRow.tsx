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
  mutate: Mutate<Project[]> | undefined;
  showAdviserColumn: boolean;
  showMentorColumn: boolean;
  showEditAction: boolean;
  showDeleteAction: boolean;
};

const ProjectRow: FC<Props> = ({
  project,
  mutate,
  showAdviserColumn,
  showMentorColumn,
  showEditAction,
  showDeleteAction,
}) => {
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
      {showDeleteAction && mutate && (
        <DeleteProjectModal
          open={isDeleteProjectOpen}
          setOpen={setIsDeleteProjectOpen}
          project={project}
          mutate={mutate}
        />
      )}
      <TableRow>
        <TableCell className="project-id-td">{project.id}</TableCell>
        <TableCell className="project-name-td">{project.teamName}</TableCell>
        <TableCell className="project-name-td">{project.name}</TableCell>
        <TableCell className="project-achievement-level-td">
          <Stack direction="row" spacing="0.25rem">
            {renderTag()}
          </Stack>
        </TableCell>
        <TableCell className="project-students-td">
          {project.students
            ? project.students.map((student) => (
                <UsersName key={student.id} user={student} />
              ))
            : "-"}
        </TableCell>
        {showAdviserColumn && (
          <TableCell className="project-adviser-td">
            {project.adviser && project.adviser.id ? (
              <UsersName user={project.adviser} />
            ) : (
              "-"
            )}
          </TableCell>
        )}
        {showMentorColumn && (
          <TableCell className="project-mentor-td">
            {project.mentor && project.mentor.id ? (
              <UsersName user={project.mentor} />
            ) : (
              "-"
            )}
          </TableCell>
        )}
        <TableCell align="right">
          <Stack direction="row" spacing="0.5rem" justifyContent="end">
            <Link href={`${PAGES.PROJECTS}/${project.id}`} passHref>
              <Button id="view-team-button" className="view-project-button">
                View
              </Button>
            </Link>
            {showEditAction && (
              <Link href={`${PAGES.PROJECTS}/${project.id}/edit`} passHref>
                <Button className="edit-project-button">Edit</Button>
              </Link>
            )}
            {showDeleteAction && (
              <Button
                className="delete-project-button"
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
            )}
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ProjectRow;
