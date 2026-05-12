/* eslint-disable react/prop-types */
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useMemo, useRef, useState, useEffect } from "react";
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
import Fuse from "fuse.js";
import ProjectCard from "@/components/cards/ProjectCard/ProjectCard";
import CustomHead from "@/components/layout/CustomHead";
import SearchInput from "@/components/search/SearchInput/SearchInput";
import { LEVELS_OF_ACHIEVEMENT, Project } from "@/types/projects";
import { PAGE_SIZE, MAX_PAGES_TO_PREBUILD } from "@/ssg/config/ssg";
import {
  fetchPublicProjectCohorts,
  fetchPublicProjects,
  fetchPublicProjectsCount,
} from "@/lib/api/projectsApi";

type Props = {
  projects: Project[];
  currentPage: number;
  totalPages: number;
  total: number;
  level: string;
  cohortYear: number;
  cohortYears: number[];
};

const slugToLevel = (slug: string): LEVELS_OF_ACHIEVEMENT => {
  const pascalCase = slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
  const matchingLevel = Object.values(LEVELS_OF_ACHIEVEMENT).find(
    (level) => level === pascalCase
  );
  return matchingLevel || LEVELS_OF_ACHIEVEMENT.ARTEMIS;
};

const levelToSlug = (level: LEVELS_OF_ACHIEVEMENT): string => {
  return level.toLowerCase();
};

const PublicGalleryCohortLevelPage: NextPage<Props> = ({
  projects,
  currentPage,
  level,
  cohortYear,
  cohortYears,
}) => {
  const router = useRouter();
  const selectedLevel = slugToLevel(level);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fuse = useMemo(
    () =>
      new Fuse(projects, {
        keys: [
          "name",
          "teamName",
          "students.name",
          "adviser.name",
          "mentor.name",
        ],
        threshold: 0.3,
        ignoreLocation: true,
      }),
    [projects]
  );

  const handleSearchChange = (value: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const searchedProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    return fuse.search(searchQuery).map((result) => result.item);
  }, [fuse, searchQuery, projects]);

  const searchedTotalPages = Math.max(
    Math.ceil(searchedProjects.length / PAGE_SIZE),
    1
  );
  const clientPage = Math.min(currentPage, searchedTotalPages);
  const paginatedProjects = searchedProjects.slice(
    (clientPage - 1) * PAGE_SIZE,
    clientPage * PAGE_SIZE
  );

  const handleCohortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextCohortYear = Number(event.target.value);
    router.push({
      pathname: `/public-gallery/${nextCohortYear}/${levelToSlug(
        selectedLevel
      )}/page/1/`,
    });
  };

  const handleTabChange = (
    _: React.SyntheticEvent,
    newLevel: LEVELS_OF_ACHIEVEMENT
  ) => {
    router.push({
      pathname: `/public-gallery/${cohortYear}/${levelToSlug(
        newLevel
      )}/page/1/`,
    });
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    router.push({
      pathname: `/public-gallery/${cohortYear}/${levelToSlug(
        selectedLevel
      )}/page/${page}/`,
    });
  };

  return (
    <>
      <CustomHead
        title={`${cohortYear} ${selectedLevel} Projects - Public Gallery - Page ${clientPage}`}
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
              program ({searchedProjects.length} projects in {cohortYear})
            </Typography>
          </Box>
        </Box>

        <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
          >
            <SearchInput
              id="project-search"
              label="Search projects"
              onChange={handleSearchChange}
            />
            <TextField
              id="cohort-select"
              name="cohort"
              label="Cohort"
              value={cohortYear}
              onChange={handleCohortChange}
              select
              size="small"
              sx={{ minWidth: 120 }}
            >
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
              No projects found
              {searchQuery ? ` matching "${searchQuery}"` : ""}
              {` in ${cohortYear} for ${selectedLevel}`}
            </Typography>
          </Box>
        )}

        {searchedTotalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={searchedTotalPages}
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
  const cohortYears = await fetchPublicProjectCohorts();
  const levels = Object.values(LEVELS_OF_ACHIEVEMENT).map((l) =>
    l.toLowerCase()
  );
  const paths: {
    params: { cohortYear: string; level: string; page: string };
  }[] = [];

  for (const cohortYear of cohortYears) {
    for (const level of levels) {
      const countData = await fetchPublicProjectsCount(
        PAGE_SIZE,
        level,
        cohortYear
      );
      const totalPages = Math.min(
        Math.max(countData.totalPages || 1, 1),
        MAX_PAGES_TO_PREBUILD
      );

      for (let p = 1; p <= totalPages; p++) {
        paths.push({
          params: { cohortYear: String(cohortYear), level, page: String(p) },
        });
      }
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
  const cohortYear = Number(params?.cohortYear);
  const achievementLevel = slugToLevel(level);

  if (!Number.isFinite(cohortYear) || cohortYear <= 0) {
    return { notFound: true };
  }

  const [firstPageData, cohortYears] = await Promise.all([
    fetchPublicProjects(1, PAGE_SIZE, achievementLevel, cohortYear),
    fetchPublicProjectCohorts(),
  ]);
  const { totalPages, total } = firstPageData;

  if ((totalPages === 0 && page > 1) || (totalPages > 0 && page > totalPages)) {
    return { notFound: true };
  }

  let allProjects = [...firstPageData.projects];

  for (let p = 2; p <= totalPages; p++) {
    const pageData = await fetchPublicProjects(
      p,
      PAGE_SIZE,
      achievementLevel,
      cohortYear
    );
    allProjects = allProjects.concat(pageData.projects);
  }

  return {
    props: {
      projects: allProjects,
      currentPage: page,
      totalPages: totalPages || 1,
      total: total || 0,
      level,
      cohortYear,
      cohortYears,
    },
  };
};

export default PublicGalleryCohortLevelPage;
