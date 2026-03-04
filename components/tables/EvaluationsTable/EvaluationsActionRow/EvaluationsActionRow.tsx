import { FC, useState } from "react";
// Components
import {
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { CSVDownload } from "react-csv";
import { LoadingButton } from "@mui/lab";
import SearchIcon from "@mui/icons-material/Search";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import SendReminderModal from "@/components/modals/SendReminderModal";
// Hooks
import useCohort from "@/contexts/useCohort";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
// Helpers
import { ApiServiceBuilder } from "@/helpers/api";
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
import { mapData } from "./EvaluationsActionRow.helpers";
// Types
import {
  GetAdministratorAllTeamMilestoneSubmissionsResponse,
  HTTP_METHOD,
} from "@/types/api";
import { Deadline } from "@/types/deadlines";
import { SUBMISSION_STATUS } from "@/types/submissions";
import { Cohort } from "@/types/cohorts";

type Props = {
  selectedEvaluationsDeadline: Deadline | null;
  handleSelectedEvaluationsDeadlineChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  selectedSubmissionStatus: SUBMISSION_STATUS;
  handleSubmissionStatusChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  searchTextInput: string;
  handleSearchInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  evaluationsDeadlines: Deadline[];
  viewHasDropped: boolean;
  handleToggleViewDropped: () => void;
  selectedCohortYear: Cohort["academicYear"] | "";
  selectedEvaluatorType: string;
  handleEvaluatorTypeChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

const EvaluationsActionRow: FC<Props> = ({
  selectedEvaluationsDeadline,
  handleSelectedEvaluationsDeadlineChange,
  selectedSubmissionStatus,
  handleSubmissionStatusChange,
  searchTextInput,
  handleSearchInputChange,
  evaluationsDeadlines,
  viewHasDropped,
  handleToggleViewDropped,
  selectedCohortYear,
  selectedEvaluatorType,
  handleEvaluatorTypeChange,
}) => {
  const { currentCohortYear } = useCohort();
  const { setError } = useSnackbarAlert();
  const [isExporting, setIsExporting] = useState(false);
  const [csvData, setCsvData] = useState<Record<string, string | number>[]>([]);
  const [open, setOpen] = useState(false);

  const exportCsv = async () => {
    setIsExporting(true);
    setCsvData([]);
    try {
      const fetchAllTeamsMilestones = new ApiServiceBuilder({
        method: HTTP_METHOD.GET,
        endpoint: `/dashboard/administrator/evaluations`,
        queryParams: {
          cohortYear: currentCohortYear,
          deadlineId: selectedEvaluationsDeadline?.id,
          dropped: viewHasDropped,
          evaluatorTypeFilter: selectedEvaluatorType,
          ...(selectedSubmissionStatus === SUBMISSION_STATUS.ALL
            ? {}
            : { submissionStatus: selectedSubmissionStatus }),
        },
        requiresAuthorization: true,
      }).build();
      const res = await fetchAllTeamsMilestones();
      const data: GetAdministratorAllTeamMilestoneSubmissionsResponse =
        await res.json();

      if (!data || !data.submissions) {
        throw new Error("No team milestone submission data found");
      }
      const csvEvaluations = selectedEvaluationsDeadline
        ? [selectedEvaluationsDeadline]
        : evaluationsDeadlines;
      const mappedData = mapData(data.submissions, csvEvaluations);
      setCsvData(mappedData);
    } catch (error) {
      setError(error);
    }
    setIsExporting(false);
  };

  return (
    <Stack gap="0.5rem">
      <Stack direction="row" gap="0.5rem" alignItems="center">
        <TextField
          label="Evaluation"
          value={
            selectedEvaluationsDeadline
              ? JSON.stringify(selectedEvaluationsDeadline)
              : "0"
          }
          onChange={handleSelectedEvaluationsDeadlineChange}
          select
          size="small"
        >
          <MenuItem value={"0"}>All Evaluations</MenuItem>
          {evaluationsDeadlines &&
            evaluationsDeadlines.map((deadline) => (
              <MenuItem key={deadline.id} value={JSON.stringify(deadline)}>
                {`${deadline.id}: ${deadline.name}`}
              </MenuItem>
            ))}
        </TextField>
        <TextField
          label="Search Evaluator / Evaluatee Name"
          value={searchTextInput}
          onChange={handleSearchInputChange}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Evaluator Type"
          value={selectedEvaluatorType}
          onChange={handleEvaluatorTypeChange}
          select
          size="small"
        >
          <MenuItem value="All">All Evaluators</MenuItem>
          <MenuItem value="Team">Team</MenuItem>
          <MenuItem value="Adviser">Adviser</MenuItem>
        </TextField>

        {selectedEvaluationsDeadline && (
          <TextField
            label="Submission Status"
            value={selectedSubmissionStatus}
            onChange={handleSubmissionStatusChange}
            select
            size="small"
            sx={{
              width: "fit-content",
            }}
          >
            {Object.values(SUBMISSION_STATUS).map((status) => (
              <MenuItem key={status} value={status}>
                {status === "All"
                  ? "All Submissions"
                  : status.split("_").join(" ")}
              </MenuItem>
            ))}
          </TextField>
        )}

        <FormControlLabel
          id="dropped-projects-toggle"
          value={viewHasDropped}
          onClick={handleToggleViewDropped}
          control={<Switch color="secondary" size="small" />}
          label="View Dropped Teams"
          labelPlacement="end"
          sx={{
            marginLeft: "auto",
          }}
        />
        <LoadingButton
          variant="outlined"
          onClick={() => setOpen(true)}
          startIcon={<MailOutlineIcon />}
        >
          Send Reminders
        </LoadingButton>

        <SendReminderModal
          open={open}
          setOpen={setOpen}
          milestoneDeadlines={evaluationsDeadlines}
          selectedCohortYear={selectedCohortYear}
        />

        <LoadingButton
          variant="outlined"
          loading={isExporting}
          onClick={exportCsv}
          startIcon={<FileDownloadOutlinedIcon />}
        >
          Export CSV
        </LoadingButton>
        {csvData.length ? (
          <CSVDownload
            filename={`Submissions ${isoDateToLocaleDateWithTime(
              new Date().toISOString()
            )}`}
            data={csvData}
            target="_blank"
          />
        ) : null}
      </Stack>
    </Stack>
  );
};
export default EvaluationsActionRow;
