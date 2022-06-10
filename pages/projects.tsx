import { SyntheticEvent, useCallback, useMemo, useState } from "react";
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
} from "@mui/material";
// Components
import Body from "@/components/Body";
import ProjectCard from "@/components/cards/ProjectCard";
// Constants
import { LEVELS_OF_ACHIEVEMENT, Project } from "@/types/projects";
import { Cohort } from "@/types/cohorts";
import useFetch, { FETCH_STATUS } from "@/hooks/useFetch";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoProjectFound from "@/components/emptyStates/NoProjectsFound";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";

const Projects: NextPage = () => {
  const [selectedLevel, setSelectedLevel] = useState<LEVELS_OF_ACHIEVEMENT>(
    LEVELS_OF_ACHIEVEMENT.ARTEMIS
  );

  /** For fetching cohorts and setting default as latest cohort */
  const [selectedCohortYear, setSelectedCohortYear] = useState<
    Cohort["academicYear"] | null
  >(null);
  const { data: cohorts, status: fetchCohortsStatus } = useFetch<Cohort[]>({
    endpoint: "/cohorts",
    onFetch: (cohorts) =>
      setSelectedCohortYear(cohorts.length ? cohorts[0].academicYear : null),
  });

  /** For query searching with string pattern matching */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [querySearch, setQuerySearch] = useState("");
  const [searchTextInput, setSearchTextInput] = useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetQuerySearch = useCallback(
    debounce((val) => {
      setQuerySearch(val);
    }),
    []
  );

  /** For fetching projects based on filters */
  const memoQueryParams = useMemo(() => {
    return {
      cohortYear: selectedCohortYear,
      achievement: selectedLevel,
      search: querySearch,
    };
  }, [selectedCohortYear, selectedLevel, querySearch]);
  const { data: projects, status: fetchProjectStatus } = useFetch<Project[]>({
    endpoint: `/projects`,
    queryParams: memoQueryParams,
  });

  const handleTabChange = (
    event: SyntheticEvent,
    newLevel: LEVELS_OF_ACHIEVEMENT
  ) => {
    setSelectedLevel(newLevel);
  };

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
              onChange={(e) => {
                setSearchTextInput(e.target.value);
                debouncedSetQuerySearch(e.target.value);
              }}
              size="small"
            />
            <Select
              name="cohort"
              label="Cohort"
              value={selectedCohortYear}
              onChange={(e) => setSelectedCohortYear(e.target.value as number)}
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
        <LoadingWrapper
          isLoading={fetchProjectStatus === FETCH_STATUS.FETCHING}
          loadingText="Loading projects..."
        >
          <NoDataWrapper
            noDataCondition={projects === undefined || projects?.length === 0}
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
          </NoDataWrapper>
        </LoadingWrapper>
      </Body>
    </>
  );
};
export default Projects;
