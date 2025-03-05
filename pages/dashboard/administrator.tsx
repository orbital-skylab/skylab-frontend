import React, {
  ChangeEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
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
  MenuItem,
  TextField,
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
  GetProjectsResponse,
  GetRelationsResponse,
} from "@/types/api";
import { Deadline, DEADLINE_TYPE } from "@/types/deadlines";
import { PossibleSubmission, SUBMISSION_STATUS } from "@/types/submissions";
import LoadingSpinner from "@/components/emptyStates/LoadingSpinner";
import useInfiniteFetch, {
  createBottomOfPageRef,
} from "@/hooks/useInfiniteFetch";
import { transformTabNameIntoId } from "@/helpers/dashboard";
import { Cohort } from "@/types/cohorts";

enum TAB {
  SUBMISSIONS = "All Teams' Milestone Submissions",
  MANAGE_RELATIONSHIPS = "Manage Evaluation Relations",
}

const LIMIT = 50;

const AdministratorDashboard: NextPage = () => {
  const { cohorts, currentCohortYear } = useCohort();
  const [selectedCohortYear, setSelectedCohortYear] = useState<
    Cohort["academicYear"] | ""
  >("");
  const [selectedTab, setSelectedTab] = useState<TAB>(TAB.SUBMISSIONS);
  /** States for viewing all teams' milestone submissions and infinite scrolling */
  const [selectedMilestoneDeadline, setSelectedMilestoneDeadline] =
    useState<Deadline | null>(null);
  const [selectedSubmissionStatus, setSelectedSubmissionStatus] = useState(
    SUBMISSION_STATUS.ALL
  );
  const [page, setPage] = useState(0);
  const [viewHasDropped, setViewHasDropped] = useState(false);
  const [searchTextInput, setSearchTextInput] = useState(""); // The input value
  const [querySearch, setQuerySearch] = useState(""); // The debounced input value for searching

  /** Fetching deadlines where type === Milestone */
  const { data: deadlinesResponse, status: fetchDeadlinesStatus } =
    useFetch<GetDeadlinesResponse>({
      endpoint: `/deadlines?cohortYear=${selectedCohortYear}`,
      enabled: Boolean(selectedCohortYear),
      requiresAuthorization: true,
      onFetch: (response) => {
        const deadline = response.deadlines.find(
          (deadline) => deadline.type === DEADLINE_TYPE.MILESTONE
        );

        if (deadline) {
          setSelectedMilestoneDeadline(null);
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
      cohortYear: selectedCohortYear,
      deadlineId: selectedMilestoneDeadline
        ? selectedMilestoneDeadline.id
        : undefined,
      search: querySearch,
      limit: LIMIT,
      submissionStatus:
        selectedSubmissionStatus === SUBMISSION_STATUS.ALL
          ? undefined
          : selectedSubmissionStatus,
      dropped: viewHasDropped,
    }),
    [
      selectedCohortYear,
      selectedMilestoneDeadline,
      querySearch,
      selectedSubmissionStatus,
      viewHasDropped,
    ]
  );

  const {
    data: allTeamsMilestones,
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
    enabled: Boolean(selectedCohortYear),
  });

  const { data: projectsResponse } = useFetch<GetProjectsResponse>({
    endpoint: `/projects/lean?cohortYear=${selectedCohortYear}`,
    enabled: Boolean(selectedCohortYear),
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

  /** To fetch more projects when the bottom of the page is reached */
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
    const newValue = e.target.value;
    setSelectedMilestoneDeadline(
      newValue !== "0" ? (JSON.parse(newValue) as Deadline) : null
    );
    setPage(0);
  };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTextInput(e.target.value);
    debouncedSetQuerySearch(e.target.value);
  };

  const handleSubmissionStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedSubmissionStatus(e.target.value as SUBMISSION_STATUS);
    setPage(0);
  };

  const handleCohortYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedCohortYear(Number(e.target.value) as Cohort["academicYear"]);
    setPage(0);
  };

  const handleToggleViewDropped = () => {
    setViewHasDropped(!viewHasDropped);
    setPage(0);
  };

  useEffect(() => {
    if (currentCohortYear) {
      setSelectedCohortYear(currentCohortYear);
      setPage(0);
    }
  }, [currentCohortYear]);

  return (
    <Body authorizedRoles={[ROLES.ADMINISTRATORS]}>
      <TabContext value={selectedTab}>
        <Tabs
          value={selectedTab}
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
          {Object.values(TAB).map((tab) => (
            <Tab
              key={tab}
              value={tab}
              label={tab}
              id={transformTabNameIntoId(tab)}
            />
          ))}
        </Tabs>

        <TabPanel value={TAB.SUBMISSIONS}>
          <LoadingWrapper isLoading={isFetching(fetchDeadlinesStatus)}>
            <Stack gap="0.75rem">
              <TextField
                id="project-cohort-select"
                name="cohort"
                label="Cohort"
                value={selectedCohortYear}
                onChange={handleCohortYearChange}
                select
                size="small"
                sx={{ width: "auto", minWidth: "120", alignSelf: "start" }}
              >
                {cohorts &&
                  cohorts.map(({ academicYear }) => (
                    <MenuItem
                      id={`${academicYear}-projects-option`}
                      key={academicYear}
                      value={academicYear}
                    >
                      {academicYear}
                    </MenuItem>
                  ))}
              </TextField>

              <NoDataWrapper
                noDataCondition={!milestoneDeadlines.length}
                fallback={
                  <NoneFound message="No milestone deadlines found. Create one now!" />
                }
              >
                {selectedMilestoneDeadline !== null ? (
                  <>
                    <ActionRow
                      selectedMilestoneDeadline={selectedMilestoneDeadline}
                      handleSelectedMilestoneDeadlineChange={
                        handleSelectedMilestoneDeadlineChange
                      }
                      selectedSubmissionStatus={selectedSubmissionStatus}
                      handleSubmissionStatusChange={
                        handleSubmissionStatusChange
                      }
                      searchTextInput={searchTextInput}
                      handleSearchInputChange={handleSearchInputChange}
                      milestoneDeadlines={milestoneDeadlines}
                      viewHasDropped={viewHasDropped}
                      handleToggleViewDropped={handleToggleViewDropped}
                    />
                    <AllTeamsMilestoneTable
                      deadline={selectedMilestoneDeadline}
                      submissions={allTeamsMilestones}
                      milestoneDeadlines={milestoneDeadlines}
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
                ) : (
                  <>
                    <ActionRow
                      selectedMilestoneDeadline={null}
                      handleSelectedMilestoneDeadlineChange={
                        handleSelectedMilestoneDeadlineChange
                      }
                      selectedSubmissionStatus={SUBMISSION_STATUS.ALL}
                      handleSubmissionStatusChange={
                        handleSubmissionStatusChange
                      }
                      searchTextInput={searchTextInput}
                      handleSearchInputChange={handleSearchInputChange}
                      milestoneDeadlines={milestoneDeadlines}
                      viewHasDropped={viewHasDropped}
                      handleToggleViewDropped={handleToggleViewDropped}
                    />
                    <AllTeamsMilestoneTable
                      deadline={null}
                      submissions={allTeamsMilestones}
                      milestoneDeadlines={milestoneDeadlines}
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
            </Stack>
          </LoadingWrapper>
        </TabPanel>

        <TabPanel value={TAB.MANAGE_RELATIONSHIPS}>
          <LoadingWrapper isLoading={isFetching(fetchRelationsStatus)}>
            <Stack>
              <ActionButtons
                projects={projectsResponse?.projects ?? []}
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
                    projects={projectsResponse?.projects ?? []}
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
