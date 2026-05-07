import { FC } from "react";
import { Card, CardContent, Typography, Grid, Box, Chip } from "@mui/material";
import { STATUS, PossibleSubmission } from "@/types/submissions";
import { Deadline } from "@/types/deadlines";
import { generateSubmissionStatus } from "@/helpers/submissions";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import LinearProgress from "@mui/material/LinearProgress";

interface Props {
  deadline: Deadline | null;
  submissions: PossibleSubmission[]; // Array of unified EvaluationResult objects
  evaluationDeadlines: Deadline[];
  evaluatorTypeFilter: string;
}

const EvaluationsSummary: FC<Props> = ({
  deadline,
  submissions,
  evaluationDeadlines,
  evaluatorTypeFilter,
}) => {
  const evaluations = deadline ? [deadline] : evaluationDeadlines;

  const filteredSubmissions = submissions.filter((data) => {
    if (evaluatorTypeFilter === "Team") return !!data.fromProject;
    if (evaluatorTypeFilter === "Adviser") return !!data.fromUser;
    return true; // "All"
  });

  const countStatuses = (evaluationId: number) => {
    let submitted = 0,
      submittedLate = 0,
      notSubmitted = 0;

    const evalDeadline = evaluationDeadlines.find((d) => d.id === evaluationId);

    if (!evalDeadline)
      return { submitted, submittedLate, notSubmitted, total: 0 };

    filteredSubmissions.forEach((data) => {
      const isTeamRow = !!data.fromProject;
      const isAdviserRow = !!data.fromUser;

      const isApplicable =
        !evalDeadline.evaluatorType ||
        evalDeadline.evaluatorType === "Both" ||
        (evalDeadline.evaluatorType === "Team" && isTeamRow) ||
        (evalDeadline.evaluatorType === "Adviser" && isAdviserRow);

      if (!isApplicable) return;

      const subForThisDeadline = (() => {
        const sub = data.submission;
        if (!sub) {
          return null;
        }
        if (Array.isArray(sub)) {
          return sub.find((s) => s.deadlineId === evaluationId) || null;
        }
        const singleSub = sub as PossibleSubmission;
        return singleSub.deadlineId === evaluationId ? singleSub : null;
      })();

      const status = generateSubmissionStatus({
        submissionId: subForThisDeadline?.id,
        isDraft: false,
        updatedAt: subForThisDeadline?.updatedAt,
        dueBy: evalDeadline.dueBy,
      });

      if (status === STATUS.SUBMITTED) {
        submitted++;
      } else if (status === STATUS.SUBMITTED_LATE) {
        submittedLate++;
      } else {
        notSubmitted++;
      }
    });

    const total = submitted + submittedLate + notSubmitted;

    return { submitted, submittedLate, notSubmitted, total };
  };

  return (
    <Grid container spacing={3}>
      {evaluations.map((evaluation) => {
        const stats = countStatuses(evaluation.id);
        const submissionRate =
          stats.total === 0
            ? 0
            : ((stats.submitted + stats.submittedLate) / stats.total) * 100;

        return (
          <Grid item xs={12} sm={6} md={4} key={evaluation.id}>
            <Card sx={{ position: "relative", overflow: "visible" }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h5" gutterBottom>
                    {evaluation.name}
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
                    Due {new Date(evaluation.dueBy).toLocaleDateString()}
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
                    {/* Changed from "teams" to "expected" to account for both Team and Adviser relations */}
                    <strong>{stats.total}</strong> total expected
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

export default EvaluationsSummary;
