import { FULL_HEIGHT_MINUS_NAV } from "@/styles/constants";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";

type Props = {
  handleCreateAutomatically: () => void;
  handleCreateManually: () => void;
};

const EmptyEvaluationRelations: FC<Props> = ({
  handleCreateAutomatically,
  handleCreateManually,
}) => {
  return (
    <>
      <Box
        sx={{
          height: FULL_HEIGHT_MINUS_NAV,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Typography fontSize="1.5rem" mb="3rem" fontWeight="bold">
          Choose how you want to create your relations
        </Typography>
        <Box display="flex" gap="2rem" width="65%">
          <Stack width="100%" gap="1rem">
            <Typography fontSize="1.5rem" fontWeight="bold">
              Automatically
            </Typography>
            <Typography
              sx={{
                whiteSpace: "pre-wrap",
              }}
            >
              {`Creates them using a pre-defined algorithm\n\nUseful in creating the relations quickly while ensuring all teams are evaluated sufficiently`}
            </Typography>
            <Button
              size="small"
              variant="contained"
              sx={{
                width: "fit-content",
                mt: "auto",
              }}
              onClick={handleCreateAutomatically}
              id="create-automatically-button"
            >
              Create automatically
            </Button>
          </Stack>
          <Divider orientation="vertical" />
          <Stack width="100%" gap="1rem">
            <Typography fontSize="1.5rem" fontWeight="bold">
              Manually
            </Typography>
            <Typography
              sx={{
                whiteSpace: "pre-wrap",
              }}
            >
              {`Create the evaluation relations by yourself\n\nUseful if you would like to manually match teams (e.g. by level of achievement, application type, etc.)`}
            </Typography>
            <Button
              size="small"
              variant="contained"
              sx={{
                width: "fit-content",
                mt: "auto",
              }}
              onClick={handleCreateManually}
              id="create-manually-button"
            >
              Create manually
            </Button>
          </Stack>
        </Box>
      </Box>
    </>
  );
};
export default EmptyEvaluationRelations;
