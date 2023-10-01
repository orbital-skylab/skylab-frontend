import {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import type { NextPage } from "next";
// Components
import Body from "@/components/layout/Body";
import LoadingSpinner from "@/components/emptyStates/LoadingSpinner";
import NoneFound from "@/components/emptyStates/NoneFound";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import {
  Box,
  debounce,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  tabsClasses,
  TextField,
  Typography,
} from "@mui/material";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import AutoBreadcrumbs from "@/components/layout/AutoBreadcrumbs";
// Hooks
import { isFetching } from "@/hooks/useFetch";
import useInfiniteFetch, {
  createBottomOfPageRef,
} from "@/hooks/useInfiniteFetch";
// Types
import { ROLES } from "@/types/roles";
import { LEVELS_OF_ACHIEVEMENT_WITH_ALL } from "@/types/projects";
import { Application, APPLICATION_STATUS_WITH_ALL } from "@/types/applications";
import ApplicationsTable from "@/components/tables/ApplicationsTable";

type GetApplicationsResponse = {
  applications: Application[];
};

const LIMIT = 20;

const Applications: NextPage = () => {
  const [selectedLevelOfAchievement, setSelectedLevelOfAchievement] =
    useState<LEVELS_OF_ACHIEVEMENT_WITH_ALL>(
      LEVELS_OF_ACHIEVEMENT_WITH_ALL.ALL
    );
  const [selectedApplicationStatus, setSelectedApplicationStatus] =
    useState<APPLICATION_STATUS_WITH_ALL>(APPLICATION_STATUS_WITH_ALL.ALL);
  const [page, setPage] = useState(0);
  const [searchTextInput, setSearchTextInput] = useState(""); // The input value
  const [querySearch, setQuerySearch] = useState(""); // The debounced input value for searching

  /** For fetching applications based on filters */
  const memoApplicationsQueryParams = useMemo(() => {
    return {
      achievement:
        selectedLevelOfAchievement !== LEVELS_OF_ACHIEVEMENT_WITH_ALL.ALL
          ? selectedLevelOfAchievement
          : undefined,
      status:
        selectedApplicationStatus !== APPLICATION_STATUS_WITH_ALL.ALL
          ? selectedApplicationStatus
          : undefined,
      search: querySearch,
      limit: LIMIT,
    };
  }, [selectedLevelOfAchievement, selectedApplicationStatus, querySearch]);

  const {
    data: applications,
    status: fetchApplicationsStatus,
    hasMore,
    mutate,
  } = useInfiniteFetch<GetApplicationsResponse, Application>({
    endpoint: "/application/all",
    queryParams: memoApplicationsQueryParams,
    page,
    responseToData: (response) => response.applications,
    requiresAuthorization: true,
  });

  /** Input Change Handlers */
  const handleTabChange = (
    event: SyntheticEvent,
    newAchievement: LEVELS_OF_ACHIEVEMENT_WITH_ALL
  ) => {
    setSelectedLevelOfAchievement(newAchievement);
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

  const handleChangeApplicationStatus = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedApplicationStatus(e.target.value as APPLICATION_STATUS_WITH_ALL);
    setPage(0);
  };

  /** To fetch more applications when the bottom of the page is reached */
  const observer = useRef<IntersectionObserver | null>(null);
  const bottomOfPageRef = createBottomOfPageRef(
    isFetching(fetchApplicationsStatus),
    hasMore,
    setPage,
    observer
  );

  return (
    <>
      <Body authorizedRoles={[ROLES.ADMINISTRATORS]}>
        <AutoBreadcrumbs />
        <Stack direction="column" mb="0.5rem">
          <Stack
            direction="row"
            justifyContent="start"
            sx={{
              gap: "0.5rem",
              marginBottom: { md: "0.5rem" },
            }}
          >
            <TextField
              label="Search"
              value={searchTextInput}
              onChange={handleSearchInputChange}
              size="small"
            />
            <Stack direction="row" spacing="1rem" marginLeft="auto">
              <TextField
                label="Status"
                value={selectedApplicationStatus}
                onChange={handleChangeApplicationStatus}
                select
                size="small"
              >
                {Object.values(APPLICATION_STATUS_WITH_ALL).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
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
            (applications === undefined || applications.length === 0) &&
            isFetching(fetchApplicationsStatus)
          }
        >
          <NoDataWrapper
            noDataCondition={
              applications === undefined || applications.length === 0
            }
            fallback={<NoneFound message="No such applications found" />}
          >
            <ApplicationsTable applications={applications} mutate={mutate} />
            <div ref={bottomOfPageRef} />
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                height: "100px",
              }}
            >
              {isFetching(fetchApplicationsStatus) ? (
                <LoadingSpinner size={50} />
              ) : !hasMore ? (
                <Typography>No more applications found</Typography>
              ) : null}
            </Box>
          </NoDataWrapper>
        </LoadingWrapper>
      </Body>
    </>
  );
};
export default Applications;
