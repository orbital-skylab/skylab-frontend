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
  ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS,
  AddProjectsAndStudentsData,
} from "./BatchAddProjectsAndStudentsForm.types";

type Props = {
  setAddProjectsAndStudentsData: Dispatch<
    SetStateAction<AddProjectsAndStudentsData>
  >;
  handleAddProjectsAndStudents: () => void;
  handleClearProjectsAndStudents: () => void;
  isSubmitting: boolean;
};

const BatchAddStudentsForm: FC<Props> = ({
  setAddProjectsAndStudentsData,
  handleAddProjectsAndStudents,
  handleClearProjectsAndStudents,
  isSubmitting,
}) => {
  const [fileDetails, setFileDetails] = useState<File | null>(null);
  const {
    snackbar: parseStatus,
    handleClose: resetParseStatus,
    setSuccess: setSuccessfulParseStatus,
    setError: setUnsuccessfulParseStatus,
  } = useSnackbarAlert();

  const handleUploadProjectsAndStudents = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length) {
      setFileDetails(e.target.files[0]);
      Papa.parse(e.target.files[0], {
        header: true,
        dynamicTyping: true,
        complete: function (results) {
          if (!results.data || !results.data.length) {
            setUnsuccessfulParseStatus(
              "No projects or students were detected. Please upload another file."
            );
          } else if (
            !checkHeadersMatch(
              results.data,
              Object.values(ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS)
            )
          ) {
            setUnsuccessfulParseStatus(
              "The detected file does not follow the format of the provided Add Projects And Student CSV template. Please upload another file or try again."
            );
          } else {
            setSuccessfulParseStatus(
              `${results.data.length} project${
                results.data.length !== 1 ? "s" : ""
              } successfully detected. Ready to add them?`
            );
            setAddProjectsAndStudentsData(
              results.data as AddProjectsAndStudentsData
            );
          }
        },
      });
    }

    // Ensures that users can reupload files
    const input: HTMLInputElement | null =
      document.querySelector(`#studentUploadInput`);
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
            loadingText="Adding projects and students..."
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
                    <Button
                      onClick={handleAddProjectsAndStudents}
                      variant="contained"
                    >
                      Add
                    </Button>
                  ) : null}
                  <Button
                    onClick={() => {
                      resetParseStatus();
                      handleClearProjectsAndStudents();
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
                  id="studentUploadInput"
                  type="file"
                  inputProps={{
                    accept:
                      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
                  }}
                  value={null}
                  onChange={handleUploadProjectsAndStudents}
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
export default BatchAddStudentsForm;
