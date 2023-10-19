import React, { useState } from "react";
// Components
import Body from "@/components/layout/Body";
import {
  Box,
  Button,
  Stack,
  Tab,
  Tabs,
  tabsClasses,
  Typography,
} from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import DeadlineDeliverableTable from "@/components/tables/DeadlineDeliverableTable";
import SubmissionTable from "@/components/tables/SubmissionTable";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoneFound from "@/components/emptyStates/NoneFound";
import Link from "next/link";
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
  GetStudentDeadlinesResponse,
  GetStudentPeerEvaluationAndFeedbackResponse,
} from "@/types/api";
import { VIEWER_ROLE } from "@/types/deadlines";
import { PAGES } from "@/helpers/navigation";

enum TAB {
  DEADLINES = "Upcoming Deadlines",
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

  const hasUpcomingDeadlines = deadlinesResponse?.deadlines.some(
    (deadlineDeliverable) => isFuture(deadlineDeliverable.deadline.dueBy)
  );

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
                  <Box id="upcoming-deadlines-div">
                    <Typography variant="h6" fontWeight={600}>
                      Upcoming Deadlines
                    </Typography>
                    <DeadlineDeliverableTable
                      deadlineDeliverables={deadlinesResponse?.deadlines.filter(
                        (deadlineDeliverable) =>
                          isFuture(deadlineDeliverable.deadline.dueBy)
                      )}
                      viewerRole={VIEWER_ROLE.PROJECTS}
                    />
                  </Box>
                )}
                {hasPastDeadlines && (
                  <Box id="past-deadlines-div">
                    <Typography variant="h6" fontWeight={600}>
                      Past Deadlines
                    </Typography>
                    <DeadlineDeliverableTable
                      deadlineDeliverables={deadlinesResponse?.deadlines.filter(
                        (deadlineDeliverable) =>
                          !isFuture(deadlineDeliverable.deadline.dueBy)
                      )}
                      viewerRole={VIEWER_ROLE.PROJECTS}
                    />
                  </Box>
                )}
              </Stack>
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
                  <Stack spacing="2rem">
                    {evaluationAndFeedbackResponse.deadlines.map(
                      ({ deadline, submissions }) => (
                        <Box key={deadline.id}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="h6" fontWeight={600}>
                              {deadline.name}
                            </Typography>
                            <Link
                              href={`${PAGES.ANONYMOUS_QUESTIONS_STUDENT}/${user?.student?.id}`}
                              passHref
                            >
                              <Button
                                className="view-anonymous-answers"
                                variant="outlined"
                                size="small"
                              >
                                View Anonymous Answers
                              </Button>
                            </Link>
                          </Stack>
                          <NoDataWrapper
                            noDataCondition={!submissions.length}
                            fallback={
                              <Typography>
                                No received evaluations found
                              </Typography>
                            }
                          >
                            <SubmissionTable
                              deadline={deadline}
                              submissions={submissions}
                            />
                          </NoDataWrapper>
                        </Box>
                      )
                    )}
                  </Stack>
                )}
            </NoDataWrapper>
          </LoadingWrapper>
        </TabPanel>
      </TabContext>
    </Body>
  );
};
export default StudentDashboard;
