import React, { useState } from "react";
// Components
import Body from "@/components/layout/Body";
import { Box, Stack, Tab, Tabs, tabsClasses, Typography } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import DeadlineDeliverableTable from "@/components/tables/DeadlineDeliverableTable";
import SubmissionTable from "@/components/tables/SubmissionTable";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoneFound from "@/components/emptyStates/NoneFound";
import ProjectTable from "@/components/tables/ProjectTable";
import EmptyEvaluationRelations from "@/components/emptyStates/EmptyEvaluationRelations/EmptyEvaluationRelations";
import CreateAutomaticallyModal from "@/components/modals/CreateAutomaticallyModal/CreateAutomaticallyModal";
import AddRelationsModal from "@/components/modals/AddRelationsModal";
import AdviserManageRelationsContent from "@/components/relations/AdviserManageRelationsContent/AdviserManageRelationsContent";
// Hooks
import useFetch, { isFetching } from "@/hooks/useFetch";
import useAuth from "@/contexts/useAuth";
// Helpers
import { isFuture } from "@/helpers/dates";
import { transformTabNameIntoId } from "@/helpers/dashboard";
// Type
import type { NextPage } from "next";
import { ROLES } from "@/types/roles";
import {
  GetAdviserDeadlinesResponse,
  GetAdviserTeamSubmissionsResponse,
  GetProjectsResponse,
  GetRelationsResponse,
} from "@/types/api";
import { VIEWER_ROLE } from "@/types/deadlines";

enum TAB {
  DEADLINES = "Upcoming Deadlines",
  SUBMISSIONS = "Your Teams' Submissions",
  MANAGE_TEAMS = "Manage Your Teams",
  MANAGE_RELATIONSHIPS = "Manage Evaluation Relations",
}

