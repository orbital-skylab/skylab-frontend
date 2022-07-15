// TODO:
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
// Components
import Body from "@/components/layout/Body";
import { Tab, Tabs, tabsClasses, Typography } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import DeadlineDeliverableTable from "@/components/tables/DeadlineDeliverableTable";
// Hooks
import useFetch, { isFetching } from "@/hooks/useFetch";
import useAuth from "@/hooks/useAuth";
// Type
import type { NextPage } from "next";
import { ROLES } from "@/types/roles";
import {
  GetStudentDeadlines,
  GetStudentPeerEvaluationAndFeedback,
  GetStudentPeerMilestones,
} from "@/types/api";
import { DeadlineDeliverable } from "@/types/deadlines";

enum TAB {
  DEADLINES = "Upcoming Deadlines",
  MILESTONES = "Peer Milestone Submission",
  EVALUATIONS = "Received Evaluations",
}

const StudentDashboard: NextPage = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<TAB>(TAB.DEADLINES);

  const { data: deadlinesResponse, status: fetchDeadlinesStatus } =
    useFetch<GetStudentDeadlines>({
      endpoint: `/dashboard/student/${user?.student?.id}/deadlines`,
      enabled: Boolean(user && user.student && user.student.id),
    });

  const { data: milestonesResponse, status: fetchMilestonesStatus } =
    useFetch<GetStudentPeerMilestones>({
      endpoint: `/dashboard/student/${user?.student?.id}/milestones`,
      enabled: Boolean(user && user.student && user.student.id),
    });

  const {
    data: evaluationAndFeedbackResponse,
    status: fetchEvaluationAndFeedbackStatus,
  } = useFetch<GetStudentPeerEvaluationAndFeedback>({
    endpoint: `/dashboard/student/${user?.student?.id}/evaluations-feedbacks`,
    enabled: Boolean(user && user.student && user.student.id),
  });

  /** Helper functions */
  const handleTabChange = (event: React.SyntheticEvent, newValue: TAB) => {
    setSelectedTab(newValue);
  };

  const isFuture = (deadlineDeliverable: DeadlineDeliverable) => {
    return new Date(deadlineDeliverable.deadline.dueBy) > new Date();
  };

  const hasPastDeadlines = deadlinesResponse?.deadlines.some(
    (deadline) => !isFuture(deadline)
  );

  return (
    <Body authorizedRoles={[ROLES.STUDENTS]}>
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
            <DeadlineDeliverableTable
              deadlineDeliverables={deadlinesResponse?.deadlines.filter(
                (deadline) => isFuture(deadline)
              )}
            />
            {hasPastDeadlines && (
              <>
                <Typography>Past Deadlines</Typography>
                <DeadlineDeliverableTable
                  deadlineDeliverables={deadlinesResponse?.deadlines.filter(
                    (deadline) => !isFuture(deadline)
                  )}
                />
              </>
            )}
          </LoadingWrapper>
        </TabPanel>
        <TabPanel value={TAB.MILESTONES}>Peer Milestone Submission</TabPanel>
        <TabPanel value={TAB.EVALUATIONS}>Received Evaluations</TabPanel>
      </TabContext>
    </Body>
  );
};
export default StudentDashboard;
