/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import {
  Box,
  Container,
  Grid,
  Typography,
  Pagination,
  Tabs,
  Tab,
  tabsClasses,
  Stack,
} from "@mui/material";
import { useRouter } from "next/router";
import ProjectCard from "@/components/cards/ProjectCard/ProjectCard";
import CustomHead from "@/components/layout/CustomHead";
import { LEVELS_OF_ACHIEVEMENT, Project } from "@/types/projects";

const PAGE_SIZE = 28;
const MAX_PAGES_TO_PREBUILD = 10;

type Props = {
  projects: Project[];
  currentPage: number;
  totalPages: number;
  total: number;
};

const PublicGalleryPage: NextPage<Props> = ({
  projects,
  currentPage,
  totalPages,
  total,
}) => {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<LEVELS_OF_ACHIEVEMENT>(
    LEVELS_OF_ACHIEVEMENT.ARTEMIS
  );

  const filteredProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.achievement === selectedLevel && !project.hasDropped
      ),
    [projects, selectedLevel]
  );

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    router.push(`/public-gallery/page/${page}`);
  };

  return (
    <>
      <CustomHead title={`Public Project Gallery - Page ${currentPage}`} />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Public Project Gallery
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore outstanding projects from Orbital ({total} projects)
          </Typography>
        </Box>

        <Stack spacing={2} sx={{ mb: 3 }}>
          <Tabs
            value={selectedLevel}
            onChange={(_, val) => setSelectedLevel(val)}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="achievement-level-tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ [`& .${tabsClasses.scrollButtons}`]: { color: "primary" } }}
          >
            {Object.values(LEVELS_OF_ACHIEVEMENT).map((level) => (
              <Tab key={level} value={level} label={level} />
            ))}
          </Tabs>
        </Stack>

        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
              <ProjectCard project={project} />
            </Grid>
          ))}
        </Grid>

        {filteredProjects.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No projects available for {selectedLevel}
            </Typography>
          </Box>
        )}

        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Container>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const API_URL =
    process.env.NEXT_PUBLIC_BASE_DEV_API_URL || "http://localhost:4000/api";

  try {
    // Fetch first page to get total pages
    const response = await fetch(
      `${API_URL}/projects/public?page=1&limit=${PAGE_SIZE}`
    );

    if (!response.ok) {
      return {
        paths: [{ params: { page: "1" } }],
        fallback: false,
      };
    }

    const data = await response.json();
    const totalPages = Math.min(data.totalPages || 1, MAX_PAGES_TO_PREBUILD);

    // Generate paths for first N pages
    const paths = Array.from({ length: totalPages }, (_, i) => ({
      params: { page: (i + 1).toString() },
    }));

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error("Error fetching page paths:", error);
    return {
      paths: [{ params: { page: "1" } }],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const API_URL =
    process.env.NEXT_PUBLIC_BASE_DEV_API_URL || "http://localhost:4000/api";

  const page = parseInt(params?.page as string) || 1;

  try {
    const response = await fetch(
      `${API_URL}/projects/public?page=${page}&limit=${PAGE_SIZE}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();

    // If page is beyond what we have, return 404
    if (page > data.totalPages && data.totalPages > 0) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        projects: data.projects || [],
        currentPage: data.page || page,
        totalPages: data.totalPages || 1,
        total: data.total || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching public projects:", error);

    return {
      props: {
        projects: [],
        currentPage: 1,
        totalPages: 1,
        total: 0,
      },
    };
  }
};

export default PublicGalleryPage;
