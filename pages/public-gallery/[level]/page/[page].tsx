/* eslint-disable react/prop-types */
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
import { PAGE_SIZE, MAX_PAGES_TO_PREBUILD } from "@/ssg/config/ssg";
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
  totalPages,
  total,
  level,
}) => {
  const router = useRouter();
  const selectedLevel = slugToLevel(level);

  const handleTabChange = (
    _: React.SyntheticEvent,
    newLevel: LEVELS_OF_ACHIEVEMENT
  ) => {
    router.push(`/public-gallery/${levelToSlug(newLevel)}/page/1/`);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    router.push(`/public-gallery/${levelToSlug(selectedLevel)}/page/${page}/`);
  };

  return (
    <>
      <CustomHead
        title={`${selectedLevel} Projects - Public Gallery - Page ${currentPage}`}
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
              program ({total} projects)
            </Typography>
          </Box>
        </Box>

        <Stack spacing={2} sx={{ mb: 3 }}>
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
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
              <ProjectCard
                project={project}
                detailsLinkPath={`/public-gallery/projects/${project.id}`}
              />
            </Grid>
          ))}
        </Grid>

        {projects.length === 0 && (
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
    const data = await fetchPublicProjects(page, PAGE_SIZE, achievementLevel);

    if (page > data.totalPages && data.totalPages > 0) {
      return { notFound: true };
    }

    return {
      props: {
        projects: data.projects || [],
        currentPage: data.page || page,
        totalPages: data.totalPages || 1,
        total: data.total || 0,
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
