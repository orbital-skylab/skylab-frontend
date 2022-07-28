import { noImageAvailableSrc } from "@/helpers/errors";
import { Team } from "@/types/teams";
import { Box, Button, Typography } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";
import Modal from "../Modal";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  team: Team;
};

const TeamProjectSubmissionModal: FC<Props> = ({ open, setOpen, team }) => {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title={`Team ${team.id}: ${team.name}`}
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
          src={team.posterUrl ?? noImageAvailableSrc}
          component="img"
          alt={`${team.projectName} Poster`}
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
        <iframe src={team.videoUrl} />
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
export default TeamProjectSubmissionModal;
