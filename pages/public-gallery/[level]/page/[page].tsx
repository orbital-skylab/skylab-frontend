/* eslint-disable react/prop-types */
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useState, useEffect, useMemo } from "react";
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
import { PAGE_SIZE, MAX_PAGES_TO_PREBUILD } from "@/ssg/config/ssg";
import { extractCohortYears } from "@/helpers/publicGallery";
import {
  fetchPublicProjects,
  fetchPublicProjectsCount,
  ApiError,
} from "@/lib/api/projectsApi";

type Props = {
  projects: Project[];
  currentPage: number;
  totalPages: number;
  total: number;
  level: string;
};

/** Convert URL slug to LEVELS_OF_ACHIEVEMENT enum */
const slugToLevel = (slug: string): LEVELS_OF_ACHIEVEMENT => {
  // Convert lowercase slug (e.g., "artemis") to PascalCase (e.g., "Artemis")
  const pascalCase = slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
  // Find matching enum value
  const matchingLevel = Object.values(LEVELS_OF_ACHIEVEMENT).find(
    (level) => level === pascalCase
  );
  return matchingLevel || LEVELS_OF_ACHIEVEMENT.ARTEMIS;
};

/** Convert LEVELS_OF_ACHIEVEMENT to URL slug */
const levelToSlug = (level: LEVELS_OF_ACHIEVEMENT): string => {
  return level.toLowerCase();
};

