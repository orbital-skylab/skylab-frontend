import {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { NextPage } from "next";
// Libraries
import {
  Grid,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  tabsClasses,
  TextField,
  debounce,
  Box,
  Typography,
} from "@mui/material";
import CustomHead from "@/components/layout/CustomHead";
// Hooks
import useInfiniteFetch from "@/hooks/useInfiniteFetch";
import { isError, isFetching } from "@/hooks/useFetch";
import useCohort from "@/contexts/useCohort";
// Helpers
import { createBottomOfPageRef } from "@/hooks/useInfiniteFetch";
// Types
import { Cohort } from "@/types/cohorts";
// Components
import Body from "@/components/layout/Body";
import ProjectCard from "@/components/cards/ProjectCard";
import LoadingSpinner from "@/components/emptyStates/LoadingSpinner";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoneFound from "@/components/emptyStates/NoneFound";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
// Constants
import { LEVELS_OF_ACHIEVEMENT, Project } from "@/types/projects";
import { GetProjectsResponse } from "@/types/api";
import SearchInput from "@/components/search/SearchInput";

const LIMIT = 16;

const Projects: NextPage = () => {
  const [selectedLevel, setSelectedLevel] = useState<LEVELS_OF_ACHIEVEMENT>(
    LEVELS_OF_ACHIEVEMENT.ARTEMIS
  );
  const [page, setPage] = useState(0);
  const [querySearch, setQuerySearch] = useState(""); // The debounced input value for searching
  const {
    currentCohortYear,
    cohorts,
    isLoading: isLoadingCohorts,
  } = useCohort();
  const [selectedCohortYear, setSelectedCohortYear] = useState<
    Cohort["academicYear"] | string
  >("");

  /** For fetching projects based on filters */
  const memoQueryParams = useMemo(() => {
    return {
      cohortYear: selectedCohortYear,
      achievement: selectedLevel,
      search: querySearch,
      limit: LIMIT,
      dropped: false,
    };
  }, [selectedCohortYear, selectedLevel, querySearch]);
  const {
    data: projects,
    status: fetchProjectsStatus,
    hasMore,
  } = useInfiniteFetch<GetProjectsResponse, Project>({
    endpoint: `/projects`,
    queryParams: memoQueryParams,
    page,
    responseToData: (response) => response.projects,
    enabled: !!selectedCohortYear,
  });

  /** Input Change Handlers */
  const handleTabChange = (
    event: SyntheticEvent,
    newLevel: LEVELS_OF_ACHIEVEMENT
  ) => {
    setSelectedLevel(newLevel);
    setPage(0);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetQuerySearch = useCallback(
    debounce((val) => {
      setPage(0);
      setQuerySearch(val);
    }, 200),
    []
  );

  const handleSearchInputChange = (searchText: string) => {
    debouncedSetQuerySearch(searchText);
  };

  const handleCohortYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedCohortYear(Number(e.target.value) as Cohort["academicYear"]);
    setPage(0);
  };

  /** To fetch more projects when the bottom of the page is reached */
  const observer = useRef<IntersectionObserver | null>(null);
  const bottomOfPageRef = createBottomOfPageRef(
    isFetching(fetchProjectsStatus),
    hasMore,
    setPage,
    observer
  );

  useEffect(() => {
    if (currentCohortYear) {
      setSelectedCohortYear(currentCohortYear);
    }
  }, [currentCohortYear]);

  return (
    <>
      <CustomHead
        title="Project Gallery"
        description="View the posters and videos of NUS Orbital projects from current and past cohorts!"
      />
      <Body isError={isError(fetchProjectsStatus)} isLoading={isLoadingCohorts}>
        <Stack direction="column" my="0.5rem">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            mb={{ md: "0.5rem" }}
          >
            <SearchInput
              id="project-search-input"
              label="Search"
              onChange={handleSearchInputChange}
            />
            <TextField
              id="project-cohort-select"
              name="cohort"
              label="Cohort"
              value={selectedCohortYear}
              onChange={handleCohortYearChange}
              select
              size="small"
            >
              {cohorts &&
                cohorts.map(({ academicYear }) => (
                  <MenuItem
                    id={`cohort-${academicYear}-option`}
                    key={academicYear}
                    value={academicYear}
                  >
                    {academicYear}
                  </MenuItem>
                ))}
            </TextField>
          </Stack>
          <Tabs
            value={selectedLevel}
            onChange={handleTabChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="project-level-tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              [`& .${tabsClasses.scrollButtons}`]: { color: "primary" },
              marginY: { xs: 2, md: 0 },
            }}
          >
            {Object.values(LEVELS_OF_ACHIEVEMENT).map((level) => {
              return (
                <Tab
                  id={`${level.toLowerCase()}-tab`}
                  key={level}
                  value={level}
                  label={level}
                />
              );
            })}
          </Tabs>
        </Stack>
        <LoadingWrapper
          isLoading={
            (projects === undefined || projects.length === 0) &&
            isFetching(fetchProjectsStatus)
          }
        >
          <NoDataWrapper
            noDataCondition={projects === undefined || projects.length === 0}
            fallback={<NoneFound message="No such projects found" />}
          >
            <Grid container spacing={{ xs: 2, md: 4 }}>
              {projects
                ? projects.map((project) => {
                    return (
                      <Grid item key={project.id} xs={12 / 2} md={12 / 4}>
                        <ProjectCard project={project} />
                      </Grid>
                    );
                  })
                : null}
            </Grid>
            <div id="project-gallery-bottom-ref" ref={bottomOfPageRef} />
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                height: "100px",
              }}
            >
              {isFetching(fetchProjectsStatus) ? (
                <LoadingSpinner size={50} />
              ) : !hasMore ? (
                <Typography>No more projects found</Typography>
              ) : null}
            </Box>
          </NoDataWrapper>
        </LoadingWrapper>
      </Body>
    </>
  );
};
export default Projects;
