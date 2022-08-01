import { FC, useState } from "react";
// Components
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import ProjectSubmissionModal from "../../modals/ProjectSubmissionModal";
import Link from "next/link";
import UsersName from "@/components/typography/UsersName/UsersName";
// Helpers
import { PAGES } from "@/helpers/navigation";
import { noImageAvailableSrc } from "@/helpers/errors";
// Types
import { Project } from "@/types/projects";
// Constants
import { A4_ASPECT_RATIO, BASE_TRANSITION } from "@/styles/constants";

type Props = {
  project: Project;
};

const ProjectCard: FC<Props> = ({ project }) => {
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);

  const handleOpenProjectModal = () => {
    setProjectModalOpen(true);
  };

  return (
    <>
      <ProjectSubmissionModal
        open={isProjectModalOpen}
        setOpen={setProjectModalOpen}
        project={project}
      />
      <Card
        className={`${project.achievement.toLowerCase()} ${
          project.cohortYear
        } project-card`}
        sx={{
          height: "100%",
          transition: BASE_TRANSITION,
          position: "relative",
          "&:hover": {
            transform: "scale(102%)",
          },
        }}
      >
        <Typography
          sx={{
            position: "absolute",
            top: "0",
            left: "0",
            padding: "2px 6px",
            borderRadius: "0 0 4px 0",
            backgroundColor: "primary.main",
            color: "white",
          }}
          fontWeight={600}
        >
          {project.id}
        </Typography>
        <CardContent
          sx={{
            height: "100%",
          }}
        >
          <Stack sx={{ height: "100%", gap: "0.5rem" }}>
            <Link passHref href={`${PAGES.PROJECTS}/${project.id}`}>
              <Typography
                className="project-name-span"
                align="center"
                fontWeight={600}
                sx={{
                  paddingX: "1.5rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                  transition: BASE_TRANSITION,
                  "&:hover": {
                    textDecoration: "underline",
                    color: "secondary.main",
                  },
                }}
              >
                {`${project.name}`}
              </Typography>
            </Link>
            <Box
              sx={{
                width: "100%",
                aspectRatio: A4_ASPECT_RATIO,
                display: "flex",
                justifyContent: "center",
                overflow: "hidden",
                borderRadius: "0.5rem",
              }}
            >
              <Box
                component="img"
                src={project.posterUrl ?? noImageAvailableSrc}
                alt={`${project.name} Poster`}
                sx={{
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>

            <Stack spacing="0.5rem">
              {project.students && project.students.length ? (
                <Box>
                  <Typography fontWeight={600}>Orbitees</Typography>
                  {project.students.map((student) => (
                    <UsersName key={student.id} user={student} />
                  ))}
                </Box>
              ) : null}
              {project.adviser ? (
                <Box>
                  <Typography fontWeight={600}>Adviser</Typography>
                  <UsersName user={project.adviser} />
                </Box>
              ) : null}
              {project.mentor ? (
                <Box>
                  <Typography fontWeight={600}>Mentor</Typography>
                  <UsersName user={project.mentor} />
                </Box>
              ) : null}
            </Stack>
            <Stack
              direction={{ xs: "column-reverse", md: "row" }}
              gap="0.5rem"
              sx={{ marginTop: "auto" }}
            >
              <Link passHref href={`${PAGES.PROJECTS}/${project.id}`}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    width: "100%",
                    textTransform: "none",
                    alignSelf: "center",
                  }}
                  onClick={() => setProjectModalOpen(true)}
                >
                  Details
                </Button>
              </Link>
              <Button
                size="small"
                variant="contained"
                sx={{
                  width: "100%",
                  textTransform: "none",
                  alignSelf: "center",
                }}
                onClick={handleOpenProjectModal}
              >
                Poster and Video
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default ProjectCard;
