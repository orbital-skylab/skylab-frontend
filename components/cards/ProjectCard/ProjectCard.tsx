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
        sx={{
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
        <CardContent>
          <Stack spacing="0.5rem">
            <Link passHref href={`${PAGES.PROJECTS}/${project.id}`}>
              <Typography
                align="center"
                fontWeight={600}
                sx={{
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
              {/* TODO: Change poster placeholder */}
              <Box
                component="img"
                src={
                  "https://nusskylab-dev.comp.nus.edu.sg/posters/2021/2680.jpg"
                }
                alt={`${project.name} Project`}
                sx={{
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>

            <Stack mt={2} spacing="0.5rem">
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
            <Stack direction="row" gap="0.5rem">
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
                  Profile
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
                Submission
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default ProjectCard;
