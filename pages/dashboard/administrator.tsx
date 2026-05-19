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
import EvaluationsActionRow from "@/components/tables/EvaluationsTable/EvaluationsActionRow";
import MilestoneSummary from "@/components/tables/AllTeamsMilestoneTable/MilestoneSummary";
import EvaluationsTable from "@/components/tables/EvaluationsTable";
import EvaluationsSummary from "@/components/tables/EvaluationsTable/EvaluationsSummary";
import CollatedMilestoneResponsesTable from "@/components/tables/CollatedMilestoneResponsesTable";

// Hooks
import useFetch, { isFetching } from "@/hooks/useFetch";
import useCohort from "@/contexts/useCohort";
// Type
import type { NextPage } from "next";
import { ROLES } from "@/types/roles";
import {
  GetAdministratorAllTeamMilestoneSubmissionsResponse,
  GetAdministratorCollatedMilestoneSubmissionsResponse,
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
  EVALUATIONS = "All Teams' Evaluations",
  COLLATED = "Collated Responses",
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
  const [selectedEvaluationsDeadline, setSelectedEvaluationsDeadline] =
    useState<Deadline | null>(null);
  const [selectedSubmissionStatus, setSelectedSubmissionStatus] = useState(
    SUBMISSION_STATUS.ALL
  );
  const [page, setPage] = useState(0);
  const [viewHasDropped, setViewHasDropped] = useState(false);
  const [viewAnonymousAnswers, setViewAnonymousAnswers] = useState(false);
  const [searchTextInput, setSearchTextInput] = useState(""); // The input value
  const [querySearch, setQuerySearch] = useState(""); // The debounced input value for searching
  const [selectedEvaluatorType, setSelectedEvaluatorType] = useState("All");
  const resetMilestonesPagination = useCallback(() => setPage(0), []);
  const resetEvaluationsPagination = useCallback(
    () => setEvaluationsPage(0),
    []
  );
  const resetSubmissionPaginations = useCallback(() => {
    resetMilestonesPagination();
    resetEvaluationsPagination();
  }, [resetEvaluationsPagination, resetMilestonesPagination]);

  /** Fetching deadlines where type === Milestone and type === Evaluation */
  const { data: deadlinesResponse, status: fetchDeadlinesStatus } =
    useFetch<GetDeadlinesResponse>({
      endpoint: `/deadlines?cohortYear=${selectedCohortYear}`,
      enabled: Boolean(selectedCohortYear),
      requiresAuthorization: true,
      onFetch: () => {
        setSelectedMilestoneDeadline(null);
        setSelectedEvaluationsDeadline(null);
      },
    });

  const milestoneDeadlines =
    deadlinesResponse?.deadlines.filter(
      (deadline) => deadline.type === DEADLINE_TYPE.MILESTONE
    ) ?? [];

  const evaluationDeadlines = useMemo(() => {
    const filtered =
      deadlinesResponse?.deadlines.filter(
        (deadline) => deadline.type === DEADLINE_TYPE.EVALUATION
      ) ?? [];
    return [...filtered].sort((a, b) => a.id - b.id);
  }, [deadlinesResponse]);

  /** Infinite fetching of all teams milestone submissions */
  const memoMilestoneQueryParams = useMemo(
    () => ({
      cohortYear: selectedCohortYear,
      deadlineId: selectedMilestoneDeadline
        ? selectedMilestoneDeadline.id
        : undefined,
      search: querySearch,
      limit: LIMIT,
      submissionStatus:
        !selectedMilestoneDeadline ||
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

  /** Infinite fetching of all teams evaluations submissions */
  const memoEvaluationsQueryParams = useMemo(
    () => ({
      cohortYear: selectedCohortYear,
      deadlineId: selectedEvaluationsDeadline
        ? selectedEvaluationsDeadline.id
        : undefined,
      search: querySearch,
      limit: LIMIT,
      submissionStatus:
        !selectedEvaluationsDeadline ||
        selectedSubmissionStatus === SUBMISSION_STATUS.ALL
          ? undefined
          : selectedSubmissionStatus,
      dropped: viewHasDropped,
      evaluatorTypeFilter: selectedEvaluatorType,
    }),
    [
      selectedCohortYear,
      selectedEvaluationsDeadline,
      querySearch,
      selectedSubmissionStatus,
      viewHasDropped,
      selectedEvaluatorType,
    ]
  );

  /** Infinite fetching of all teams milestone submissions without limit */
  const memoMilestoneQueryParamsSummary = useMemo(
    () => ({
      cohortYear: selectedCohortYear,
      deadlineId: selectedMilestoneDeadline
        ? selectedMilestoneDeadline.id
        : undefined,
      search: querySearch,
      submissionStatus:
        !selectedMilestoneDeadline ||
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

  /** Infinite fetching of all teams evaluations submissions without limit */
  const memoEvaluationsQueryParamsSummary = useMemo(
    () => ({
      cohortYear: selectedCohortYear,
      deadlineId: selectedEvaluationsDeadline
        ? selectedEvaluationsDeadline.id
        : undefined,
      search: querySearch,
      submissionStatus:
        !selectedEvaluationsDeadline ||
        selectedSubmissionStatus === SUBMISSION_STATUS.ALL
          ? undefined
          : selectedSubmissionStatus,
      dropped: viewHasDropped,
    }),
    [
      selectedCohortYear,
      selectedEvaluationsDeadline,
      querySearch,
      selectedSubmissionStatus,
      viewHasDropped,
    ]
  );

  const [evaluationsPage, setEvaluationsPage] = useState(0);
  useEffect(() => {
    // Reset evaluations pagination when its filters change
    setEvaluationsPage(0);
  }, [
    selectedCohortYear,
    selectedEvaluationsDeadline,
    querySearch,
    selectedSubmissionStatus,
    viewHasDropped,
    selectedEvaluatorType,
  ]);

  const {
    data: allTeamsMilestones,
    status: fetchAllTeamsMilestonesStatus,
    hasMore: hasMoreMilestones,
  } = useInfiniteFetch<
    GetAdministratorAllTeamMilestoneSubmissionsResponse,
    PossibleSubmission
  >({
    endpoint: `/dashboard/administrator/team-submissions`,
    queryParams: memoMilestoneQueryParams,
    requiresAuthorization: true,
    page,
    responseToData: (response) => response.submissions,
    enabled: Boolean(selectedCohortYear),
  });

  const {
    data: allTeamsEvaluations,
    status: fetchAllTeamsEvaluationsStatus,
    hasMore: hasMoreEvaluations,
  } = useInfiniteFetch<
    GetAdministratorAllTeamMilestoneSubmissionsResponse,
    PossibleSubmission
  >({
    endpoint: `/dashboard/administrator/evaluations`,
    queryParams: memoEvaluationsQueryParams,
    requiresAuthorization: true,
    page: evaluationsPage,
    responseToData: (response) => response.submissions,
    enabled: Boolean(selectedCohortYear),
  });

  const { data: allTeamsMilestonesSummary } =
    useFetch<GetAdministratorAllTeamMilestoneSubmissionsResponse>({
      endpoint: `/dashboard/administrator/team-submissions`,
      queryParams: memoMilestoneQueryParamsSummary,
      requiresAuthorization: true,
      enabled: Boolean(selectedCohortYear),
    });

  const memoCollatedMilestoneQueryParams = useMemo(
    () => ({
      cohortYear: selectedCohortYear,
      deadlineId: selectedMilestoneDeadline
        ? selectedMilestoneDeadline.id
        : undefined,
      search: viewAnonymousAnswers ? undefined : querySearch,
      includeAnonymous: viewAnonymousAnswers,
      submissionStatus:
        selectedMilestoneDeadline &&
        selectedSubmissionStatus !== SUBMISSION_STATUS.ALL
          ? selectedSubmissionStatus
          : undefined,
      dropped: viewHasDropped,
    }),
    [
      selectedCohortYear,
      selectedMilestoneDeadline,
      querySearch,
      selectedSubmissionStatus,
      viewAnonymousAnswers,
      viewHasDropped,
    ]
  );

  const {
    data: collatedMilestoneResponses,
    status: fetchCollatedMilestoneResponsesStatus,
  } = useFetch<GetAdministratorCollatedMilestoneSubmissionsResponse>({
    endpoint: `/dashboard/administrator/team-submissions/collated`,
    queryParams: memoCollatedMilestoneQueryParams,
    requiresAuthorization: true,
    enabled: Boolean(selectedCohortYear),
  });

  const { data: allTeamsEvaluationsSummary } =
    useFetch<GetAdministratorAllTeamMilestoneSubmissionsResponse>({
      endpoint: `/dashboard/administrator/evaluations`,
      queryParams: memoEvaluationsQueryParamsSummary,
      requiresAuthorization: true,
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
    hasMoreMilestones,
    setPage,
    observer
  );

  const evaluationsObserver = useRef<IntersectionObserver | null>(null);
  const evaluationsBottomOfPageRef = createBottomOfPageRef(
    isFetching(fetchAllTeamsEvaluationsStatus),
    hasMoreEvaluations,
    setEvaluationsPage,
    evaluationsObserver
  );

  /** Helper functions */
  const handleTabChange = (event: React.SyntheticEvent, newValue: TAB) => {
    setSelectedTab(newValue);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetQuerySearch = useCallback(
    debounce((val) => {
      setQuerySearch(val);
      resetSubmissionPaginations();
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
    resetMilestonesPagination();
  };

  const handleEvaluatorTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedEvaluatorType(e.target.value);
    resetEvaluationsPagination();
  };

  const handleSelectedEvaluationsDeadlineChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.value;
    setSelectedEvaluationsDeadline(
      newValue !== "0" ? (JSON.parse(newValue) as Deadline) : null
    );
    resetEvaluationsPagination();
  };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTextInput(e.target.value);
    debouncedSetQuerySearch(e.target.value);
  };

  const handleSubmissionStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedSubmissionStatus(e.target.value as SUBMISSION_STATUS);
    resetSubmissionPaginations();
  };

  const handleCohortYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedCohortYear(Number(e.target.value) as Cohort["academicYear"]);
    resetSubmissionPaginations();
  };

  const handleToggleViewDropped = () => {
    setViewHasDropped(!viewHasDropped);
    resetSubmissionPaginations();
  };

  const handleToggleViewAnonymousAnswers = () => {
    setViewAnonymousAnswers((previousValue) => !previousValue);
    setSearchTextInput("");
    setQuerySearch("");
    resetMilestonesPagination();
  };

  useEffect(() => {
    if (currentCohortYear) {
      setSelectedCohortYear(currentCohortYear);
      resetSubmissionPaginations();
    }
  }, [currentCohortYear, resetSubmissionPaginations]);

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
              <NoDataWrapper
                noDataCondition={!milestoneDeadlines.length}
                fallback={
                  <NoneFound message="No milestone deadlines found. Create one now!" />
                }
              >
                <TextField
                  id="project-cohort-select"
                  name="cohort"
                  label="Cohort"
                  value={selectedCohortYear}
                  onChange={handleCohortYearChange}
                  select
                  size="small"
                  sx={{ width: "auto", minWidth: 120, alignSelf: "start" }}
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
                      selectedCohortYear={selectedCohortYear}
                    />
                    <MilestoneSummary
                      deadline={selectedMilestoneDeadline}
                      submissions={allTeamsMilestonesSummary?.submissions ?? []}
                      milestoneDeadlines={milestoneDeadlines}
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
                      ) : !hasMoreMilestones ? (
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
                      selectedCohortYear={selectedCohortYear}
                    />
                    <MilestoneSummary
                      deadline={selectedMilestoneDeadline}
                      submissions={allTeamsMilestonesSummary?.submissions ?? []}
                      milestoneDeadlines={milestoneDeadlines}
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
                      ) : !hasMoreMilestones ? (
                        <Typography>No more submissions found</Typography>
                      ) : null}
                    </Box>
                  </>
                )}
              </NoDataWrapper>
            </Stack>
          </LoadingWrapper>
        </TabPanel>

        <TabPanel value={TAB.EVALUATIONS}>
          <LoadingWrapper isLoading={isFetching(fetchDeadlinesStatus)}>
            <Stack gap="0.75rem">
              <TextField
                id="project-cohort-select-evaluations"
                name="cohort"
                label="Cohort"
                value={selectedCohortYear}
                onChange={handleCohortYearChange}
                select
                size="small"
                sx={{ width: "auto", minWidth: 120, alignSelf: "start" }}
              >
                {cohorts &&
                  cohorts.map(({ academicYear }) => (
                    <MenuItem key={academicYear} value={academicYear}>
                      {academicYear}
                    </MenuItem>
                  ))}
              </TextField>
              <NoDataWrapper
                noDataCondition={!evaluationDeadlines.length}
                fallback={
                  <NoneFound message="No evaluation deadlines found. Create one now!" />
                }
              >
                {selectedEvaluationsDeadline !== null ? (
                  <>
                    <EvaluationsActionRow
                      selectedEvaluationsDeadline={selectedEvaluationsDeadline}
                      handleSelectedEvaluationsDeadlineChange={
                        handleSelectedEvaluationsDeadlineChange
                      }
                      selectedSubmissionStatus={selectedSubmissionStatus}
                      handleSubmissionStatusChange={
                        handleSubmissionStatusChange
                      }
                      searchTextInput={searchTextInput}
                      handleSearchInputChange={handleSearchInputChange}
                      evaluationsDeadlines={evaluationDeadlines}
                      viewHasDropped={viewHasDropped}
                      handleToggleViewDropped={handleToggleViewDropped}
                      selectedCohortYear={selectedCohortYear}
                      selectedEvaluatorType={selectedEvaluatorType}
                      handleEvaluatorTypeChange={handleEvaluatorTypeChange}
                    />
                    <EvaluationsSummary
                      deadline={selectedEvaluationsDeadline}
                      submissions={
                        allTeamsEvaluationsSummary?.submissions ?? []
                      }
                      evaluationDeadlines={evaluationDeadlines}
                      evaluatorTypeFilter={selectedEvaluatorType}
                    />
                    <EvaluationsTable
                      submissions={allTeamsEvaluations}
                      deadline={selectedEvaluationsDeadline}
                      evaluationDeadlines={evaluationDeadlines}
                    />
                    <div ref={evaluationsBottomOfPageRef} />
                    <Box
                      sx={{
                        display: "grid",
                        placeItems: "center",
                        height: "100px",
                      }}
                    >
                      {isFetching(fetchAllTeamsEvaluationsStatus) ? (
                        <LoadingSpinner size={50} />
                      ) : !hasMoreEvaluations ? (
                        <Typography>No more submissions found</Typography>
                      ) : null}
                    </Box>
                  </>
                ) : (
                  <>
                    <EvaluationsActionRow
                      selectedEvaluationsDeadline={null}
                      handleSelectedEvaluationsDeadlineChange={
                        handleSelectedEvaluationsDeadlineChange
                      }
                      selectedSubmissionStatus={SUBMISSION_STATUS.ALL}
                      handleSubmissionStatusChange={
                        handleSubmissionStatusChange
                      }
                      searchTextInput={searchTextInput}
                      handleSearchInputChange={handleSearchInputChange}
                      evaluationsDeadlines={evaluationDeadlines}
                      viewHasDropped={viewHasDropped}
                      handleToggleViewDropped={handleToggleViewDropped}
                      selectedCohortYear={selectedCohortYear}
                      selectedEvaluatorType={selectedEvaluatorType}
                      handleEvaluatorTypeChange={handleEvaluatorTypeChange}
                    />
                    <EvaluationsSummary
                      deadline={selectedEvaluationsDeadline}
                      submissions={
                        allTeamsEvaluationsSummary?.submissions ?? []
                      }
                      evaluationDeadlines={evaluationDeadlines}
                      evaluatorTypeFilter={selectedEvaluatorType}
                    />
                    <EvaluationsTable
                      submissions={allTeamsEvaluations}
                      deadline={null}
                      evaluationDeadlines={evaluationDeadlines}
                    />
                    <div ref={evaluationsBottomOfPageRef} />
                    <Box
                      sx={{
                        display: "grid",
                        placeItems: "center",
                        height: "100px",
                      }}
                    >
                      {isFetching(fetchAllTeamsEvaluationsStatus) ? (
                        <LoadingSpinner size={50} />
                      ) : !hasMoreEvaluations ? (
                        <Typography>No more submissions found</Typography>
                      ) : null}
                    </Box>
                  </>
                )}
              </NoDataWrapper>
            </Stack>
          </LoadingWrapper>
        </TabPanel>

        <TabPanel value={TAB.COLLATED}>
          <LoadingWrapper isLoading={isFetching(fetchDeadlinesStatus)}>
            <Stack gap="0.75rem">
              <NoDataWrapper
                noDataCondition={!milestoneDeadlines.length}
                fallback={
                  <NoneFound message="No milestone deadlines found. Create one now!" />
                }
              >
                <TextField
                  id="project-cohort-select-collated"
                  name="cohort"
                  label="Cohort"
                  value={selectedCohortYear}
                  onChange={handleCohortYearChange}
                  select
                  size="small"
                  sx={{ width: "auto", minWidth: 120, alignSelf: "start" }}
                >
                  {cohorts &&
                    cohorts.map(({ academicYear }) => (
                      <MenuItem
                        id={`${academicYear}-collated-option`}
                        key={academicYear}
                        value={academicYear}
                      >
                        {academicYear}
                      </MenuItem>
                    ))}
                </TextField>

                <CollatedMilestoneResponsesTable
                  key={`${
                    selectedMilestoneDeadline?.id ?? "all"
                  }-${selectedSubmissionStatus}-${viewAnonymousAnswers}-${viewHasDropped}-${querySearch}`}
                  collated={collatedMilestoneResponses?.collated ?? []}
                  evaluationCollated={
                    collatedMilestoneResponses?.evaluationCollated ?? []
                  }
                  milestoneDeadlines={milestoneDeadlines}
                  selectedMilestoneDeadline={selectedMilestoneDeadline}
                  handleSelectedMilestoneDeadlineChange={
                    handleSelectedMilestoneDeadlineChange
                  }
                  selectedSubmissionStatus={selectedSubmissionStatus}
                  handleSubmissionStatusChange={handleSubmissionStatusChange}
                  searchTextInput={searchTextInput}
                  handleSearchInputChange={handleSearchInputChange}
                  viewAnonymousAnswers={viewAnonymousAnswers}
                  handleToggleViewAnonymousAnswers={
                    handleToggleViewAnonymousAnswers
                  }
                  isLoading={isFetching(fetchCollatedMilestoneResponsesStatus)}
                  viewHasDropped={viewHasDropped}
                  handleToggleViewDropped={handleToggleViewDropped}
                />
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
