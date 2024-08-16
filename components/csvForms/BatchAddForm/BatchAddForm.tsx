import {
  ChangeEvent,
  DragEvent,
  Dispatch,
  FC,
  SetStateAction,
  useState,
} from "react";
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
import { ACCEPTED_FILE_TYPES, checkValidity } from "@/helpers/batchForms";
// Hooks
import useAlert from "@/hooks/useAlert";
// Types
import { BASE_TRANSITION } from "@/styles/constants";
import { WithDescriptionExampleValidator } from "@/types/batchForms";
import BatchAddFormPreviewTable from "@/components/tables/BatchAddFormPreviewTable/BatchAddFormPreviewTable";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addData: Record<string, string | number>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setAddData: Dispatch<SetStateAction<Record<string, string | number>[]>>;
  handleAdd: () => void;
  handleClear: () => void;
  isSubmitting: boolean;
  headers: string[];
  description: WithDescriptionExampleValidator<string>;
};

const BatchAddForm: FC<Props> = ({
  addData,
  setAddData,
  handleAdd,
  handleClear,
  isSubmitting,
  headers,
  description,
}) => {
  const [isOver, setIsOver] = useState(false);
  const [fileDetails, setFileDetails] = useState<File | null>(null);
  const {
    alert: parseStatus,
    handleClose: resetParseStatus,
    setSuccess: setSuccessfulParseStatus,
    setError: setUnsuccessfulParseStatus,
  } = useAlert();

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(false);
    handleUpload(event.dataTransfer.files);
  };

  const handleUpload = (files: FileList | null) => {
    if (files && files.length) {
      const file = files[0];
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        setUnsuccessfulParseStatus("File must be a CSV file.");
        return;
      }
      setFileDetails(file);
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: function (results) {
          const { isValid, errorMessage } = checkValidity(
            results.data,
            Object.values(headers),
            description
          );

          if (!isValid) {
            setUnsuccessfulParseStatus(
              errorMessage ?? "An error has been encountered."
            );
          } else {
            setSuccessfulParseStatus(
              `${results.data.length} row${
                results.data.length !== 1 ? "s" : ""
              } successfully detected. Ready to add them?`
            );
            setAddData(results.data as Record<string, string | number>[]);
          }
        },
      });
    }

    // Ensures that users can reupload files
    const input: HTMLInputElement | null =
      document.querySelector(`#upload-csv-input`);
    if (input) {
      input.value = "";
    }
  };

  return (
    <>
      <Card>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <LoadingWrapper
            isLoading={isSubmitting}
            loadingText="Batch adding..."
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
                  <Alert
                    icon={false}
                    color={parseStatus.severity}
                    sx={{
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {parseStatus.message}
                  </Alert>
                ) : null}

                {/* Preview */}
                {parseStatus.severity === "success" &&
                addData &&
                addData.length ? (
                  <Box
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Typography fontWeight="bold">Preview data</Typography>
                    <Box
                      sx={{
                        overflow: "scroll",
                        maxHeight: "40rem",
                      }}
                    >
                      <BatchAddFormPreviewTable previewData={addData} />
                    </Box>
                  </Box>
                ) : null}

                {/* Follow up actions */}
                <Stack direction="column" spacing="0.5rem">
                  {parseStatus.severity === "success" ? (
                    <Button
                      id="upload-csv-button"
                      onClick={handleAdd}
                      variant="contained"
                    >
                      Add
                    </Button>
                  ) : null}
                  <Button
                    id="upload-csv-clear-button"
                    onClick={() => {
                      resetParseStatus();
                      handleClear();
                    }}
                    variant="outlined"
                  >
                    Upload Another File
                  </Button>
                </Stack>
              </Stack>
            ) : (
              <Box
                id="upload-csv-drag-area"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                component="label"
                sx={{
                  cursor: "pointer",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  transition: BASE_TRANSITION,
                  background: isOver ? "#d0d0d0" : "#f0f0f0",
                  outline: "1px gray dotted",
                  paddingY: "40px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <UploadFile sx={{ marginTop: "0.5rem", fontSize: "3.5rem" }} />
                <Typography fontSize="1.5rem" fontWeight="bold">
                  Drag and drop
                </Typography>

                <Typography fontWeight="bold">
                  your files here, or{" "}
                  <Box
                    sx={{
                      display: "inline",
                      color: "blue",
                      ":hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    browse
                  </Box>
                </Typography>
                <Input
                  id="upload-csv-input"
                  type="file"
                  inputProps={{
                    accept:
                      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
                  }}
                  value={null}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleUpload(e.target.files)
                  }
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
export default BatchAddForm;
