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
import TeamProjectSubmissionModal from "../../modals/TeamProjectSubmissionModal";
import Link from "next/link";
import UsersName from "@/components/typography/UsersName/UsersName";
// Helpers
import { PAGES } from "@/helpers/navigation";
import { noImageAvailableSrc } from "@/helpers/errors";
// Types
import { Team } from "@/types/teams";
// Constants
import { A4_ASPECT_RATIO, BASE_TRANSITION } from "@/styles/constants";

type Props = {
  team: Team;
};

const TeamProjectCard: FC<Props> = ({ team }) => {
  const [isTeamModalOpen, setTeamModalOpen] = useState(false);

  const handleOpenTeamModal = () => {
    setTeamModalOpen(true);
  };

  return (
    <>
      <TeamProjectSubmissionModal
        open={isTeamModalOpen}
        setOpen={setTeamModalOpen}
        team={team}
      />
      <Card
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
          {team.id}
        </Typography>
        <CardContent
          sx={{
            height: "100%",
          }}
        >
          <Stack sx={{ height: "100%", gap: "0.5rem" }}>
            <Link passHref href={`${PAGES.TEAMS}/${team.id}`}>
              <Typography
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
                {`${team.name}`}
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
                src={team.posterUrl ?? noImageAvailableSrc}
                alt={`${team.name} Poster`}
                sx={{
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>

            <Stack spacing="0.5rem">
              {team.students && team.students.length ? (
                <Box>
                  <Typography fontWeight={600}>Orbitees</Typography>
                  {team.students.map((student) => (
                    <UsersName key={student.id} user={student} />
                  ))}
                </Box>
              ) : null}
              {team.adviser ? (
                <Box>
                  <Typography fontWeight={600}>Adviser</Typography>
                  <UsersName user={team.adviser} />
                </Box>
              ) : null}
              {team.mentor ? (
                <Box>
                  <Typography fontWeight={600}>Mentor</Typography>
                  <UsersName user={team.mentor} />
                </Box>
              ) : null}
            </Stack>
            <Stack
              direction={{ xs: "column-reverse", md: "row" }}
              gap="0.5rem"
              sx={{ marginTop: "auto" }}
            >
              <Link passHref href={`${PAGES.TEAMS}/${team.id}`}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    width: "100%",
                    textTransform: "none",
                    alignSelf: "center",
                  }}
                  onClick={() => setTeamModalOpen(true)}
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
                onClick={handleOpenTeamModal}
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

export default TeamProjectCard;
