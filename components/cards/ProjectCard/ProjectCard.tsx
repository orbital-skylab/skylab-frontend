import { FC } from "react";
// Components
import UsersName from "@/components/typography/UsersName/UsersName";
import { Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
// Helpers
import { PAGES } from "@/helpers/navigation";
// Types
import { Project } from "@/types/projects";
// Constants
import ImageCard from "@/components/cards/ImageCard/ImageCard";

type Props = {
  project: Project;
};

const ProjectCard: FC<Props> = ({ project }) => {
  return (
    <ImageCard
      id={project.id.toString()}
      idDisplay={project.id.toString()}
      title={project.teamName}
      imageSrc={project.posterUrl}
      imgAlt={`${project.name} Poster`}
      cardClasses={`${project.achievement.toLowerCase()} ${
        project.cohortYear
      } project-card`}
      extraContent={
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
      }
      actionButton={
        <Stack direction={{ xs: "column-reverse", md: "row" }} gap="0.5rem">
          <Link passHref href={`${PAGES.PROJECTS}/${project.id}`}>
            <Button
              variant="outlined"
              size="small"
              sx={{
                width: "100%",
                textTransform: "none",
                alignSelf: "center",
              }}
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
            href={project.posterUrl}
            target="_blank"
            rel="noreferrer"
            disabled={!project.posterUrl}
          >
            Poster
          </Button>
          <Button
            size="small"
            variant="contained"
            sx={{
              width: "100%",
              textTransform: "none",
              alignSelf: "center",
            }}
            href={project.videoUrl}
            target="_blank"
            rel="noreferrer"
            disabled={!project.videoUrl}
          >
            Video
          </Button>
        </Stack>
      }
    />
  );
};

export default ProjectCard;
