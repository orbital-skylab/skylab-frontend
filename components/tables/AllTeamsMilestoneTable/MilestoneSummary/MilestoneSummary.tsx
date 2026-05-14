import { FC } from "react";
import { Card, CardContent, Typography, Grid, Box, Chip } from "@mui/material";
import { STATUS, PossibleSubmission } from "@/types/submissions";
import { Deadline } from "@/types/deadlines";
import { generateSubmissionStatus } from "@/helpers/submissions";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import LinearProgress from "@mui/material/LinearProgress";
import { getSubmissionArray } from "../ActionRow/ActionRow.helpers";

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
  const milestones = deadline ? [deadline] : milestoneDeadlines;

  const countStatuses = (milestoneId: number | null) => {
    let submitted = 0,
      submittedLate = 0,
      notSubmitted = 0,
      total = 0;

    if (milestones.length === 1) {
      const selectedDeadline =
        deadline ?? milestoneDeadlines.find((d) => d.id === milestoneId);

      submissions.forEach((sub) => {
        if (!sub.id || !sub.updatedAt) {
          notSubmitted++;
          return;
        }

        const status = generateSubmissionStatus({
          submissionId: sub.id,
          isDraft: false,
          updatedAt: sub.updatedAt,
          dueBy: selectedDeadline ? selectedDeadline.dueBy : "",
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
      // Build a lookup: milestoneId -> Set of submission statuses
      const milestoneSubmissions = new Map<number, { status: STATUS }[]>();

      submissions.forEach((sub) => {
        const submissionArray = getSubmissionArray(sub);

        if (submissionArray.length === 0) {
          // No submissions at all for this team → mark as missing for all milestones
          milestoneDeadlines.forEach((m) => {
            const list = milestoneSubmissions.get(m.id) || [];
            list.push({ status: STATUS.NOT_YET_STARTED });
            milestoneSubmissions.set(m.id, list);
          });
        } else {
          milestoneDeadlines.forEach((m) => {
            const subForThisMilestone = submissionArray.find(
              (teamSubmission) => teamSubmission.deadlineId === m.id
            );
            const list = milestoneSubmissions.get(m.id) || [];

            if (subForThisMilestone) {
              const status = generateSubmissionStatus({
                submissionId: subForThisMilestone.id,
                isDraft: false,
                updatedAt: subForThisMilestone.updatedAt,
                dueBy: m.dueBy,
              });
              list.push({ status });
            } else {
              list.push({ status: STATUS.NOT_YET_STARTED });
            }

            milestoneSubmissions.set(m.id, list);
          });
        }
      });

      const milestonesToCheck = milestoneId
        ? [milestoneId]
        : milestoneDeadlines.map((m) => m.id);

      milestonesToCheck.forEach((mId) => {
        const stats = milestoneSubmissions.get(mId) || [];
        stats.forEach(({ status }) => {
          if (status === STATUS.SUBMITTED) submitted++;
          else if (status === STATUS.SUBMITTED_LATE) submittedLate++;
          else notSubmitted++;
        });
      });

      total = submitted + submittedLate + notSubmitted;
      return { submitted, submittedLate, notSubmitted, total };
    }
  };

  return (
    <Grid container spacing={3}>
      {milestones.map((milestone) => {
        const stats = countStatuses(milestone.id);
        const submissionRate =
          stats.total === 0
            ? 0
            : ((stats.submitted + stats.submittedLate) / stats.total) * 100;

        return (
          <Grid item xs={12} sm={6} md={4} key={milestone.id}>
            <Card sx={{ position: "relative", overflow: "visible" }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h5" gutterBottom>
                    {milestone.name}
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
