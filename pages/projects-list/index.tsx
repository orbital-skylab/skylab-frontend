import LoadingSpinner from "@/components/emptyStates/LoadingSpinner";
import NoneFound from "@/components/emptyStates/NoneFound";
import Body from "@/components/layout/Body";
import ProjectTable from "@/components/tables/ProjectTable";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import useCohort from "@/hooks/useCohort";
import { isFetching } from "@/hooks/useFetch";
import useInfiniteFetch, {
  createBottomOfPageRef,
} from "@/hooks/useInfiniteFetch";
import { Cohort } from "@/types/cohorts";
import { LEVELS_OF_ACHIEVEMENT_WITH_ALL, Project } from "@/types/projects";
import {
  Box,
  debounce,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  tabsClasses,
  TextField,
} from "@mui/material";
import {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const LIMIT = 20;

const ProjectsList = () => {
  const [selectedLevelOfAchievement, setSelectedLevelOfAchievement] =
    useState<LEVELS_OF_ACHIEVEMENT_WITH_ALL>(
      LEVELS_OF_ACHIEVEMENT_WITH_ALL.ALL
    );
  const [page, setPage] = useState(0);
  const [searchTextInput, setSearchTextInput] = useState(""); // The input value
  const [querySearch, setQuerySearch] = useState(""); // The debounced input value for searching
  const {
    cohorts,
    currentCohortYear,
    isLoading: isLoadingCohorts,
  } = useCohort();
  const [selectedCohortYear, setSelectedCohortYear] = useState<
    Cohort["academicYear"] | string
  >("");
  /** For fetching projects based on filters */
  const memoProjectsQueryParams = useMemo(() => {
    return {
      cohortYear: selectedCohortYear,
      achievement:
        selectedLevelOfAchievement === LEVELS_OF_ACHIEVEMENT_WITH_ALL.ALL
          ? undefined
          : selectedLevelOfAchievement,
      search: querySearch,
      limit: LIMIT,
    };
  }, [selectedCohortYear, selectedLevelOfAchievement, querySearch]);

  const {
    data: projects,
    status: fetchProjectsStatus,
    hasMore,
    mutate,
  } = useInfiniteFetch<Project[], Project>({
    endpoint: `/projects`,
    queryParams: memoProjectsQueryParams,
    page,
    responseToData: (response) => response,
  });

  /** Input Change Handlers */
  const handleTabChange = (
    event: SyntheticEvent,
    newLevelOfAchievement: LEVELS_OF_ACHIEVEMENT_WITH_ALL
  ) => {
    setSelectedLevelOfAchievement(newLevelOfAchievement);
    setPage(0);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetQuerySearch = useCallback(
    debounce((val) => {
      setQuerySearch(val);
    }, 500),
    []
  );

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTextInput(e.target.value);
    debouncedSetQuerySearch(e.target.value);
    setPage(0);
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
    <Body isLoading={isLoadingCohorts}>
      <Stack direction="column" mt="0.5rem" mb="1rem">
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
          <TextField
            name="cohort"
            label="Cohort"
            value={selectedCohortYear}
            onChange={handleCohortYearChange}
            select
            size="small"
          >
            {cohorts &&
              cohorts.map(({ academicYear }) => (
                <MenuItem key={academicYear} value={academicYear}>
                  {academicYear}
                </MenuItem>
              ))}
          </TextField>
        </Stack>

        <Tabs
          value={selectedLevelOfAchievement}
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
          {Object.values(LEVELS_OF_ACHIEVEMENT_WITH_ALL).map((level) => {
            return <Tab key={level} value={level} label={level} />;
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
          <ProjectTable projects={projects} mutate={mutate}>
            <div ref={bottomOfPageRef} />
            {isFetching(fetchProjectsStatus) ? (
              <Box
                sx={{
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <LoadingSpinner />
              </Box>
            ) : null}
            <Box sx={{ height: "15vh" }} />
          </ProjectTable>
        </NoDataWrapper>
      </LoadingWrapper>
    </Body>
  );
};

export default ProjectsList;
