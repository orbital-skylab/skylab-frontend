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
import useAuth from "@/hooks/useAuth";
// Helpers
import { PAGES } from "@/helpers/navigation";
import { checkIfProjectsAdviser, userHasRole } from "@/helpers/roles";
import { noImageAvailableSrc } from "@/helpers/errors";
// Types
import type { NextPage } from "next";
import { GetProjectResponse } from "@/types/api";
import { ROLES } from "@/types/roles";

const ProjectDetails: NextPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { projectId } = router.query;

  const { data: projectResponse, status: getProjectStatus } =
    useFetch<GetProjectResponse>({
      endpoint: `/projects/${projectId}`,
      enabled: !!projectId,
    });

  const isProjectsAdviser = checkIfProjectsAdviser(
    projectResponse?.project,
    user
  );

  const showEditButton =
    isProjectsAdviser || (user && userHasRole(user, ROLES.ADMINISTRATORS));

  const project = projectResponse ? projectResponse.project : undefined;

  return (
    <Body
      isLoading={isFetching(getProjectStatus)}
      loadingText="Loading project..."
    >
      <NoDataWrapper
        noDataCondition={!projectResponse || !projectResponse.project}
        fallback={
          <NoneFound
            showReturnHome
            message="There is no such project with that project ID"
          />
        }
      >
        <GoBackButton />
        <Stack direction="column" alignItems="center">
          <Box
            component="img"
            src={project?.posterUrl ?? noImageAvailableSrc}
            alt={`${project?.name} Project`}
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
              <NextLink href={`${PAGES.PROJECTS}/${project?.id}/edit`} passHref>
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
                {`${project?.teamName}`}
              </Typography>
              {project && (
                <Stack spacing="0.5rem">
                  <SpreadAttribute attribute="Project ID" value={project?.id} />
                  <SpreadAttribute
                    attribute="Level of Achievement"
                    value={project?.achievement}
                  />
                  <SpreadAttribute
                    attribute="Students"
                    value={
                      project?.students
                        ? project?.students.map((student) => {
                            return {
                              href: `${PAGES.USERS}/${student.id}`,
                              label: student.name,
                            };
                          })
                        : []
                    }
                  />
                  {project?.adviser && (
                    <SpreadAttribute
                      attribute="Adviser"
                      value={{
                        href: `${PAGES.USERS}/${project.adviser.id}`,
                        label: project.adviser.name,
                      }}
                    />
                  )}

                  {project?.mentor && (
                    <SpreadAttribute
                      attribute="Mentor"
                      value={{
                        href: `${PAGES.USERS}/${project.mentor.id}`,
                        label: project.mentor.name,
                      }}
                    />
                  )}
                  {project.proposalPdf && (
                    <SpreadAttribute
                      attribute="Proposal PDF"
                      value={{
                        href: project.proposalPdf,
                        label: project.proposalPdf,
                      }}
                    />
                  )}
                  {project.posterUrl && (
                    <SpreadAttribute
                      attribute="Poster"
                      value={{
                        href: project.posterUrl,
                        label: project.posterUrl,
                      }}
                    />
                  )}
                  {project.videoUrl && (
                    <SpreadAttribute
                      attribute="Video"
                      value={{
                        href: project.videoUrl,
                        label: project.videoUrl,
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
export default ProjectDetails;
