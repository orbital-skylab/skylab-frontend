/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import type { GetStaticProps, NextPage } from "next";
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
  TextField,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/router";
import ProjectCard from "@/components/cards/ProjectCard/ProjectCard";
import CustomHead from "@/components/layout/CustomHead";
import { LEVELS_OF_ACHIEVEMENT, Project } from "@/types/projects";
import { PAGE_SIZE } from "@/ssg/config/ssg";
import { fetchPublicProjects, ApiError } from "@/lib/api/projectsApi";
import {
  filterProjects,
  extractCohortYears,
  getMostRecentCohort,
} from "@/helpers/publicGallery";

type Props = {
  projects: Project[];
  currentPage: number;
  totalPages: number;
  total: number;
};

const PublicGallery: NextPage<Props> = ({
  projects,
  currentPage,
  totalPages,
  total,
}) => {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<LEVELS_OF_ACHIEVEMENT>(
    LEVELS_OF_ACHIEVEMENT.ARTEMIS
  );
  const [selectedCohort, setSelectedCohort] = useState<number | "">("");

  // Extract unique cohort years using helper function
  const cohortYears = useMemo(() => extractCohortYears(projects), [projects]);

  // Set default cohort to most recent on mount
  useEffect(() => {
    if (selectedCohort === "" && cohortYears.length > 0) {
      setSelectedCohort(getMostRecentCohort(projects) || cohortYears[0]);
    }
  }, [cohortYears, selectedCohort, projects]);

  // Filter projects using helper function
  const filteredProjects = useMemo(
    () => filterProjects(projects, selectedLevel, selectedCohort),
    [projects, selectedCohort, selectedLevel]
  );

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    router.push(`/public-gallery/page/${page}`);
  };

  return (
    <>
      <CustomHead title="Public Project Gallery - Skylab" />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { sm: "center" },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Public Project Gallery
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Explore outstanding projects from the Orbital program ({total}{" "}
              projects)
            </Typography>
          </Box>

          <TextField
            id="public-gallery-cohort-select"
            label="Cohort"
            select
            value={selectedCohort}
            onChange={(e) =>
              setSelectedCohort(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            size="small"
          >
            {cohortYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
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

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const data = await fetchPublicProjects(1, PAGE_SIZE);

    return {
      props: {
        projects: data.projects || [],
        currentPage: data.page || 1,
        totalPages: data.totalPages || 1,
        total: data.total || 0,
      },
    };
  } catch (error) {
    // Log error with context for debugging
    const errorMessage =
      error instanceof ApiError
        ? `API Error (${error.statusCode}): ${error.message} at ${error.endpoint}`
        : `Unknown error: ${error}`;

    console.error(
      "[SSG] Failed to fetch public projects for index:",
      errorMessage
    );

    // In production, consider throwing to fail the build
    // For now, return empty state with error indicator
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

export default PublicGallery;
