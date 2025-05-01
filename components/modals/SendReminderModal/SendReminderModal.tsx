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
import EmailComposeView from "./EmailComposeView";
// Hooks
import useFetch from "@/hooks/useFetch";
// Types
import { PossibleSubmission, SUBMISSION_STATUS } from "@/types/submissions";
import {
  GetAdministratorAllTeamMilestoneSubmissionsResponse,
  HTTP_METHOD,
} from "@/types/api";
import { Deadline } from "@/types/deadlines";
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
      id={`milestone-tabpanel-${index}`}
      aria-labelledby={`milestone-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  milestoneDeadlines: Deadline[];
  selectedCohortYear: Cohort["academicYear"] | "";
}

const SendReminderModal: FC<Props> = ({
  open,
  setOpen,
  milestoneDeadlines,
  selectedCohortYear,
}) => {
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  const [selectedMilestoneDeadline, setSelectedMilestoneDeadline] =
    useState<Deadline>(milestoneDeadlines[0]);
  const [sending, setSending] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [filteredTeams, setFilteredTeams] = useState<PossibleSubmission[]>([]);

  const [emailComposeStage, setEmailComposeStage] = useState(false);
  const [ccs, setCcs] = useState<string>("");
  const [subject, setSubject] = useState<string>(
    `Reminder: ${selectedMilestoneDeadline?.name} Submission`
  );
  const [message, setMessage] = useState<string>(
    `Dear Team,\n\nThis is a reminder to submit your ${selectedMilestoneDeadline?.name} by the deadline.\n\nBest regards,\nAdmin`
  );

  const handleSelectedMilestoneDeadlineChange = (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    const selectedMSDeadline =
      newValue !== "0"
        ? (JSON.parse(newValue) as Deadline)
        : milestoneDeadlines[0];
    setSelectedMilestoneDeadline(selectedMSDeadline);
    setSubject(`Reminder: ${selectedMSDeadline?.name} Submission`);
    setMessage(
      `Dear Team,\n\nThis is a reminder to submit your ${selectedMSDeadline?.name} by the deadline.\n\nBest regards,\nAdmin`
    );
  };

  const handleSelectTeam = (teamId: number) => {
    setSelectedTeams((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTeams.length === filteredTeams.length) {
      setSelectedTeams([]);
    } else {
      setSelectedTeams(
        filteredTeams
          ?.map((team) => team.fromProject?.id)
          .filter((id): id is number => id !== undefined)
      );
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
    const sendRemindersdApiService = new ApiServiceBuilder({
      method: HTTP_METHOD.POST,
      endpoint: "/dashboard/administrator/send-reminders",
      body: { emails, ccs, subject, message },
    }).build();
    const sendReminderResponse = await sendRemindersdApiService();
    console.log(sendReminderResponse);

    if (!sendReminderResponse.ok) {
      const error = await sendReminderResponse.json();
      throw new Error(error.message ?? error);
    }
  };

  const handleSendReminders = async () => {
    if (!emailComposeStage) {
      // First stage: show email composition
      setEmailComposeStage(true);
      return;
    }

    // Second stage: actually send the emails
    setSending(true);

    try {
      // Get all selected teams' emails
      const selectedTeamDetails = filteredTeams.filter(
        (team) =>
          team.fromProject?.id && selectedTeams.includes(team.fromProject.id)
      );

      const emails = selectedTeamDetails.flatMap(
        (team) =>
          team.fromProject?.students.map((student) => student.email) || []
      );

      const ccList = ccs
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email);

      await sendReminders({
        emails,
        ccs: ccList,
        subject,
        message,
      });

      setSnackbarMessage(
        `Successfully sent reminders to ${selectedTeams.length} teams for ${
          selectedMilestoneDeadline?.name ?? "Milestone"
        }`
      );
      setSnackbarOpen(true);

      // Reset everything
      setEmailComposeStage(false);
      setSelectedTeams([]);
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
    setSelectedTeams([]);
    setEmailComposeStage(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const memoQueryParams = useMemo(
    () => ({
      cohortYear: selectedCohortYear,
      deadlineId: selectedMilestoneDeadline?.id,
      dropped: "false",
      submissionStatus: SUBMISSION_STATUS.UNSUBMITTED,
    }),
    [selectedCohortYear, selectedMilestoneDeadline]
  );
  const { data: allTeamsMilestones } =
    useFetch<GetAdministratorAllTeamMilestoneSubmissionsResponse>({
      endpoint: `/dashboard/administrator/team-submissions`,
      queryParams: memoQueryParams,
      requiresAuthorization: true,
    });

  useEffect(() => {
    if (allTeamsMilestones) {
      setFilteredTeams(
        allTeamsMilestones.submissions.sort((a, b) => {
          if (a.fromProject && b.fromProject) {
            return a.fromProject.id - b.fromProject.id;
          }
          return 0;
        })
      );
    }
  }, [allTeamsMilestones]);

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Send Milestone Reminders</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {emailComposeStage
              ? "Review and edit the email before sending"
              : "Select teams to send reminders for milestone submissions"}
          </DialogContentText>

          {emailComposeStage ? (
            <EmailComposeView
              selectedTeamsCount={selectedTeams.length}
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
                  value={JSON.stringify(selectedMilestoneDeadline)}
                  onChange={handleSelectedMilestoneDeadlineChange}
                  variant="fullWidth"
                >
                  {milestoneDeadlines.map((deadline) => (
                    <Tab
                      key={deadline.id}
                      value={JSON.stringify(deadline)}
                      label={deadline.name}
                    />
                  ))}
                </Tabs>
              </Box>

              <TabPanel key={1} value={1} index={1}>
                <RemindersList
                  teams={filteredTeams}
                  selectedTeams={selectedTeams}
                  onSelectTeam={handleSelectTeam}
                  onSelectAll={handleSelectAll}
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
                {selectedTeams.length} teams selected
              </Typography>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleSendReminders}
                disabled={selectedTeams.length === 0}
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
          severity="success"
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
  teams: PossibleSubmission[];
  selectedTeams: number[];
  onSelectTeam: (teamId: number) => void;
  onSelectAll: () => void;
}

function RemindersList({
  teams,
  selectedTeams,
  onSelectTeam,
  onSelectAll,
}: RemindersListProps) {
  const allSelected = teams.length > 0 && selectedTeams.length === teams.length;

  if (teams.length === 0) {
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
          All teams have submitted!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          There are no teams that need reminders for this milestone.
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
                selectedTeams.length > 0 && selectedTeams.length < teams.length
              }
            />
          }
          label="Select All"
        />
        <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
          {teams.length} teams not submitted
        </Typography>
      </Box>

      <List sx={{ maxHeight: 300, overflow: "auto" }}>
        {teams.map((team) => (
          <ListItem
            key={team.id}
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
              checked={
                team.fromProject?.id !== undefined &&
                selectedTeams.includes(team.fromProject?.id)
              }
              onChange={() =>
                team.fromProject?.id !== undefined &&
                onSelectTeam(team.fromProject?.id)
              }
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
                  }}
                >
                  <Typography variant="body1">
                    {team.fromProject?.teamName}
                  </Typography>
                  <Chip
                    label={`ID: ${team.fromProject?.id}`}
                    size="small"
                    variant="outlined"
                    sx={{ ml: 1 }}
                  />
                </Box>
              }
              secondary={
                <>
                  <Typography variant="body2" component="span">
                    Project: {team.fromProject?.name}
                  </Typography>
                  <br />
                  <Typography variant="body2" component="span">
                    {team.fromProject?.students
                      .map((student) => student.name)
                      .join(", ")}
                  </Typography>
                  <br />
                  <Typography variant="body2" component="span">
                    {team.fromProject?.students
                      .map((student) => student.email)
                      .join(", ")}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default SendReminderModal;
