/* eslint-disable react/prop-types */
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import {
  Stack,
  Card,
  CardContent,
  Typography,
  Box,
  Container,
} from "@mui/material";
import CustomHead from "@/components/layout/CustomHead";
import SpreadAttribute from "@/components/typography/SpreadAttribute";
import GoBackButton from "@/components/buttons/GoBackButton";
import Body from "@/components/layout/Body";
import { Project } from "@/types/projects";
import { noImageAvailableSrc } from "@/helpers/errors";
import {
  isPublicGallerySsgOffline,
  PROJECT_PATHS_PAGE_SIZE,
} from "@/ssg/config/ssg";
import {
  fetchAllPublicProjectIds,
  fetchProjectById,
  ApiError,
} from "@/lib/api/projectsApi";

type Props = {
  project: Project;
};

const PublicProjectDetail: NextPage<Props> = ({ project }) => {
  return (
    <>
      <CustomHead title={`${project.name} - Public Project Gallery`} />
      <Body>
        <GoBackButton />
        <Container maxWidth="lg" sx={{ py: 4 }}>
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
                    <SpreadAttribute
                      attribute="Project ID"
                      value={project?.id}
                    />
                    <SpreadAttribute
                      attribute="Project Name"
                      value={project?.name}
                    />
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
                                href: `/users/${student.id}`,
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
                          href: `/users/${project.adviser.id}`,
                          label: project.adviser.name,
                        }}
                      />
                    )}

                    {project?.mentor && (
                      <SpreadAttribute
                        attribute="Mentor"
                        value={{
                          href: `/users/${project.mentor.id}`,
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
        </Container>
      </Body>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  if (isPublicGallerySsgOffline()) {
    return {
      paths: [],
      fallback: false,
    };
  }

  try {
    // Use helper function to fetch all project IDs (SRP principle)
    const projectIds = await fetchAllPublicProjectIds(PROJECT_PATHS_PAGE_SIZE);

    const paths = projectIds.map((id) => ({
      params: { projectId: id.toString() },
    }));

    return {
      paths,
      fallback: false, // Show 404 for projects not in paths
    };
  } catch (error) {
    // Fail Fast: Log with context
    const errorMessage =
      error instanceof ApiError
        ? `API Error (${error.statusCode}): ${error.message}`
        : `Unknown error: ${error}`;

    console.error("[SSG] Failed to fetch project paths:", errorMessage);

    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const projectId = params?.projectId as string;

  try {
    const data = await fetchProjectById(projectId);
    const project = data.project;

    if (!project || project.hasDropped) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        project,
      },
    };
  } catch (error) {
    // Fail Fast: Log with context
    const errorMessage =
      error instanceof ApiError
        ? `API Error (${error.statusCode}): ${error.message} at ${error.endpoint}`
        : `Unknown error: ${error}`;

    console.error(`[SSG] Failed to fetch project ${projectId}:`, errorMessage);

    return {
      notFound: true,
    };
  }
};

export default PublicProjectDetail;
