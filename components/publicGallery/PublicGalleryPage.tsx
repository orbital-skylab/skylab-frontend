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
import { NAVBAR_HEIGHT_REM } from "@/styles/constants";
import { LEVELS_OF_ACHIEVEMENT } from "@/types/projects";
import { PAGE_SIZE } from "@/ssg/config/ssg";
import {
  levelToSlug,
  PublicGalleryPageProps,
  slugToLevel,
} from "@/helpers/publicGallery";

const PublicGalleryPage = ({
  projects,
  currentPage,
  level,
  cohortYear,
  cohortYears,
}: PublicGalleryPageProps) => {
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
      <Container
        maxWidth="xl"
        sx={{ pt: `calc(${NAVBAR_HEIGHT_REM} + 2rem)`, pb: 4 }}
      >
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

export default PublicGalleryPage;
