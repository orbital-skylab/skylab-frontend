import { FC } from "react";
// Libraries
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import styles from "./ProjectCard.module.scss";
import { Project } from "@/types/projects";

type Props = {
  project: Project;
};

const ProjectCard: FC<Props> = ({ project }) => {
  return (
    <Card>
      <CardContent>
        <Stack spacing="0.5rem">
          <Typography variant="h5" align="center" fontWeight={600}>
            {project.name}
          </Typography>
          <Box
            sx={{
              width: "100%",
              aspectRatio: "3 / 4",
              display: "flex",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: "0.5rem",
            }}
          >
            <img
              src={project.posterUrl}
              alt={`${project.name} Project`}
              className={styles.projectImage}
            />
          </Box>

          <Stack mt={2} spacing="0.5rem">
            <Box>
              <Typography fontWeight={600}>Orbitees</Typography>
              {project.students.map((student) => (
                <UsersName key={student.id}>{student.name}</UsersName>
              ))}
            </Box>
            {project.adviser ? (
              <Box>
                <Typography fontWeight={600}>Adviser</Typography>
                <UsersName> {project.adviser.name}</UsersName>
              </Box>
            ) : null}
            {project.mentor ? (
              <Box>
                <Typography fontWeight={600}>Mentor</Typography>
                <UsersName>{project.mentor.name}</UsersName>
              </Box>
            ) : null}
          </Stack>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              width: "fit-content",
              alignSelf: "center",
            }}
          >
            View Submissions
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;

const UsersName: FC = ({ children }) => {
  return (
    <Typography
      variant="subtitle1"
      sx={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {children}
    </Typography>
  );
};
