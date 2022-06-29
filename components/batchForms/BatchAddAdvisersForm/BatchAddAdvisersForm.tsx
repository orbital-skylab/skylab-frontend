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
// Hooks
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
// Types
import {
  ADD_ADVISERS_CSV_HEADERS,
  AddAdvisersData,
} from "./BatchAddAdvisersForm.types";
import { checkHeadersMatch } from "../BatchAddStudentsForm";

type Props = {
  setAddAdvisersData: Dispatch<SetStateAction<AddAdvisersData>>;
  handleAddAdvisers: () => void;
  handleClearAddAdvisers: () => void;
  isSubmitting: boolean;
};

const BatchAddStudentsForm: FC<Props> = ({
  setAddAdvisersData,
  handleAddAdvisers,
  handleClearAddAdvisers,
  isSubmitting,
}) => {
  const [fileDetails, setFileDetails] = useState<File | null>(null);
  const {
    snackbar: parseStatus,
    handleClose: resetParseStatus,
    setSuccess: setSuccessfulParseStatus,
    setError: setUnsuccessfulParseStatus,
  } = useSnackbarAlert();

  const handleUploadStudents = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      setFileDetails(e.target.files[0]);
      Papa.parse(e.target.files[0], {
        header: true,
        dynamicTyping: true,
        complete: function (results) {
          if (!results.data || !results.data.length) {
            setUnsuccessfulParseStatus(
              "No advisers were detected. Please upload another file."
            );
          } else if (
            !checkHeadersMatch(
              results.data,
              Object.values(ADD_ADVISERS_CSV_HEADERS)
            )
          ) {
            setUnsuccessfulParseStatus(
              "The detected file does not follow the format of the provided Add Adviser CSV template. Please upload another file or try again."
            );
          } else {
            setSuccessfulParseStatus(
              `${results.data.length} adviser${
                results.data.length !== 1 ? "s" : ""
              } successfully detected. Ready to add them?`
            );
            setAddAdvisersData(results.data as AddAdvisersData);
          }
        },
      });
    }

    // Ensures that users can reupload files
    const input: HTMLInputElement | null = document.querySelector(
      `#addAdviserUploadInput`
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
            loadingText="Adding advisers..."
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
                    <Button onClick={handleAddAdvisers} variant="contained">
                      Add
                    </Button>
                  ) : null}
                  <Button
                    onClick={() => {
                      resetParseStatus();
                      handleClearAddAdvisers();
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
                  id="addAdviserUploadInput"
                  type="file"
                  inputProps={{
                    accept:
                      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
                  }}
                  value={null}
                  onChange={handleUploadStudents}
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
