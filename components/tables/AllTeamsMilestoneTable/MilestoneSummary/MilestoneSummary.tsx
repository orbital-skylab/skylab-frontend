import { FC } from "react";
import { Card, CardContent, Typography, Grid, Box, Chip } from "@mui/material";
import { STATUS, PossibleSubmission } from "@/types/submissions";
import { Deadline } from "@/types/deadlines";
import { generateSubmissionStatus } from "@/helpers/submissions";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import LinearProgress from "@mui/material/LinearProgress";

interface Props {
  deadline: Deadline | null;
  submissions: PossibleSubmission[];
  milestoneDeadlines: Deadline[];
}

const MilestoneSummary: FC<Props> = ({
  deadline,
  submissions,
  milestoneDeadlines,
}) => {
  const countStatuses = (milestoneId: number | null) => {
    let submitted = 0,
      submittedLate = 0,
      notSubmitted = 0,
      total = 0;

    if (milestones.length === 1) {
      const deadline = milestoneDeadlines.find((d) => d.id === milestoneId);

      submissions.forEach((sub) => {
        if (sub.id !== milestoneId) {
          notSubmitted++;
          return;
        }

        const status = generateSubmissionStatus({
          submissionId: sub.id,
          isDraft: false,
          updatedAt: sub.updatedAt,
          dueBy: deadline ? deadline.dueBy : "",
        });

        if (status === STATUS.SUBMITTED) {
          submitted++;
        } else if (status === STATUS.SUBMITTED_LATE) {
          submittedLate++;
        } else {
          notSubmitted++;
        }
      });

      total = submitted + submittedLate + notSubmitted;
      return { submitted, submittedLate, notSubmitted, total };
    } else {
      milestoneDeadlines.forEach((milestone) => {
        if (milestoneId !== null && milestone.id !== milestoneId) return;

        submissions.forEach((sub) => {
          if (!sub.submission || sub.submission.length === 0) {
            notSubmitted++;
            return;
          }

          let hasSubmissionForMilestone = false;

          sub.submission.forEach((teamSubmission) => {
            if (teamSubmission.deadlineId === milestone.id) {
              hasSubmissionForMilestone = true;
              const status = generateSubmissionStatus({
                submissionId: teamSubmission.id,
                isDraft: false,
                updatedAt: teamSubmission.updatedAt,
                dueBy: milestone.dueBy,
              });

              if (status === STATUS.SUBMITTED) {
                submitted++;
              } else if (status === STATUS.SUBMITTED_LATE) {
                submittedLate++;
              } else {
                notSubmitted++;
              }
            }
          });

          if (!hasSubmissionForMilestone) {
            notSubmitted++;
          }
        });
      });

      total = submitted + submittedLate + notSubmitted;
      return { submitted, submittedLate, notSubmitted, total };
    }
  };

  const milestones = deadline ? [deadline] : milestoneDeadlines;

  return (
    <Grid container spacing={3}>
      {milestones.map((milestone) => {
        const stats = countStatuses(milestone.id);
        const submissionRate =
          ((stats.submitted + stats.submittedLate) / stats.total) * 100;

        return (
          <Grid item xs={12} sm={6} md={4} key={milestone.id}>
            <Card sx={{ position: "relative", overflow: "visible" }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h5" gutterBottom>
                    Milestone {milestone.id}
                  </Typography>
                  <Chip
                    label={`${submissionRate.toFixed(0)}% Complete`}
                    color={
                      submissionRate >= 70
                        ? "success"
                        : submissionRate >= 30
                        ? "warning"
                        : "error"
                    }
                  />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Due {new Date(milestone.dueBy).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Overall Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={submissionRate}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="h4" color="success.main">
                      {stats.submitted}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Submitted
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h4" color="warning.main">
                      {stats.submittedLate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Late
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h4" color="error.main">
                      {stats.notSubmitted}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Missing
                    </Typography>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2, p: 1, bgcolor: "grey.100", borderRadius: 1 }}>
                  <Typography variant="body2">
                    <strong>{stats.total}</strong> total teams
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default MilestoneSummary;
