import NoneFound from "@/components/emptyStates/NoneFound";
import Body from "@/components/layout/Body";
import SpreadAttribute from "@/components/typography/SpreadAttribute";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import {
  Stack,
  Card,
  Button,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import NextLink from "next/link";
import GoBackButton from "@/components/buttons/GoBackButton";
// Hooks
import useFetch, { isFetching } from "@/hooks/useFetch";
import { useRouter } from "next/router";
import useAuth from "@/contexts/useAuth";
// Helpers
import { PAGES } from "@/helpers/navigation";
import { checkIfTeamsAdviser, userHasRole } from "@/helpers/roles";
import { noImageAvailableSrc } from "@/helpers/errors";
// Types
import type { NextPage } from "next";
import { GetTeamResponse } from "@/types/api";
import { ROLES } from "@/types/roles";

const TeamDetails: NextPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { teamId } = router.query;

  const { data: teamResponse, status: getTeamStatus } =
    useFetch<GetTeamResponse>({
      endpoint: `/teams/${teamId}`,
      enabled: Boolean(teamId),
    });

  const isTeamsAdviser = checkIfTeamsAdviser(teamResponse?.team, user);

  const showEditButton =
    isTeamsAdviser || (user && userHasRole(user, ROLES.ADMINISTRATORS));

  const team = teamResponse ? teamResponse.team : undefined;

  return (
    <Body isLoading={isFetching(getTeamStatus)} loadingText="Loading team...">
      <NoDataWrapper
        noDataCondition={!teamResponse || !teamResponse.team}
        fallback={
          <NoneFound
            showReturnHome
            message="There is no such team with that team ID"
          />
        }
      >
        <GoBackButton />
        <Stack direction="column" alignItems="center">
          <Box
            component="img"
            src={team?.posterUrl ?? noImageAvailableSrc}
            alt={`${team?.name} Team`}
            sx={{
              objectFit: "cover",
              height: "50vw",
              maxWidth: "240px",
              maxHeight: "240px",
              zIndex: "1",
            }}
          />
          <Card
            sx={{
              maxWidth: "sm",
              width: "100%",
              position: "relative",
              top: "-100px",
            }}
            raised
          >
            {showEditButton ? (
              <NextLink href={`${PAGES.TEAMS}/${team?.id}/edit`} passHref>
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    textTransform: "none",
                    padding: "0.25rem 1rem",
                    minWidth: "0",
                  }}
                >
                  Edit
                </Button>
              </NextLink>
            ) : null}
            <CardContent sx={{ marginTop: "100px" }}>
              <Typography
                variant="h6"
                fontWeight={600}
                textAlign="center"
                mb="1.5rem"
              >
                {`${team?.name}`}
              </Typography>
              {team && (
                <Stack spacing="0.5rem">
                  <SpreadAttribute attribute="Team ID" value={team?.id} />
                  <SpreadAttribute
                    attribute="Level of Achievement"
                    value={team?.achievement}
                  />
                  <SpreadAttribute
                    attribute="Students"
                    value={
                      team?.students
                        ? team?.students.map((student) => {
                            return {
                              href: `${PAGES.USERS}/${student.id}`,
                              label: student.name,
                            };
                          })
                        : []
                    }
                  />
                  {team?.adviser && (
                    <SpreadAttribute
                      attribute="Adviser"
                      value={{
                        href: `${PAGES.USERS}/${team.adviser.id}`,
                        label: team.adviser.name,
                      }}
                    />
                  )}

                  {team?.mentor && (
                    <SpreadAttribute
                      attribute="Mentor"
                      value={{
                        href: `${PAGES.USERS}/${team.mentor.id}`,
                        label: team.mentor.name,
                      }}
                    />
                  )}
                  {team.proposalPdf && (
                    <SpreadAttribute
                      attribute="Proposal PDF"
                      value={{
                        href: team.proposalPdf,
                        label: team.proposalPdf,
                      }}
                    />
                  )}
                  {team.posterUrl && (
                    <SpreadAttribute
                      attribute="Poster"
                      value={{
                        href: team.posterUrl,
                        label: team.posterUrl,
                      }}
                    />
                  )}
                  {team.videoUrl && (
                    <SpreadAttribute
                      attribute="Video"
                      value={{
                        href: team.videoUrl,
                        label: team.videoUrl,
                      }}
                    />
                  )}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Stack>
      </NoDataWrapper>
    </Body>
  );
};
export default TeamDetails;
