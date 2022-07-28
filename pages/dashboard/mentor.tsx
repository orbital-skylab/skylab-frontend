import React, { useState } from "react";
// Components
import Body from "@/components/layout/Body";
import { Tab, Tabs, tabsClasses, Typography } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import SubmissionTable from "@/components/tables/SubmissionTable";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoneFound from "@/components/emptyStates/NoneFound";
import ProjectTable from "@/components/tables/ProjectTable";
// Hooks
import useFetch, { isFetching } from "@/hooks/useFetch";
import useAuth from "@/contexts/useAuth";
// Helpers
import { transformTabNameIntoId } from "./Dashboard.helpers";
// Type
import type { NextPage } from "next";
import { ROLES } from "@/types/roles";
import {
  GetMentorTeamSubmissionsResponse,
  GetProjectsResponse,
} from "@/types/api";

enum TAB {
  SUBMISSIONS = "Your Teams' Submissions",
  VIEW_TEAMS = "View Your Teams",
}

const MentorDashboard: NextPage = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<TAB>(TAB.SUBMISSIONS);

  const { data: teamSubmissionsResponse, status: fetchTeamSubmissionsStatus } =
    useFetch<GetMentorTeamSubmissionsResponse>({
      endpoint: `/dashboard/mentor/${user?.mentor?.id}/submissions`,
      enabled: Boolean(user && user.mentor && user.mentor.id),
    });

  const { data: projectsResponse, status: fetchProjectsStatus } =
    useFetch<GetProjectsResponse>({
      endpoint: `/projects/mentor/${user?.mentor?.id}`,
      enabled: Boolean(user && user.mentor && user.mentor.id),
    });

  /** Helper functions */
  const handleTabChange = (event: React.SyntheticEvent, newValue: TAB) => {
    setSelectedTab(newValue);
  };

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

        <TabPanel value={TAB.SUBMISSIONS}>
          <LoadingWrapper isLoading={isFetching(fetchTeamSubmissionsStatus)}>
            <NoDataWrapper
              noDataCondition={!teamSubmissionsResponse?.deadlines.length}
              fallback={<NoneFound message="No team submissions available" />}
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

        <TabPanel value={TAB.VIEW_TEAMS}>
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
      </TabContext>
    </Body>
  );
};

export default MentorDashboard;
