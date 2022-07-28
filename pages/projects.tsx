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
import TeamProjectCard from "@/components/cards/TeamProjectCard";
import LoadingSpinner from "@/components/emptyStates/LoadingSpinner";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoneFound from "@/components/emptyStates/NoneFound";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
// Constants
import { LEVELS_OF_ACHIEVEMENT, Team } from "@/types/teams";
import { GetTeamsResponse } from "@/types/api";

const LIMIT = 16;

const Teams: NextPage = () => {
  const [selectedLevel, setSelectedLevel] = useState<LEVELS_OF_ACHIEVEMENT>(
    LEVELS_OF_ACHIEVEMENT.ARTEMIS
  );
  const [page, setPage] = useState(0);
  const [searchTextInput, setSearchTextInput] = useState(""); // The input value
  const [querySearch, setQuerySearch] = useState(""); // The debounced input value for searching
  const {
    currentCohortYear,
    cohorts,
    isLoading: isLoadingCohorts,
  } = useCohort();
  const [selectedCohortYear, setSelectedCohortYear] = useState<
    Cohort["academicYear"] | string
  >("");

  /** For fetching teams based on filters */
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
    data: teams,
    status: fetchTeamsStatus,
    hasMore,
  } = useInfiniteFetch<GetTeamsResponse, Team>({
    endpoint: `/teams`,
    queryParams: memoQueryParams,
    page,
    responseToData: (response) => response.teams,
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

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTextInput(e.target.value);
    debouncedSetQuerySearch(e.target.value);
  };

  const handleCohortYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedCohortYear(Number(e.target.value) as Cohort["academicYear"]);
    setPage(0);
  };

  /** To fetch more teams when the bottom of the page is reached */
  const observer = useRef<IntersectionObserver | null>(null);
  const bottomOfPageRef = createBottomOfPageRef(
    isFetching(fetchTeamsStatus),
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
        title="Team Gallery"
        description="View the posters and videos of NUS Orbital teams from current and past cohorts!"
      />
      <Body isError={isError(fetchTeamsStatus)} isLoading={isLoadingCohorts}>
        <Stack direction="column" my="0.5rem">
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
            value={selectedLevel}
            onChange={handleTabChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="team-level-tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
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
          isLoading={
            (teams === undefined || teams.length === 0) &&
            isFetching(fetchTeamsStatus)
          }
        >
          <NoDataWrapper
            noDataCondition={teams === undefined || teams.length === 0}
            fallback={<NoneFound message="No such teams found" />}
          >
            <Grid container spacing={{ xs: 2, md: 4 }}>
              {teams
                ? teams.map((team) => {
                    return (
                      <Grid item key={team.id} xs={12 / 2} md={12 / 4}>
                        <TeamProjectCard team={team} />
                      </Grid>
                    );
                  })
                : null}
            </Grid>
            <div ref={bottomOfPageRef} />
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                height: "100px",
              }}
            >
              {isFetching(fetchTeamsStatus) ? (
                <LoadingSpinner size={50} />
              ) : !hasMore ? (
                <Typography>No more teams found</Typography>
              ) : null}
            </Box>
          </NoDataWrapper>
        </LoadingWrapper>
      </Body>
    </>
  );
};
export default Teams;