const PublicGalleryLevelPage: NextPage<Props> = ({
  projects,
  currentPage,
  level,
}) => {
  const router = useRouter();
  const selectedLevel = slugToLevel(level);

  // Extract available cohort years from projects (sorted descending)
  const cohortYears = useMemo(() => extractCohortYears(projects), [projects]);
  const mostRecentCohort = cohortYears[0] || "";

  // Initialize cohort from query param or default to most recent
  const [selectedCohort, setSelectedCohort] = useState<number | "">(
    mostRecentCohort
  );

  // Sync cohort state with URL query param
  useEffect(() => {
    if (router.isReady) {
      const cohortParam = router.query.cohort;
      if (cohortParam && !Array.isArray(cohortParam)) {
        const parsedCohort = parseInt(cohortParam, 10);
        if (!isNaN(parsedCohort) && cohortYears.includes(parsedCohort)) {
          setSelectedCohort(parsedCohort);
        } else {
          setSelectedCohort(mostRecentCohort);
        }
      } else {
        setSelectedCohort(mostRecentCohort);
      }
    }
  }, [router.isReady, router.query.cohort, cohortYears, mostRecentCohort]);

  // Filter projects by selected cohort
  const filteredProjects = useMemo(() => {
    if (selectedCohort === "") return projects;
    return projects.filter((p) => p.cohortYear === selectedCohort);
  }, [projects, selectedCohort]);

  // Recalculate pagination based on filtered results
  const filteredTotalPages = Math.max(
    Math.ceil(filteredProjects.length / PAGE_SIZE),
    1
  );
  const clientPage = Math.min(currentPage, filteredTotalPages);
  const paginatedProjects = filteredProjects.slice(
    (clientPage - 1) * PAGE_SIZE,
    clientPage * PAGE_SIZE
  );

  const handleCohortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const newCohort = value === "" ? "" : parseInt(value, 10);
    setSelectedCohort(newCohort);
    // Reset to page 1 and update query param
    router.push(
      {
        pathname: `/public-gallery/${levelToSlug(selectedLevel)}/page/1/`,
        query: newCohort !== "" ? { cohort: newCohort } : {},
      },
      undefined,
      { shallow: false }
    );
  };

  const handleTabChange = (
    _: React.SyntheticEvent,
    newLevel: LEVELS_OF_ACHIEVEMENT
  ) => {
    // Preserve cohort when switching tabs
    router.push({
      pathname: `/public-gallery/${levelToSlug(newLevel)}/page/1/`,
      query: selectedCohort !== "" ? { cohort: selectedCohort } : {},
    });
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    // Preserve cohort when changing pages
    router.push({
      pathname: `/public-gallery/${levelToSlug(selectedLevel)}/page/${page}/`,
      query: selectedCohort !== "" ? { cohort: selectedCohort } : {},
    });
  };

  return (
    <>
      <CustomHead
        title={`${
          selectedCohort !== "" ? `${selectedCohort} ` : ""
        }${selectedLevel} Projects - Public Gallery - Page ${clientPage}`}
      />
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
              Explore outstanding {selectedLevel} projects from the Orbital
              program ({filteredProjects.length} projects
              {selectedCohort !== "" ? ` in ${selectedCohort}` : ""})
            </Typography>
          </Box>
        </Box>

        <Stack spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <TextField
              id="cohort-select"
              name="cohort"
              label="Cohort"
              value={selectedCohort}
              onChange={handleCohortChange}
              select
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="">All Cohorts</MenuItem>
              {cohortYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Tabs
            value={selectedLevel}
            onChange={handleTabChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="achievement-level-tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ [`& .${tabsClasses.scrollButtons}`]: { color: "primary" } }}
          >
            {Object.values(LEVELS_OF_ACHIEVEMENT).map((lvl) => (
              <Tab key={lvl} value={lvl} label={lvl} />
            ))}
          </Tabs>
        </Stack>

        <Grid container spacing={3}>
          {paginatedProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
              <ProjectCard
                project={project}
                detailsLinkPath={`/public-gallery/projects/${project.id}`}
              />
            </Grid>
          ))}
        </Grid>

        {paginatedProjects.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No projects available for {selectedLevel}
              {selectedCohort !== "" ? ` in ${selectedCohort}` : ""}
            </Typography>
          </Box>
        )}

        {filteredTotalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={filteredTotalPages}
              page={clientPage}
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
  const levels = Object.values(LEVELS_OF_ACHIEVEMENT).map((l) =>
    l.toLowerCase()
  );
  const paths: { params: { level: string; page: string } }[] = [];

  for (const level of levels) {
    try {
      const countData = await fetchPublicProjectsCount(PAGE_SIZE, level);
      const totalPages = Math.min(
        Math.max(countData.totalPages || 1, 1),
        MAX_PAGES_TO_PREBUILD
      );

      for (let p = 1; p <= totalPages; p++) {
        paths.push({ params: { level, page: String(p) } });
      }
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? `API Error (${error.statusCode}): ${error.message}`
          : `Unknown error: ${error}`;

      console.error(`[SSG] Failed to fetch paths for ${level}:`, errorMessage);

      // Fallback to single page for this level
      paths.push({ params: { level, page: "1" } });
    }
  }

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const level = (params?.level as string) || "artemis";
  const page = parseInt(params?.page as string) || 1;
  const achievementLevel = slugToLevel(level);

  try {
    // Fetch first page to get total count
    const firstPageData = await fetchPublicProjects(
      1,
      PAGE_SIZE,
      achievementLevel
    );
    const { totalPages, total } = firstPageData;

    // Fetch ALL projects for this level so client-side cohort filtering works
    let allProjects = [...firstPageData.projects];

    for (let p = 2; p <= totalPages; p++) {
      const pageData = await fetchPublicProjects(
        p,
        PAGE_SIZE,
        achievementLevel
      );
      allProjects = allProjects.concat(pageData.projects);
    }

    if (page > totalPages && totalPages > 0) {
      return { notFound: true };
    }

    return {
      props: {
        projects: allProjects,
        currentPage: page,
        totalPages: totalPages || 1,
        total: total || 0,
        level,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof ApiError
        ? `API Error (${error.statusCode}): ${error.message} at ${error.endpoint}`
        : `Unknown error: ${error}`;

    console.error(
      `[SSG] Failed to fetch ${level} projects for page ${page}:`,
      errorMessage
    );

    return {
      props: {
        projects: [],
        currentPage: page,
        totalPages: 1,
        total: 0,
        level,
      },
    };
  }
};

export default PublicGalleryLevelPage;
