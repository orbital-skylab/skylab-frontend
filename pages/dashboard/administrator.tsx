import React, {
  ChangeEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
// Components
import Body from "@/components/layout/Body";
import {
  Box,
  debounce,
  Stack,
  Tab,
  Tabs,
  tabsClasses,
  Typography,
} from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoneFound from "@/components/emptyStates/NoneFound";
import RelationTable from "@/components/tables/RelationTable";
import ActionButtons from "@/components/tables/RelationTable/ActionButtons";
import AllTeamsMilestoneTable from "@/components/tables/AllTeamsMilestoneTable";
import ActionRow from "@/components/tables/AllTeamsMilestoneTable/ActionRow";
// Hooks
import useFetch, { isFetching } from "@/hooks/useFetch";
import useCohort from "@/contexts/useCohort";
// Type
import type { NextPage } from "next";
import { ROLES } from "@/types/roles";
import {
  GetAdministratorAllTeamMilestoneSubmissionsResponse,
  GetDeadlinesResponse,
  GetTeamsResponse,
  GetRelationsResponse,
} from "@/types/api";
import { Deadline, DEADLINE_TYPE } from "@/types/deadlines";
import { PossibleSubmission, SUBMISSION_STATUS } from "@/types/submissions";
import LoadingSpinner from "@/components/emptyStates/LoadingSpinner";
import useInfiniteFetch, {
  createBottomOfPageRef,
} from "@/hooks/useInfiniteFetch";

enum TAB {
  SUBMISSIONS = "All Teams' Milestone Submissions",
  MANAGE_RELATIONSHIPS = "Manage Evaluation Relations",
}

const LIMIT = 50;

const AdministratorDashboard: NextPage = () => {
  const { currentCohortYear } = useCohort();
  const [selectedTab, setSelectedTab] = useState<TAB>(TAB.SUBMISSIONS);
  /** States for viewing all teams' milestone submissions and infinite scrolling */
  const [selectedMilestoneDeadline, setSelectedMilestoneDeadline] =
    useState<Deadline | null>(null);
  const [selectedSubmissionStatus, setSelectedSubmissionStatus] = useState(
    SUBMISSION_STATUS.ALL
  );
  const [page, setPage] = useState(0);
  const [searchTextInput, setSearchTextInput] = useState(""); // The input value
  const [querySearch, setQuerySearch] = useState(""); // The debounced input value for searching

  /** Fetching deadlines where type === Milestone */
  const { data: deadlinesResponse, status: fetchDeadlinesStatus } =
    useFetch<GetDeadlinesResponse>({
      endpoint: `/deadlines?cohortYear=${currentCohortYear}`,
      enabled: Boolean(currentCohortYear),
      requiresAuthorization: true,
      onFetch: (response) => {
        const deadline = response.deadlines.find(
          (deadline) => deadline.type === DEADLINE_TYPE.MILESTONE
        );
        if (deadline) {
          setSelectedMilestoneDeadline(deadline);
        }
      },
    });
  const milestoneDeadlines =
    deadlinesResponse?.deadlines.filter(
      (deadline) => deadline.type === DEADLINE_TYPE.MILESTONE
    ) ?? [];

  /** Infinite fetching of all teams milestone submissions */
  const memoQueryParams = useMemo(
    () => ({
      cohortYear: currentCohortYear,
      deadlineId: selectedMilestoneDeadline?.id,
      search: querySearch,
      limit: LIMIT,
      submissionStatus:
        selectedSubmissionStatus === SUBMISSION_STATUS.ALL
          ? undefined
          : selectedSubmissionStatus,
    }),
    [
      currentCohortYear,
      selectedMilestoneDeadline?.id,
      querySearch,
      selectedSubmissionStatus,
    ]
  );
  const {
    data: allTeamsMilestones,
    originalData: allTeamsMilestonesOriginal, // Original data includes the extra metadata about unsubmitted count, submittedLate count, etc.
    status: fetchAllTeamsMilestonesStatus,
    hasMore,
  } = useInfiniteFetch<
    GetAdministratorAllTeamMilestoneSubmissionsResponse,
    PossibleSubmission
  >({
    endpoint: `/dashboard/administrator/team-submissions`,
    queryParams: memoQueryParams,
    requiresAuthorization: true,
    page,
    responseToData: (response) => response.submissions,
    enabled: Boolean(currentCohortYear) && Boolean(selectedMilestoneDeadline),
  });

  const { data: teamsResponse } = useFetch<GetTeamsResponse>({
    endpoint: `/teams/lean?cohortYear=${currentCohortYear}`,
    enabled: Boolean(currentCohortYear),
    requiresAuthorization: true,
  });

  const {
    data: relationsResponse,
    status: fetchRelationsStatus,
    mutate: mutateRelations,
  } = useFetch<GetRelationsResponse>({
    endpoint: `/relations`,
    requiresAuthorization: true,
  });

  /** To fetch more teams when the bottom of the page is reached */
  const observer = useRef<IntersectionObserver | null>(null);
  const bottomOfPageRef = createBottomOfPageRef(
    isFetching(fetchAllTeamsMilestonesStatus),
    hasMore,
    setPage,
    observer
  );

  /** Helper functions */
  const handleTabChange = (event: React.SyntheticEvent, newValue: TAB) => {
    setSelectedTab(newValue);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetQuerySearch = useCallback(
    debounce((val) => {
      setQuerySearch(val);
      setPage(0);
    }, 500),
    []
  );

  const handleSelectedMilestoneDeadlineChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedMilestoneDeadline(JSON.parse(e.target.value) as Deadline);
  };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTextInput(e.target.value);
    debouncedSetQuerySearch(e.target.value);
  };

  const handleSubmissionStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedSubmissionStatus(e.target.value as SUBMISSION_STATUS);
  };

  return (
    <Body authorizedRoles={[ROLES.ADMINISTRATORS]}>
      <TabContext value={selectedTab}>
        <Tabs
          value={selectedTab}
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
          {Object.values(TAB).map((tab) => (
            <Tab key={tab} value={tab} label={tab} />
          ))}
        </Tabs>

        <TabPanel value={TAB.SUBMISSIONS}>
          <LoadingWrapper isLoading={isFetching(fetchDeadlinesStatus)}>
            <NoDataWrapper
              noDataCondition={
                !milestoneDeadlines.length || !selectedMilestoneDeadline
              }
              fallback={
                <NoneFound message="No milestone deadlines found. Create one now!" />
              }
            >
              {selectedMilestoneDeadline && (
                <>
                  <ActionRow
                    selectedMilestoneDeadline={selectedMilestoneDeadline}
                    handleSelectedMilestoneDeadlineChange={
                      handleSelectedMilestoneDeadlineChange
                    }
                    selectedSubmissionStatus={selectedSubmissionStatus}
                    handleSubmissionStatusChange={handleSubmissionStatusChange}
                    searchTextInput={searchTextInput}
                    handleSearchInputChange={handleSearchInputChange}
                    milestoneDeadlines={milestoneDeadlines}
                    allTeamsMilestonesOriginal={
                      Array.isArray(allTeamsMilestonesOriginal)
                        ? allTeamsMilestonesOriginal[0]
                        : undefined
                    }
                  />
                  <AllTeamsMilestoneTable
                    deadline={selectedMilestoneDeadline}
                    submissions={allTeamsMilestones}
                  />
                  <div ref={bottomOfPageRef} />
                  <Box
                    sx={{
                      display: "grid",
                      placeItems: "center",
                      height: "100px",
                    }}
                  >
                    {isFetching(fetchAllTeamsMilestonesStatus) ? (
                      <LoadingSpinner size={50} />
                    ) : !hasMore ? (
                      <Typography>No more submissions found</Typography>
                    ) : null}
                  </Box>
                </>
              )}
            </NoDataWrapper>
          </LoadingWrapper>
        </TabPanel>

        <TabPanel value={TAB.MANAGE_RELATIONSHIPS}>
          <LoadingWrapper isLoading={isFetching(fetchRelationsStatus)}>
            <Stack>
              <ActionButtons
                teams={teamsResponse?.teams ?? []}
                mutate={mutateRelations}
              />
              <NoDataWrapper
                noDataCondition={!relationsResponse?.relations.length}
                fallback={
                  <NoneFound message="No evaluation relations found." />
                }
              >
                {relationsResponse && relationsResponse.relations && (
                  <RelationTable
                    relations={relationsResponse.relations}
                    mutate={mutateRelations}
                    teams={teamsResponse?.teams ?? []}
                    showAdviserColumn
                  />
                )}
              </NoDataWrapper>
            </Stack>
          </LoadingWrapper>
        </TabPanel>
      </TabContext>
    </Body>
  );
};
export default AdministratorDashboard;