const AdviserDashboard: NextPage = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<TAB>(TAB.DEADLINES);
  const [isCreateAutomaticallyModalOpen, setIsCreateAutomaticallyModalOpen] =
    useState(false);
  const [isAddRelationsModalOpen, setIsAddRelationsModalOpen] = useState(false);

  const { data: deadlinesResponse, status: fetchDeadlinesStatus } =
    useFetch<GetAdviserDeadlinesResponse>({
      endpoint: `/dashboard/adviser/${user?.adviser?.id}/deadlines`,
      enabled: Boolean(user && user.adviser && user.adviser.id),
    });

  const { data: teamSubmissionsResponse, status: fetchTeamSubmissionsStatus } =
    useFetch<GetAdviserTeamSubmissionsResponse>({
      endpoint: `/dashboard/adviser/${user?.adviser?.id}/submissions`,
      enabled: Boolean(user && user.adviser && user.adviser.id),
    });

  const { data: projectsResponse, status: fetchProjectsStatus } =
    useFetch<GetProjectsResponse>({
      endpoint: `/projects/adviser/${user?.adviser?.id}`,
      enabled: Boolean(user && user.adviser && user.adviser.id),
    });

  const {
    data: relationsResponse,
    status: fetchRelationsStatus,
    mutate: mutateRelations,
  } = useFetch<GetRelationsResponse>({
    endpoint: `/relations/adviser/${user?.adviser?.id}`,
    enabled: Boolean(user && user.adviser && user.adviser.id),
  });

  /** Helper functions */
  const handleTabChange = (event: React.SyntheticEvent, newValue: TAB) => {
    setSelectedTab(newValue);
  };

  const hasUpcomingDeadlines = deadlinesResponse?.deadlines.some(
    (deadlineDeliverable) => isFuture(deadlineDeliverable.deadline.dueBy)
  );

  const hasPastDeadlines = deadlinesResponse?.deadlines.some(
    (deadlineDeliverable) => !isFuture(deadlineDeliverable.deadline.dueBy)
  );

  return (
    <Body authorizedRoles={[ROLES.ADVISERS]}>
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
              id={transformTabNameIntoId(tab)}
              value={tab}
              label={tab}
            />
          ))}
        </Tabs>

        <TabPanel value={TAB.DEADLINES}>
          <LoadingWrapper isLoading={isFetching(fetchDeadlinesStatus)}>
            <NoDataWrapper
              noDataCondition={!deadlinesResponse?.deadlines.length}
              fallback={<NoneFound message="No upcoming or past deadlines" />}
            >
              <Stack gap="2rem">
                {hasUpcomingDeadlines && (
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Upcoming Deadlines
                    </Typography>

                    <DeadlineDeliverableTable
                      deadlineDeliverables={deadlinesResponse?.deadlines.filter(
                        (deadlineDeliverable) =>
                          isFuture(deadlineDeliverable.deadline.dueBy)
                      )}
                      viewerRole={VIEWER_ROLE.ADVISERS}
                    />
                  </Box>
                )}
                {hasPastDeadlines && (
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Past Deadlines
                    </Typography>
                    <DeadlineDeliverableTable
                      deadlineDeliverables={deadlinesResponse?.deadlines.filter(
                        (deadlineDeliverable) =>
                          !isFuture(deadlineDeliverable.deadline.dueBy)
                      )}
                      viewerRole={VIEWER_ROLE.ADVISERS}
                    />
                  </Box>
                )}
              </Stack>
            </NoDataWrapper>
          </LoadingWrapper>
        </TabPanel>

        <TabPanel value={TAB.SUBMISSIONS}>
          <LoadingWrapper isLoading={isFetching(fetchTeamSubmissionsStatus)}>
            <NoDataWrapper
              noDataCondition={!teamSubmissionsResponse?.deadlines.length}
              fallback={<NoneFound message="No team submissions available" />}
            >
              <Stack gap="2rem">
                {teamSubmissionsResponse &&
                  teamSubmissionsResponse.deadlines && (
                    <>
                      {teamSubmissionsResponse.deadlines.map(
                        ({ deadline, submissions }) => (
                          <Box key={deadline.id}>
                            <Typography variant="h6" fontWeight={600}>
                              {deadline.name}
                            </Typography>
                            <SubmissionTable
                              deadline={deadline}
                              submissions={submissions}
                              shouldIncludeToColumn
                            />
                          </Box>
                        )
                      )}
                    </>
                  )}
              </Stack>
            </NoDataWrapper>
          </LoadingWrapper>
        </TabPanel>

        <TabPanel value={TAB.MANAGE_TEAMS}>
          <LoadingWrapper isLoading={isFetching(fetchProjectsStatus)}>
            <NoDataWrapper
              noDataCondition={!projectsResponse?.projects.length}
              fallback={<NoneFound message="No teams found" />}
            >
              {projectsResponse && projectsResponse.projects && (
                <ProjectTable
                  projects={projectsResponse.projects}
                  showMentorColumn
                  showEditAction
                />
              )}
            </NoDataWrapper>
          </LoadingWrapper>
        </TabPanel>

        <TabPanel value={TAB.MANAGE_RELATIONSHIPS}>
          <LoadingWrapper isLoading={isFetching(fetchRelationsStatus)}>
            <Stack>
              <CreateAutomaticallyModal
                open={isCreateAutomaticallyModalOpen}
                setOpen={setIsCreateAutomaticallyModalOpen}
                projects={projectsResponse?.projects ?? []}
                mutate={mutateRelations}
              />
              {/* This acts as the create manually modal */}
              <AddRelationsModal
                open={isAddRelationsModalOpen}
                setOpen={setIsAddRelationsModalOpen}
                projects={projectsResponse?.projects ?? []}
                mutate={mutateRelations}
              />
              <NoDataWrapper
                noDataCondition={!relationsResponse?.relations.length}
                fallback={
                  <EmptyEvaluationRelations
                    handleCreateAutomatically={() =>
                      setIsCreateAutomaticallyModalOpen(true)
                    }
                    handleCreateManually={() =>
                      setIsAddRelationsModalOpen(true)
                    }
                  />
                }
              >
                <AdviserManageRelationsContent
                  relations={relationsResponse?.relations ?? []}
                  projects={projectsResponse?.projects ?? []}
                  mutateRelations={mutateRelations}
                />
              </NoDataWrapper>
            </Stack>
          </LoadingWrapper>
        </TabPanel>
      </TabContext>
    </Body>
  );
};
export default AdviserDashboard;
