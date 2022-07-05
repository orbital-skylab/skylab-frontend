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
// Hooks
import useFetch, { isFetching } from "@/hooks/useFetch";
import { useRouter } from "next/router";
// Helpers
import { PAGES } from "@/helpers/navigation";
// Types
import type { NextPage } from "next";
import { GetProjectResponse } from "@/types/api";
import useAuth from "@/hooks/useAuth";

const ProjectDetails: NextPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { projectId } = router.query;

  const { data: projectResponse, status: getProjectStatus } =
    useFetch<GetProjectResponse>({
      endpoint: `/projects/${projectId}`,
      enabled: !!projectId,
    });

  const isProjectsStudent =
    user && projectResponse
      ? projectResponse.project.students.map(({ id }) => id).includes(user?.id)
      : false;

  const isProjectsAdviser =
    user && projectResponse ? projectResponse.project.adviser?.id : false;

  const showEditButton =
    isProjectsStudent || isProjectsAdviser || Boolean(user?.administrator?.id);

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
        <Stack direction="column" alignItems="center">
          <Box
            component="img"
            src={"https://nusskylab-dev.comp.nus.edu.sg/posters/2021/2680.jpg"}
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
                {`${project?.name}`}
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
                              href: `/profile/${student.id}`,
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
                        href: `/profile/${project.adviser.id}`,
                        label: project.adviser.name,
                      }}
                    />
                  )}

                  {project?.mentor && (
                    <SpreadAttribute
                      attribute="Mentor"
                      value={{
                        href: `/profile/${project.mentor.id}`,
                        label: project.mentor.name,
                      }}
                    />
                  )}
                  <SpreadAttribute
                    attribute="Proposal PDF"
                    value={{
                      href: project.proposalPdf,
                      label: project.proposalPdf,
                    }}
                  />
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
