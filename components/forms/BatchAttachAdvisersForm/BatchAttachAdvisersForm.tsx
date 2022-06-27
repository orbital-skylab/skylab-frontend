import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react";
// Components
import SnackbarAlert from "@/components/SnackbarAlert";
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
import { AdviserData } from "./BatchAttachAdvisersForm.types";

type Props = {
  adviserData: AdviserData;
  setAdviserData: Dispatch<SetStateAction<AdviserData>>;
  handleAttachAdvisers: () => void;
  handleClearAdvisers: () => void;
  isSubmitting: boolean;
};

const BatchAddStudentsForm: FC<Props> = ({
  adviserData,
  setAdviserData,
  handleAttachAdvisers,
  handleClearAdvisers,
  isSubmitting,
}) => {
  const [fileDetails, setFileDetails] = useState<File | null>(null);
  const { snackbar, handleClose, setError } = useSnackbarAlert();

  const handleUploadAdvisers = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      setFileDetails(e.target.files[0]);
      Papa.parse(e.target.files[0], {
        header: true,
        dynamicTyping: true,
        complete: function (results) {
          if (results.data.length) {
            setAdviserData(results.data as AdviserData);
          } else {
            setError("No advisers were detected. Please upload another file");
          }
        },
      });
    }
    const input: HTMLInputElement | null =
      document.querySelector(`#adviserUploadInput`);
    if (input) {
      input.value = "";
    }
  };

  return (
    <>
      <SnackbarAlert snackbar={snackbar} handleClose={handleClose} />
      <Card>
        <CardContent sx={{ display: "grid", placeItems: "center" }}>
          <LoadingWrapper
            isLoading={isSubmitting}
            loadingText="Adding students..."
          >
            {adviserData.length && fileDetails ? (
              <Stack
                direction="column"
                sx={{ height: "100%", width: "100%" }}
                alignItems="center"
                spacing="1rem"
              >
                <Stack direction="column" alignItems="center">
                  <Typography variant="h6" fontWeight="600">
                    {fileDetails.name}
                  </Typography>
                  <Typography variant="caption">
                    {fileDetails.size} bytes
                  </Typography>
                </Stack>
                <Alert color="success">{`${adviserData.length} Advisers${
                  adviserData.length !== 1 ? "s" : ""
                } Detected`}</Alert>
                <Stack direction="column" spacing="0.5rem">
                  <Button onClick={handleAttachAdvisers} variant="contained">
                    Add
                  </Button>
                  <Button onClick={handleClearAdvisers} variant="outlined">
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
export default BatchAddStudentsForm;
