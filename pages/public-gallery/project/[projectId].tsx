/* eslint-disable react/prop-types */
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  Button,
} from "@mui/material";
import CustomHead from "@/components/layout/CustomHead";
import Attribute from "@/components/typography/Attribute";
import UsersName from "@/components/typography/UsersName";
import { Project } from "@/types/projects";
import Image from "next/image";
import Link from "next/link";
import { getImageOrDefault } from "@/helpers/errors";

type Props = {
  project: Project;
};

const PublicProjectDetail: NextPage<Props> = ({ project }) => {
  return (
    <>
      <CustomHead title={`${project.name} - Public Project Gallery`} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 2 }}>
          <Link href="/public-gallery" passHref>
            <Button variant="text" sx={{ textTransform: "none" }}>
              ← Back to Gallery
            </Button>
          </Link>
        </Box>

        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            {project.name}
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {project.teamName}
          </Typography>

          {/* Poster Image */}
          {project.posterUrl && (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: "600px",
                aspectRatio: "1 / 1.4142",
                mx: "auto",
                my: 4,
              }}
            >
              <Image
                src={getImageOrDefault(project.posterUrl)}
                alt={`${project.name} Poster`}
                width={600}
                height={849}
                style={{ objectFit: "contain", width: "100%", height: "auto" }}
              />
            </Box>
          )}

          {/* Project Details */}
          <Stack spacing={2} sx={{ mt: 4 }}>
            <Typography variant="h6">Project Details</Typography>
            <Attribute attribute="Team Name" value={project.teamName} />
            <Attribute
              attribute="Achievement Level"
              value={project.achievement}
            />
            <Attribute attribute="Cohort Year" value={project.cohortYear} />

            {/* Students */}
            {project.students && project.students.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Students:
                </Typography>
                <Stack spacing={0.5} sx={{ ml: 2 }}>
                  {project.students.map((student) => (
                    <Box key={student.id}>
                      <UsersName user={student} />
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Adviser */}
            {project.adviser && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Adviser:
                </Typography>
                <Box sx={{ ml: 2 }}>
                  <UsersName user={project.adviser} />
                </Box>
              </Box>
            )}

            {/* Mentor */}
            {project.mentor && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Mentor:
                </Typography>
                <Box sx={{ ml: 2 }}>
                  <UsersName user={project.mentor} />
                </Box>
              </Box>
            )}

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              {project.posterUrl && (
                <Button
                  variant="contained"
                  href={project.posterUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Poster
                </Button>
              )}
              {project.videoUrl && (
                <Button
                  variant="contained"
                  href={project.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch Video
                </Button>
              )}
              {project.proposalPdf && (
                <Button
                  variant="outlined"
                  href={project.proposalPdf}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Proposal
                </Button>
              )}
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const API_URL =
    process.env.NEXT_PUBLIC_BASE_DEV_API_URL || "http://localhost:4000/api";
  const PAGE_SIZE = 100; // Larger page size to reduce API calls

  try {
    // Fetch first page to get total pages
    const firstResponse = await fetch(
      `${API_URL}/projects/public?page=1&limit=${PAGE_SIZE}`
    );

    if (!firstResponse.ok) {
      return {
        paths: [],
        fallback: false,
      };
    }

    const firstData = await firstResponse.json();
    let allProjects = firstData.projects || [];
    const totalPages = firstData.totalPages || 1;

    // Fetch remaining pages if needed
    for (let page = 2; page <= totalPages; page++) {
      const response = await fetch(
        `${API_URL}/projects/public?page=${page}&limit=${PAGE_SIZE}`
      );
      if (response.ok) {
        const data = await response.json();
        allProjects = allProjects.concat(data.projects || []);
      }
    }

    const paths = allProjects.map((project: Project) => ({
      params: { projectId: project.id.toString() },
    }));

    return {
      paths,
      fallback: false, // Show 404 for projects not in paths
    };
  } catch (error) {
    console.error("Error fetching project paths:", error);
    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const API_URL =
    process.env.NEXT_PUBLIC_BASE_DEV_API_URL || "http://localhost:4000/api";

  try {
    const projectId = params?.projectId as string;
    const response = await fetch(`${API_URL}/projects/${projectId}`);

    if (!response.ok) {
      return {
        notFound: true,
      };
    }

    const data = await response.json();
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
    console.error("Error fetching project:", error);
    return {
      notFound: true,
    };
  }
};

export default PublicProjectDetail;
