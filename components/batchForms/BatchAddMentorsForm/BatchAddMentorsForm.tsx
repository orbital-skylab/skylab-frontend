import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react";
// Components
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import { UploadFile } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Box,
  Input,
  Alert,
} from "@mui/material";
// Helpers
import Papa from "papaparse";
import { checkHeadersMatch } from "@/helpers/batchForms";
// Hooks
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
// Types
import {
  ADD_MENTORS_CSV_HEADERS,
  AddMentorsData,
} from "./BatchAddMentorsForm.types";

type Props = {
  setAddMentorsData: Dispatch<SetStateAction<AddMentorsData>>;
  handleAddMentors: () => void;
  handleClearAddMentors: () => void;
  isSubmitting: boolean;
};

const BatchAddMentorsForm: FC<Props> = ({
  setAddMentorsData,
  handleAddMentors,
  handleClearAddMentors,
  isSubmitting,
}) => {
  const [fileDetails, setFileDetails] = useState<File | null>(null);
  const {
    snackbar: parseStatus,
    handleClose: resetParseStatus,
    setSuccess: setSuccessfulParseStatus,
    setError: setUnsuccessfulParseStatus,
  } = useSnackbarAlert();

  const handleUploadMentors = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      setFileDetails(e.target.files[0]);
      Papa.parse(e.target.files[0], {
        header: true,
        dynamicTyping: true,
        complete: function (results) {
          if (!results.data || !results.data.length) {
            setUnsuccessfulParseStatus(
              "No mentors were detected. Please upload another file."
            );
          } else if (
            !checkHeadersMatch(
              results.data,
              Object.values(ADD_MENTORS_CSV_HEADERS)
            )
          ) {
            setUnsuccessfulParseStatus(
              "The detected file does not follow the format of the provided Add Mentor CSV template. Please upload another file or try again."
            );
          } else {
            setSuccessfulParseStatus(
              `${results.data.length} mentor${
                results.data.length !== 1 ? "s" : ""
              } successfully detected. Ready to add them?`
            );
            setAddMentorsData(results.data as AddMentorsData);
          }
        },
      });
    }

    // Ensures that users can reupload files
    const input: HTMLInputElement | null = document.querySelector(
      `#addMentorsUploadInput`
    );
    if (input) {
      input.value = "";
    }
  };

  return (
    <>
      <Card>
        <CardContent sx={{ display: "grid", placeItems: "center" }}>
          <LoadingWrapper
            isLoading={isSubmitting}
            loadingText="Adding mentors..."
          >
            {!!parseStatus.message && fileDetails ? (
              <Stack
                direction="column"
                sx={{ height: "100%", width: "100%" }}
                alignItems="center"
                spacing="1rem"
              >
                {/* File name and size */}
                <Stack direction="column" alignItems="center">
                  <Typography variant="h6" fontWeight="600">
                    {fileDetails.name}
                  </Typography>
                  <Typography variant="caption">
                    {fileDetails.size} bytes
                  </Typography>
                </Stack>

                {/* Parse status message */}
                {parseStatus.message ? (
                  <Alert color={parseStatus.severity}>
                    {parseStatus.message}
                  </Alert>
                ) : null}

                {/* Follow up actions */}
                <Stack direction="column" spacing="0.5rem">
                  {parseStatus.severity === "success" ? (
                    <Button onClick={handleAddMentors} variant="contained">
                      Add
                    </Button>
                  ) : null}
                  <Button
                    onClick={() => {
                      resetParseStatus();
                      handleClearAddMentors();
                    }}
                    variant="outlined"
                  >
                    Upload Another File
                  </Button>
                </Stack>
              </Stack>
            ) : (
              <Box
                component="label"
                sx={{
                  cursor: "pointer",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  background: "#f0f0f0",
                  outline: "1px gray dotted",
                  paddingY: "40px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography>Upload a CSV spreadsheet</Typography>
                <UploadFile fontSize="large" sx={{ marginTop: "0.5rem" }} />
                <Input
                  id="addMentorsUploadInput"
                  type="file"
                  inputProps={{
                    accept:
                      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
                  }}
                  value={null}
                  onChange={handleUploadMentors}
                  sx={{ display: "none" }}
                />
              </Box>
            )}
          </LoadingWrapper>
        </CardContent>
      </Card>
    </>
  );
};
export default BatchAddMentorsForm;
