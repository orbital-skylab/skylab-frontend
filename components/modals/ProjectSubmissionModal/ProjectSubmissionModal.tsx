import { noImageAvailableSrc } from "@/helpers/errors";
import { Project } from "@/types/projects";
import { Box, Button, Typography } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";
import Modal from "../Modal";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  project: Project;
};

const ProjectSubmissionModal: FC<Props> = ({ open, setOpen, project }) => {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title={`Project ${project.id}: ${project.teamName}`}
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography variant="h6" align="center" fontWeight={600} mb="0.5rem">
        Project Poster
      </Typography>
      <Box
        sx={{
          mx: "auto",
          width: "50%",
        }}
      >
        <Box
          src={project.posterUrl ?? noImageAvailableSrc}
          component="img"
          alt={`${project.teamName} Poster`}
        />
      </Box>

      <Typography
        variant="h6"
        align="center"
        fontWeight={600}
        mt="1rem"
        mb="0.5rem"
      >
        Project Video
      </Typography>
      <Box
        sx={{
          mx: "auto",
          display: "grid",
          placeItems: "center",
        }}
      >
        <iframe src={project.videoUrl} />
      </Box>
      <Button
        sx={{ mb: "-0.5rem", mt: "0.5rem" }}
        variant="outlined"
        onClick={handleClose}
      >
        Close
      </Button>
    </Modal>
  );
};
export default ProjectSubmissionModal;
