import { noImageAvailableSrc } from "@/helpers/errors";
import { A4_ASPECT_RATIO, BASE_TRANSITION } from "@/styles/constants";
import { Project } from "@/types/projects";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";

type Props = {
  candidate: Project;
  isSelected: boolean;
  setSelectedCandidates: Dispatch<SetStateAction<{ [key: number]: boolean }>>;
};

const VotingCard: FC<Props> = ({
  candidate,
  isSelected,
  setSelectedCandidates,
}: Props) => {
  const handleToggleSelected = () => {
    setSelectedCandidates((prevSelectedCandidates) => ({
      ...prevSelectedCandidates,
      [candidate.id]: !isSelected,
    }));
  };

  return (
    <>
      <Card
        id={`${candidate.id}-candidate-card`}
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
          {candidate.id}
        </Typography>
        <CardContent
          sx={{
            height: "100%",
          }}
        >
          <Stack sx={{ height: "100%", gap: "0.5rem" }}>
            <Typography
              className="candidate-name-span"
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
              {`${candidate.teamName}`}
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
              <Box
                component="img"
                src={candidate.posterUrl ?? noImageAvailableSrc}
                alt={`${candidate.name} Poster`}
                sx={{
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>

            <Stack
              direction={{ xs: "column-reverse", md: "row" }}
              gap="0.5rem"
              sx={{ marginTop: "auto" }}
            >
              <Button
                id={`candidate-${candidate.id}-vote-button`}
                variant={isSelected ? "outlined" : "contained"}
                size="small"
                onClick={handleToggleSelected}
                sx={{
                  width: "100%",
                  textTransform: "none",
                  alignSelf: "center",
                }}
              >
                {isSelected ? "Voted" : "Vote"}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};
export default VotingCard;
