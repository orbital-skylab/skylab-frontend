import {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import type { NextPage } from "next";
// Libraries
import {
  Grid,
  Select,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  tabsClasses,
  TextField,
  debounce,
  SelectChangeEvent,
  Box,
} from "@mui/material";
// Hooks
import useInfiniteFetch from "@/hooks/useInfiniteFetch";
import useFetch, { FETCH_STATUS } from "@/hooks/useFetch";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoProjectFound from "@/components/emptyStates/NoProjectsFound";
// Types
import { Cohort } from "@/types/cohorts";
// Components
import Body from "@/components/Body";
import ProjectCard from "@/components/cards/ProjectCard";
import LoadingSpinner from "@/components/emptyStates/LoadingSpinner";
// Constants
import { LEVELS_OF_ACHIEVEMENT, Project } from "@/types/projects";
const LIMIT = 16;

const Projects: NextPage = () => {
  const [selectedLevel, setSelectedLevel] = useState<LEVELS_OF_ACHIEVEMENT>(
    LEVELS_OF_ACHIEVEMENT.ARTEMIS
  );
  const [page, setPage] = useState(0);
  const [searchTextInput, setSearchTextInput] = useState(""); // The input value
  const [querySearch, setQuerySearch] = useState(""); // The debounced input value for searching
  const [selectedCohortYear, setSelectedCohortYear] = useState<
    Cohort["academicYear"] | null
  >(null);

  /** For fetching cohorts and setting default as latest cohort */
  const { data: cohorts, status: fetchCohortsStatus } = useFetch<Cohort[]>({
    endpoint: "/cohorts",
    onFetch: (cohorts) =>
      setSelectedCohortYear(cohorts.length ? cohorts[0].academicYear : null),
  });

  /** For fetching projects based on filters */
  const memoQueryParams = useMemo(() => {
    return {
      cohortYear: selectedCohortYear,
      achievement: selectedLevel,
      search: querySearch,
      limit: LIMIT,
    };
  }, [selectedCohortYear, selectedLevel, querySearch]);
  const {
    data: projects,
    status: fetchProjectStatus,
    hasMore,
  } = useInfiniteFetch<Project>({
    endpoint: `/projects`,
    queryParams: memoQueryParams,
    page,
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
      setQuerySearch(val);
    }),
    []
  );

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTextInput(e.target.value);
    debouncedSetQuerySearch(e.target.value);
    setPage(0);
  };

  const handleCohortYearChange = (e: SelectChangeEvent<number | null>) => {
    setSelectedCohortYear(e.target.value as Cohort["academicYear"]);
    setPage(0);
  };

  /** To fetch more projects when the bottom of the page is reached */
  const observer = useRef<IntersectionObserver | null>(null);
  const fetchMoreProjectsRef = useCallback(
    (node) => {
      if (fetchProjectStatus === FETCH_STATUS.FETCHING) {
        return;
      }
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [fetchProjectStatus, hasMore]
  );

  return (
    <>
      <Body
        isError={
          fetchProjectStatus === FETCH_STATUS.ERROR ||
          fetchCohortsStatus === FETCH_STATUS.ERROR
        }
        isLoading={fetchCohortsStatus === FETCH_STATUS.FETCHING}
      >
        <Stack direction="column" mt={{ md: "0.5rem" }} mb="1rem">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            mb={{ md: "0.5rem" }}
          >
            <TextField
              label="Search"
              value={searchTextInput}
              onChange={handleSearchInputChange}
              size="small"
            />
            <Select
              name="cohort"
              label="Cohort"
              value={selectedCohortYear}
              onChange={handleCohortYearChange}
              size="small"
            >
              {cohorts &&
                cohorts.map(({ academicYear }) => (
                  <MenuItem key={academicYear} value={academicYear}>
                    {academicYear}
                  </MenuItem>
                ))}
            </Select>
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
              maxWidth: { xs: "100%", md: "75%" },
              [`& .${tabsClasses.scrollButtons}`]: { color: "primary" },
              marginY: { xs: 2, md: 0 },
            }}
          >
            {Object.values(LEVELS_OF_ACHIEVEMENT).map((level) => {
              return <Tab key={level} value={level} label={level} />;
            })}
          </Tabs>
        </Stack>
        <NoDataWrapper
          noDataCondition={
            (projects === undefined || projects?.length === 0) &&
            fetchProjectStatus !== FETCH_STATUS.FETCHING
          }
          fallback={<NoProjectFound />}
        >
          <Grid container spacing={{ xs: 2, md: 4, xl: 8 }}>
            {projects
              ? projects.map((project) => {
                  return (
                    <Grid item key={project.id} xs={12} md={4} xl={3}>
                      <ProjectCard project={project} />
                    </Grid>
                  );
                })
              : null}
          </Grid>
          <div ref={fetchMoreProjectsRef} />
          {fetchProjectStatus === FETCH_STATUS.FETCHING ? (
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                marginY: projects.length === 0 ? "15vh" : 0,
              }}
            >
              <LoadingSpinner />
            </Box>
          ) : null}
        </NoDataWrapper>
      </Body>
    </>
  );
};
export default Projects;
