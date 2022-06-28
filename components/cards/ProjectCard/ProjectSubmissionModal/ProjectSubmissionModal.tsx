import { A4_ASPECT_RATIO } from "@/styles/constants";
import { Project } from "@/types/projects";
import { Backdrop, Box, Fade, Modal, Typography } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  project: Project;
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ProjectSubmissionModal: FC<Props> = ({ open, setOpen, project }) => {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography variant="h5" align="center" fontWeight={600}>
            {project.name}
          </Typography>

          <Typography variant="h6" align="center" fontWeight={600}>
            Project Poster
          </Typography>
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
            <img alt={`${project.name} Poster`} />
          </Box>

          <Typography variant="h6" align="center" fontWeight={600}>
            Project Video
          </Typography>
          <Box
            sx={{ width: "100%", paddingBottom: "56.25%", overflow: "hidden" }}
          >
            {/* TODO: Put poster URL here */}
            <iframe src="poster.videoUrl" />
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
export default ProjectSubmissionModal;
