/* eslint-disable react/prop-types */
import type { GetStaticProps, NextPage } from "next";
import { Box, Container, Grid, Typography } from "@mui/material";
import ProjectCard from "@/components/cards/ProjectCard/ProjectCard";
import CustomHead from "@/components/layout/CustomHead";
import { Project } from "@/types/projects";

type Props = {
  projects: Project[];
};

const PublicGallery: NextPage<Props> = ({ projects }) => {
  return (
    <>
      <CustomHead title="Public Project Gallery - Skylab" />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Public Project Gallery
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore outstanding projects from the Orbital program
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
              <ProjectCard project={project} />
            </Grid>
          ))}
        </Grid>

        {projects.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No projects available at this time
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const API_URL =
    process.env.NEXT_PUBLIC_BASE_DEV_API_URL || "http://localhost:4000/api";

  try {
    const response = await fetch(`${API_URL}/projects/public`);

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      props: {
        projects: data.projects || [],
      },
    };
  } catch (error) {
    console.error("Error fetching public projects:", error);

    return {
      props: {
        projects: [],
      },
    };
  }
};

export default PublicGallery;
