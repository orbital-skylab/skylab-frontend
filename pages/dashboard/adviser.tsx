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
import TeamTable from "@/components/tables/TeamTable";
import RelationTable from "@/components/tables/RelationTable";
import ActionButtons from "@/components/tables/RelationTable/ActionButtons";
// Hooks
import useFetch, { isFetching } from "@/hooks/useFetch";
import useAuth from "@/contexts/useAuth";
// Helpers
import { isFuture } from "@/helpers/dates";
// Type
import type { NextPage } from "next";
import { ROLES } from "@/types/roles";
import {
  GetAdviserDeadlinesResponse,
  GetAdviserTeamSubmissionsResponse,
  GetTeamsResponse,
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

  const { data: teamsResponse, status: fetchTeamsStatus } =
    useFetch<GetTeamsResponse>({
      endpoint: `/teams/adviser/${user?.adviser?.id}`,
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

        <TabPanel value={TAB.DEADLINES}>
          <LoadingWrapper isLoading={isFetching(fetchDeadlinesStatus)}>
            <NoDataWrapper
              noDataCondition={!deadlinesResponse?.deadlines.length}
              fallback={<NoneFound message="No upcoming or past deadlines" />}
            >
              <Stack gap="2rem">
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
                {teamSubmissionsResponse && teamSubmissionsResponse.deadlines && (
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
          <LoadingWrapper isLoading={isFetching(fetchTeamsStatus)}>
            <NoDataWrapper
              noDataCondition={!teamsResponse?.teams.length}
              fallback={<NoneFound message="No teams found" />}
            >
              {teamsResponse && teamsResponse.teams && (
                <TeamTable
                  teams={teamsResponse.teams}
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
export default AdviserDashboard;
