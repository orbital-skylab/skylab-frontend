import { FC, useState, useMemo, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Mail as MailIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import EmailComposeView from "@/components/modals/EmailComposeView";
// Hooks
import useFetch from "@/hooks/useFetch";
// Types
import { PossibleSubmission, SUBMISSION_STATUS } from "@/types/submissions";
import {
  GetAdministratorAllTeamMilestoneSubmissionsResponse,
  HTTP_METHOD,
} from "@/types/api";
import { DEADLINE_TYPE, Deadline } from "@/types/deadlines";
import { Cohort } from "@/types/cohorts";
import { ApiServiceBuilder } from "@/helpers/api";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`evaluation-tabpanel-${index}`}
      aria-labelledby={`evaluation-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

// Custom type to group missing relations by Evaluator
export type GroupedEvaluator = {
  id: string; // e.g., "user-1" or "project-5"
  realId: number | string; // The actual ID for the Chip display
  name: string;
  projectName?: string; // Specific to Team evaluators
  type: "Adviser" | "Team";
  emails: string[];
  members?: string;
  missingCount: number; // Keep track of how many evaluations they missed
};

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  evaluationDeadlines: Deadline[];
  selectedCohortYear: Cohort["academicYear"] | "";
  evaluatorTypeFilter: string;
}

const SendEvaluationReminderModal: FC<Props> = ({
  open,
  setOpen,
  evaluationDeadlines,
  selectedCohortYear,
  evaluatorTypeFilter,
}) => {
  const [selectedEvaluators, setSelectedEvaluators] = useState<string[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedEvaluationDeadline, setSelectedEvaluationDeadline] = useState<
    Deadline | undefined
  >(evaluationDeadlines[0]);
  const isFeedback =
    (selectedEvaluationDeadline?.type ?? evaluationDeadlines[0]?.type) ===
    DEADLINE_TYPE.FEEDBACK;
  const deadlineLabel = isFeedback ? "Feedback" : "Evaluation";
  const submissionsEndpoint = isFeedback
    ? "/dashboard/administrator/feedback"
    : "/dashboard/administrator/evaluations";
  const [sending, setSending] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [filteredRelations, setFilteredRelations] = useState<
    PossibleSubmission[]
  >([]);

  const [emailComposeStage, setEmailComposeStage] = useState(false);
  const [ccs, setCcs] = useState<string>("");
  const [subject, setSubject] = useState<string>(
    `Reminder: ${selectedEvaluationDeadline?.name} Submission`
  );
  const [message, setMessage] = useState<string>(
    `Dear Evaluator,\n\nThis is a reminder to submit your ${selectedEvaluationDeadline?.name} by the deadline.\n\nBest regards,\nAdmin`
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    const selectedEvalDeadline = evaluationDeadlines[newValue];
    setSelectedEvaluationDeadline(selectedEvalDeadline);
    setSubject(`Reminder: ${selectedEvalDeadline?.name} Submission`);
    setMessage(
      `Dear Evaluator,\n\nThis is a reminder to submit your ${selectedEvalDeadline?.name} by the deadline.\n\nBest regards,\nAdmin`
    );
    setSelectedEvaluators([]);
  };

  const groupedEvaluators = useMemo(() => {
    const map = new Map<string, GroupedEvaluator>();

    filteredRelations.forEach((rel) => {
      const isAdviser = !!rel.fromUser;
      const isTeam = !!rel.fromProject;

      if (selectedEvaluationDeadline) {
        const type = selectedEvaluationDeadline.evaluatorType;
        const isApplicable =
          !type ||
          type === "Both" ||
          (type === "Team" && isTeam) ||
          (type === "Adviser" && isAdviser);

        if (!isApplicable) return;
      }

      const evaluatorId = isAdviser
        ? `user-${rel.fromUser?.id || "unknown"}`
        : `project-${rel.fromProject?.id || "unknown"}`;

      if (!map.has(evaluatorId)) {
        map.set(evaluatorId, {
          id: evaluatorId,
          realId: (isAdviser ? rel.fromUser?.id : rel.fromProject?.id) ?? "N/A",
          name:
            (isAdviser ? rel.fromUser?.name : rel.fromProject?.teamName) ||
            "Unknown Evaluator",
          projectName: isAdviser ? undefined : rel.fromProject?.name,
          type: isAdviser ? "Adviser" : "Team",
          emails: isAdviser
            ? rel.fromUser?.email
              ? [rel.fromUser.email]
              : []
            : rel.fromProject?.students?.map((s) => s.email) || [],
          members: isAdviser
            ? undefined
            : rel.fromProject?.students?.map((s) => s.name).join(", "),
          missingCount: 0,
        });
      }

      const existing = map.get(evaluatorId);
      if (existing) {
        existing.missingCount += 1;
      }
    });

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [filteredRelations, selectedEvaluationDeadline]);

  const handleSelectEvaluator = (evaluatorId: string) => {
    setSelectedEvaluators((prev) =>
      prev.includes(evaluatorId)
        ? prev.filter((id) => id !== evaluatorId)
        : [...prev, evaluatorId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEvaluators.length === groupedEvaluators.length) {
      setSelectedEvaluators([]);
    } else {
      setSelectedEvaluators(groupedEvaluators.map((ev) => ev.id));
    }
  };

  const sendReminders = async ({
    emails,
    ccs,
    subject,
    message,
  }: {
    emails: string[];
    ccs: string[];
    subject: string;
    message: string;
  }) => {
    const sendRemindersApiService = new ApiServiceBuilder({
      method: HTTP_METHOD.POST,
      endpoint: "/dashboard/administrator/send-reminders",
      body: { emails, ccs, subject, message },
    }).build();
    const sendReminderResponse = await sendRemindersApiService();

    if (!sendReminderResponse.ok) {
      const error = await sendReminderResponse.json();
      throw new Error(error.message ?? "Failed to send reminders");
    }
  };

  const handleSendReminders = async () => {
    if (!emailComposeStage) {
      setEmailComposeStage(true);
      return;
    }

    setSending(true);

    try {
      const selectedGroups = groupedEvaluators.filter((ev) =>
        selectedEvaluators.includes(ev.id)
      );

      const allEmails = selectedGroups
        .flatMap((ev) => ev.emails)
        .filter(Boolean);

      const uniqueEmails = Array.from(new Set(allEmails));

      const ccList = ccs
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const invalidCcs = ccList.filter((email) => !emailRegex.test(email));
      if (invalidCcs.length > 0) {
        setSnackbarMessage(
          `Invalid CC email address${
            invalidCcs.length > 1 ? "es" : ""
          }: ${invalidCcs.join(", ")}`
        );
        setSnackbarOpen(true);
        setSending(false);
        return;
      }

      await sendReminders({
        emails: uniqueEmails,
        ccs: ccList,
        subject,
        message,
      });

      setSnackbarMessage(
        `Successfully sent reminders to ${uniqueEmails.length} emails for ${
          selectedEvaluationDeadline?.name ?? "Evaluation"
        }`
      );
      setSnackbarOpen(true);

      setEmailComposeStage(false);
      setSelectedEvaluators([]);
      setOpen(false);
    } catch (error) {
      setSnackbarMessage(
        error instanceof Error ? error.message : "Failed to send reminders"
      );
      setSnackbarOpen(true);
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvaluators([]);
    setEmailComposeStage(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const memoQueryParams = useMemo(
    () => ({
      cohortYear: selectedCohortYear,
      deadlineId: selectedEvaluationDeadline?.id,
      dropped: "false",
      submissionStatus: SUBMISSION_STATUS.UNSUBMITTED,
      evaluatorTypeFilter: evaluatorTypeFilter,
    }),
    [selectedCohortYear, selectedEvaluationDeadline, evaluatorTypeFilter]
  );

  const { data: allTeamsEvaluations } =
    useFetch<GetAdministratorAllTeamMilestoneSubmissionsResponse>({
      endpoint: submissionsEndpoint,
      queryParams: memoQueryParams,
      requiresAuthorization: true,
    });

  useEffect(() => {
    if (allTeamsEvaluations) {
      setFilteredRelations(allTeamsEvaluations.submissions);
    }
  }, [allTeamsEvaluations]);

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{`Send ${deadlineLabel} Reminders`}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {emailComposeStage
              ? "Review and edit the email before sending"
              : `Select evaluators (Advisers or Teams) who have incomplete ${deadlineLabel.toLowerCase()} submissions to send them a reminder.`}
          </DialogContentText>

          {emailComposeStage ? (
            <EmailComposeView
              selectedTeamsCount={selectedEvaluators.length}
              recipientLabel="evaluators"
              ccs={ccs}
              setCcs={setCcs}
              subject={subject}
              setSubject={setSubject}
              message={message}
              setMessage={setMessage}
            />
          ) : (
            <>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tabIndex}
                  onChange={handleTabChange}
                  variant="fullWidth"
                >
                  {evaluationDeadlines.map((deadline, index) => (
                    <Tab
                      key={deadline.id}
                      value={index}
                      label={deadline.name}
                    />
                  ))}
                </Tabs>
              </Box>

              <TabPanel value={tabIndex} index={tabIndex}>
                <RemindersList
                  evaluators={groupedEvaluators}
                  selectedEvaluators={selectedEvaluators}
                  onSelectEvaluator={handleSelectEvaluator}
                  onSelectAll={handleSelectAll}
                  deadlineLabel={deadlineLabel}
                />
              </TabPanel>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {emailComposeStage ? (
            <>
              <Button onClick={() => setEmailComposeStage(false)}>Back</Button>
              <Button
                variant="contained"
                onClick={handleSendReminders}
                disabled={sending}
                startIcon={
                  sending ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <MailIcon />
                  )
                }
              >
                {sending ? "Sending..." : "Send Email"}
              </Button>
            </>
          ) : (
            <>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ flexGrow: 1 }}
              >
                {selectedEvaluators.length} evaluators selected
              </Typography>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleSendReminders}
                disabled={selectedEvaluators.length === 0}
                startIcon={<MailIcon />}
              >
                Continue to Email
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={
            snackbarMessage.toLowerCase().includes("success")
              ? "success"
              : "error"
          }
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

interface RemindersListProps {
  evaluators: GroupedEvaluator[];
  selectedEvaluators: string[];
  onSelectEvaluator: (id: string) => void;
  onSelectAll: () => void;
  deadlineLabel: string;
}

function RemindersList({
  evaluators,
  selectedEvaluators,
  onSelectEvaluator,
  onSelectAll,
  deadlineLabel,
}: RemindersListProps) {
  const allSelected =
    evaluators.length > 0 && selectedEvaluators.length === evaluators.length;

  if (evaluators.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
          textAlign: "center",
        }}
      >
        <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
        <Typography variant="h6" gutterBottom>
          {`All ${deadlineLabel.toLowerCase()} submissions have been submitted!`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          There are no evaluators that need reminders for this deadline.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper variant="outlined" sx={{ mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "action.hover",
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={allSelected}
              onChange={onSelectAll}
              indeterminate={
                selectedEvaluators.length > 0 &&
                selectedEvaluators.length < evaluators.length
              }
            />
          }
          label="Select All"
        />
        <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
          {evaluators.length} evaluators missing submissions
        </Typography>
      </Box>

      <List sx={{ maxHeight: 350, overflow: "auto" }}>
        {evaluators.map((evaluator) => {
          return (
            <ListItem
              key={evaluator.id}
              divider
              secondaryAction={<WarningIcon color="error" fontSize="small" />}
              sx={{
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <Checkbox
                edge="start"
                checked={selectedEvaluators.includes(evaluator.id)}
                onChange={() => onSelectEvaluator(evaluator.id)}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 0.5,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body1" fontWeight={600}>
                        {evaluator.name}
                      </Typography>
                      <Chip
                        label={evaluator.type}
                        size="small"
                        color={
                          evaluator.type === "Adviser" ? "secondary" : "primary"
                        }
                        sx={{ height: 20, fontSize: "0.7rem", fontWeight: 600 }}
                      />
                    </Box>
                    <Chip
                      label={`ID: ${evaluator.realId}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {evaluator.type === "Team" && evaluator.projectName && (
                      <Typography variant="body2" component="span">
                        Project: {evaluator.projectName}
                      </Typography>
                    )}

                    {evaluator.members && (
                      <Typography variant="body2" component="span">
                        {evaluator.members}
                      </Typography>
                    )}

                    <Typography variant="body2" component="span">
                      {evaluator.emails.length > 0
                        ? evaluator.emails.join(", ")
                        : "No email found"}
                    </Typography>

                    <Typography
                      variant="body2"
                      component="span"
                      sx={{ color: "error.main", fontWeight: 500, mt: 0.5 }}
                    >
                      {`Missing ${
                        evaluator.missingCount
                      } ${deadlineLabel.toLowerCase()} submission(s)`}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}

export default SendEvaluationReminderModal;
