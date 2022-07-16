import React, { useState } from "react";
// Components
import Body from "@/components/layout/Body";
import { Tab, Tabs, tabsClasses, Typography } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import DeadlineDeliverableTable from "@/components/tables/DeadlineDeliverableTable";
import SubmissionTable from "@/components/tables/SubmissionTable";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoneFound from "@/components/emptyStates/NoneFound";
// Hooks
import useFetch, { isFetching } from "@/hooks/useFetch";
import useAuth from "@/hooks/useAuth";
// Helpers
import { isFuture } from "@/helpers/dates";
// Type
import type { NextPage } from "next";
import { ROLES } from "@/types/roles";
import {
  GetStudentDeadlinesResponse,
  GetStudentPeerEvaluationAndFeedbackResponse,
  GetStudentPeerMilestonesResponse,
} from "@/types/api";

enum TAB {
  DEADLINES = "Upcoming Deadlines",
  MILESTONES = "Peer Milestone Submission",
  EVALUATIONS = "Received Evaluations",
}

const StudentDashboard: NextPage = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<TAB>(TAB.DEADLINES);

  const { data: deadlinesResponse, status: fetchDeadlinesStatus } =
    useFetch<GetStudentDeadlinesResponse>({
      endpoint: `/dashboard/student/${user?.student?.id}/deadlines`,
      enabled: Boolean(user && user.student && user.student.id),
    });

  const { data: milestonesResponse, status: fetchMilestonesStatus } =
    useFetch<GetStudentPeerMilestonesResponse>({
      endpoint: `/dashboard/student/${user?.student?.id}/milestones`,
      enabled: Boolean(user && user.student && user.student.id),
    });

  const {
    data: evaluationAndFeedbackResponse,
    status: fetchEvaluationAndFeedbackStatus,
  } = useFetch<GetStudentPeerEvaluationAndFeedbackResponse>({
    endpoint: `/dashboard/student/${user?.student?.id}/evaluations-feedbacks`,
    enabled: Boolean(user && user.student && user.student.id),
  });

  /** Helper functions */
  const handleTabChange = (event: React.SyntheticEvent, newValue: TAB) => {
    setSelectedTab(newValue);
  };

  const hasPastDeadlines = deadlinesResponse?.deadlines.some(
    (deadlineDeliverable) => !isFuture(deadlineDeliverable.deadline.dueBy)
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
        <TabPanel value={TAB.MILESTONES}>
          <LoadingWrapper isLoading={isFetching(fetchMilestonesStatus)}>
            <NoDataWrapper
              noDataCondition={!milestonesResponse?.deadlines.length}
              fallback={
                <NoneFound message="No peer milestone submissions available" />
              }
            >
              {milestonesResponse && milestonesResponse.deadlines && (
                <>
                  {milestonesResponse.deadlines.map(
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
        <TabPanel value={TAB.EVALUATIONS}>
          <LoadingWrapper
            isLoading={isFetching(fetchEvaluationAndFeedbackStatus)}
          >
            <NoDataWrapper
              noDataCondition={!evaluationAndFeedbackResponse?.deadlines.length}
              fallback={
                <NoneFound message="No evaluations or feedback received" />
              }
            >
              {evaluationAndFeedbackResponse &&
                evaluationAndFeedbackResponse.deadlines && (
                  <>
                    {evaluationAndFeedbackResponse.deadlines.map(
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
      </TabContext>
    </Body>
  );
};
export default StudentDashboard;
