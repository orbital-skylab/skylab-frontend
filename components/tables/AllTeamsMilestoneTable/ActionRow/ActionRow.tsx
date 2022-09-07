import { FC, useState } from "react";
// Components
import { MenuItem, Stack, TextField } from "@mui/material";
import { CSVDownload } from "react-csv";
import { LoadingButton } from "@mui/lab";
// Hooks
import useCohort from "@/contexts/useCohort";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
// Helpers
import { ApiServiceBuilder } from "@/helpers/api";
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
import { mapData } from "./ActionRow.helpers";
// Types
import {
  GetAdministratorAllTeamMilestoneSubmissionsResponse,
  HTTP_METHOD,
} from "@/types/api";
import { Deadline } from "@/types/deadlines";
import { SUBMISSION_STATUS } from "@/types/submissions";

type Props = {
  selectedMilestoneDeadline: Deadline;
  handleSelectedMilestoneDeadlineChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  selectedSubmissionStatus: SUBMISSION_STATUS;
  handleSubmissionStatusChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  searchTextInput: string;
  handleSearchInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  milestoneDeadlines: Deadline[];
};

const ActionRow: FC<Props> = ({
  selectedMilestoneDeadline,
  handleSelectedMilestoneDeadlineChange,
  selectedSubmissionStatus,
  handleSubmissionStatusChange,
  searchTextInput,
  handleSearchInputChange,
  milestoneDeadlines,
}) => {
  const { currentCohortYear } = useCohort();
  const { setError } = useSnackbarAlert();
  const [isExporting, setIsExporting] = useState(false);
  const [csvData, setCsvData] = useState<Record<string, string | number>[]>([]);

  const exportCsv = async () => {
    setIsExporting(true);
    setCsvData([]);
    try {
      const fetchAllTeamsMilestones = new ApiServiceBuilder({
        method: HTTP_METHOD.GET,
        endpoint: `/dashboard/administrator/team-submissions`,
        queryParams: {
          cohortYear: currentCohortYear,
          deadlineId: selectedMilestoneDeadline.id,
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

      const mappedData = mapData(data.submissions, selectedMilestoneDeadline);
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
          label="Milestone"
          value={JSON.stringify(selectedMilestoneDeadline)}
          onChange={handleSelectedMilestoneDeadlineChange}
          select
        >
          {milestoneDeadlines &&
            milestoneDeadlines.map((deadline) => (
              <MenuItem key={deadline.id} value={JSON.stringify(deadline)}>
                {`${deadline.id}: ${deadline.name}`}
              </MenuItem>
            ))}
        </TextField>
        <TextField
          label="Submission Status"
          value={selectedSubmissionStatus}
          onChange={handleSubmissionStatusChange}
          select
          size="small"
          sx={{
            marginLeft: "auto",
          }}
        >
          {Object.values(SUBMISSION_STATUS).map((status) => (
            <MenuItem key={status} value={status}>
              {status.split("_").join(" ")}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <TextField
          label="Search"
          value={searchTextInput}
          onChange={handleSearchInputChange}
          size="small"
        />
        <LoadingButton
          variant="outlined"
          loading={isExporting}
          onClick={exportCsv}
        >
          Export CSV
        </LoadingButton>
        {csvData.length ? (
          <CSVDownload
            filename={`${
              selectedMilestoneDeadline.name
            } Submissions ${isoDateToLocaleDateWithTime(
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
export default ActionRow;
