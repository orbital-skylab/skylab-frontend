import React, { useState } from "react";
// Components
import Body from "@/components/layout/Body";
import { Button, Tab, Tabs, tabsClasses, Typography } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import DeadlineDeliverableTable from "@/components/tables/DeadlineDeliverableTable";
import SubmissionTable from "@/components/tables/SubmissionTable";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoneFound from "@/components/emptyStates/NoneFound";
import ProjectTable from "@/components/tables/ProjectTable";
import GroupTable from "@/components/tables/GroupTable";
import { Add } from "@mui/icons-material";
import AddGroupModal from "@/components/modals/AddGroupModal";
// Hooks
import useFetch, { isFetching } from "@/hooks/useFetch";
import useAuth from "@/hooks/useAuth";
// Helpers
import { isFuture } from "@/helpers/dates";
import { groupProjectsByGroupId } from "@/helpers/projects";
// Type
import type { NextPage } from "next";
import { ROLES } from "@/types/roles";
import {
  GetAdviserDeadlinesResponse,
  GetAdviserTeamSubmissionsResponse,
  GetProjectsResponse,
} from "@/types/api";

enum TAB {
  DEADLINES = "Upcoming Deadlines",
  SUBMISSIONS = "Your Teams' Submissions",
  MANAGE_TEAMS = "Manage Your Teams",
  MANAGE_RELATIONSHIPS = "Manage Evaluation Relations",
}

const AdviserDashboard: NextPage = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<TAB>(TAB.DEADLINES);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);

  const { data: deadlinesResponse, status: fetchDeadlinesStatus } =
    useFetch<GetAdviserDeadlinesResponse>({
      endpoint: `/dashboard/adviser/${user?.adviser?.id}/deadlines`,
      enabled: Boolean(user && user.adviser && user.adviser.id),
    });

  const { data: teamSubmissionsResponse, status: fetchTeamSubmissionsStatus } =
    useFetch<GetAdviserTeamSubmissionsResponse>({
      endpoint: `/dashboard/adviser/${user?.student?.id}/submissions`,
      enabled: Boolean(user && user.adviser && user.adviser.id),
    });

  const {
    data: projectsResponse,
    status: fetchProjectsStatus,
    mutate: mutateProjects,
  } = useFetch<GetProjectsResponse>({
    endpoint: `/projects/adviser/${user?.adviser?.id}`,
    enabled: Boolean(user && user.adviser && user.adviser.id),
  });

  const projectsByGroupMap = groupProjectsByGroupId(projectsResponse?.projects);

  /** Helper functions */
  const handleTabChange = (event: React.SyntheticEvent, newValue: TAB) => {
    setSelectedTab(newValue);
  };

  const handleOpenAddGroupModal = () => {
    setIsAddGroupOpen(true);
  };

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
            <Tab key={tab} value={tab} label={tab} />
          ))}
        </Tabs>

        <TabPanel value={TAB.DEADLINES}>
          <LoadingWrapper isLoading={isFetching(fetchDeadlinesStatus)}>
            <NoDataWrapper
              noDataCondition={!deadlinesResponse?.deadlines.length}
              fallback={<NoneFound message="No upcoming or past deadlines" />}
            >
              <DeadlineDeliverableTable
                deadlineDeliverables={deadlinesResponse?.deadlines.filter(
                  (deadlineDeliverable) =>
                    isFuture(deadlineDeliverable.deadline.dueBy)
                )}
              />
              {hasPastDeadlines && (
                <>
                  <Typography variant="h6" fontWeight={600}>
                    Past Deadlines
                  </Typography>
                  <DeadlineDeliverableTable
                    deadlineDeliverables={deadlinesResponse?.deadlines.filter(
                      (deadlineDeliverable) =>
                        !isFuture(deadlineDeliverable.deadline.dueBy)
                    )}
                  />
                </>
              )}
            </NoDataWrapper>
          </LoadingWrapper>
        </TabPanel>

        <TabPanel value={TAB.SUBMISSIONS}>
          <LoadingWrapper isLoading={isFetching(fetchTeamSubmissionsStatus)}>
            <NoDataWrapper
              noDataCondition={!teamSubmissionsResponse?.deadlines.length}
              fallback={
                <NoneFound message="No peer milestone submissions available" />
              }
            >
              {teamSubmissionsResponse && teamSubmissionsResponse.deadlines && (
                <>
                  {teamSubmissionsResponse.deadlines.map(
                    ({ deadline, submissions }) => (
                      <>
                        <Typography variant="h6" fontWeight={600}>
                          {deadline.name}
                        </Typography>
                        <SubmissionTable
                          key={deadline.id}
                          deadline={deadline}
                          submissions={submissions}
                        />
                      </>
                    )
                  )}
                </>
              )}
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
          <LoadingWrapper isLoading={isFetching(fetchProjectsStatus)}>
            <AddGroupModal
              open={isAddGroupOpen}
              setOpen={setIsAddGroupOpen}
              mutate={mutateProjects}
            />
            <Button onClick={handleOpenAddGroupModal}>
              <Add /> Relationship
            </Button>
            <NoDataWrapper
              noDataCondition={!projectsByGroupMap || !projectsByGroupMap.size}
              fallback={
                <NoneFound message="No evaluation relationships found." />
              }
            >
              {projectsByGroupMap && (
                <GroupTable
                  projectsByGroupMap={projectsByGroupMap}
                  mutate={mutateProjects}
                />
              )}
            </NoDataWrapper>
          </LoadingWrapper>
        </TabPanel>
      </TabContext>
    </Body>
  );
};
export default AdviserDashboard;
