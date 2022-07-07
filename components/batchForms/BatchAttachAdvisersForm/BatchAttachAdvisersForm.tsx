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
import { checkValidity } from "@/helpers/batchForms";
// Hooks
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
// Types
import {
  AttachAdvisersData,
  ATTACH_ADVISERS_CSV_HEADERS,
} from "./BatchAttachAdvisersForm.types";

type Props = {
  setAttachAdvisersData: Dispatch<SetStateAction<AttachAdvisersData>>;
  handleAttachAdvisers: () => void;
  handleClearAttachAdvisers: () => void;
  isSubmitting: boolean;
};

const BatchAddAdvisersForm: FC<Props> = ({
  setAttachAdvisersData,
  handleAttachAdvisers,
  handleClearAttachAdvisers,
  isSubmitting,
}) => {
  const [fileDetails, setFileDetails] = useState<File | null>(null);
  const {
    snackbar: parseStatus,
    handleClose: resetParseStatus,
    setSuccess: setSuccessfulParseStatus,
    setError: setUnsuccessfulParseStatus,
  } = useSnackbarAlert();

  const handleUploadAdvisers = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      setFileDetails(e.target.files[0]);
      Papa.parse(e.target.files[0], {
        header: true,
        dynamicTyping: true,
        complete: function (results) {
          const { isValid, errorMessage } = checkValidity(
            results.data,
            Object.values(ATTACH_ADVISERS_CSV_HEADERS)
          );

          if (!isValid) {
            setUnsuccessfulParseStatus(
              errorMessage ?? "An error has been encountered."
            );
          } else {
            setSuccessfulParseStatus(
              `${results.data.length} NUSNET ID${
                results.data.length !== 1 ? "s" : ""
              } successfully detected. Ready to attach the adviser role to them?`
            );
            setAttachAdvisersData(results.data as AttachAdvisersData);
          }
        },
      });
    }

    // Ensures that users can reupload files
    const input: HTMLInputElement | null =
      document.querySelector(`#adviserUploadInput`);
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
            loadingText="Attaching advisers..."
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
                    <Button onClick={handleAttachAdvisers} variant="contained">
                      Add
                    </Button>
                  ) : null}
                  <Button
                    onClick={() => {
                      resetParseStatus();
                      handleClearAttachAdvisers();
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
                  id="adviserUploadInput"
                  type="file"
                  inputProps={{
                    accept:
                      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
                  }}
                  value={null}
                  onChange={handleUploadAdvisers}
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
export default BatchAddAdvisersForm;
