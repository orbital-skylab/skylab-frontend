import {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
// Components
import AutoBreadcrumbs from "@/components/layout/AutoBreadcrumbs";
import LoadingSpinner from "@/components/emptyStates/LoadingSpinner";
import NoneFound from "@/components/emptyStates/NoneFound";
import Body from "@/components/layout/Body";
import AddTeamModal from "@/components/modals/AddTeamModal";
import TeamTable from "@/components/tables/TeamTable";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import {
  Box,
  Button,
  debounce,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  Tab,
  Tabs,
  tabsClasses,
  TextField,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
// Hooks
import useCohort from "@/contexts/useCohort";
import { isFetching } from "@/hooks/useFetch";
import useInfiniteFetch, {
  createBottomOfPageRef,
} from "@/hooks/useInfiniteFetch";
// Types
import { GetTeamsResponse } from "@/types/api";
import { Cohort } from "@/types/cohorts";
import { LEVELS_OF_ACHIEVEMENT_WITH_ALL, Team } from "@/types/teams";
import { ROLES } from "@/types/roles";

const LIMIT = 50;

const TeamsList = () => {
  const [selectedLevelOfAchievement, setSelectedLevelOfAchievement] = useState(
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
    Cohort["academicYear"] | ""
  >("");
  const [viewHasDropped, setViewHasDropped] = useState(false);
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);

  /** For fetching teams based on filters */
  const memoTeamsQueryParams = useMemo(() => {
    return {
      cohortYear: selectedCohortYear,
      achievement:
        selectedLevelOfAchievement === LEVELS_OF_ACHIEVEMENT_WITH_ALL.ALL
          ? undefined
          : selectedLevelOfAchievement,
      search: querySearch,
      limit: LIMIT,
      dropped: viewHasDropped,
    };
  }, [
    selectedCohortYear,
    selectedLevelOfAchievement,
    querySearch,
    viewHasDropped,
  ]);

  const {
    data: teams,
    status: fetchTeamsStatus,
    hasMore,
    mutate,
  } = useInfiniteFetch<GetTeamsResponse, Team>({
    endpoint: `/teams`,
    queryParams: memoTeamsQueryParams,
    page,
    responseToData: (response) => response.teams,
    enabled: !!selectedCohortYear,
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
      setPage(0);
    }, 500),
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

  const handleOpenAddTeamModal = () => {
    setIsAddTeamOpen(true);
  };

  const handleToggleViewDropped = () => {
    setViewHasDropped(!viewHasDropped);
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
      <AddTeamModal
        open={isAddTeamOpen}
        setOpen={setIsAddTeamOpen}
        mutate={mutate}
      />
      <Body
        isLoading={isLoadingCohorts}
        authorizedRoles={[ROLES.ADMINISTRATORS]}
      >
        <AutoBreadcrumbs />
        <Stack direction="column" mb="0.5rem">
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
            <Stack direction="row" spacing="1rem">
              <Button
                variant="outlined"
                size="small"
                onClick={handleOpenAddTeamModal}
              >
                <Add fontSize="small" sx={{ marginRight: "0.2rem" }} />
                Team
              </Button>
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
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Tabs
              value={selectedLevelOfAchievement}
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
              {Object.values(LEVELS_OF_ACHIEVEMENT_WITH_ALL).map((level) => {
                return <Tab key={level} value={level} label={level} />;
              })}
            </Tabs>
            <FormControlLabel
              value={viewHasDropped}
              onClick={handleToggleViewDropped}
              control={<Switch color="secondary" size="small" />}
              label="View Dropped Teams"
              labelPlacement="start"
            />
          </Stack>
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
            <TeamTable
              teams={teams}
              mutate={mutate}
              showAdviserColumn
              showMentorColumn
              showEditAction
              showDeleteAction
            />
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

export default TeamsList;
