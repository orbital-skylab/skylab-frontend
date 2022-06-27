import { useState } from "react";
import { useRouter } from "next/router";
// Components
import Body from "@/components/layout/Body";
import SnackbarAlert from "@/components/SnackbarAlert";
import BatchAddStudentsForm, {
  HEADERS as STUDENT_CSV_HEADERS,
  processBatchStudentData,
  StudentData,
} from "@/components/forms/BatchAddStudentsForm";
import BatchAttachAdvisersForm, {
  HEADERS as ADVISER_CSV_HEADERS,
  AdviserData,
  processBatchAdviserData,
} from "@/components/forms/BatchAttachAdvisersForm";
import { Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import { ArrowBack, HelpOutline } from "@mui/icons-material";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import { isCalling } from "@/hooks/useApiCall/useApiCall.helpers";
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
// Helpers
import { CSVLink } from "react-csv";
// Types
import type { NextPage } from "next";
import { HTTP_METHOD } from "@/types/api";

const BatchAdd: NextPage = () => {
  const { snackbar, handleClose, setSuccess, setError } = useSnackbarAlert();
  const router = useRouter();
  const [studentData, setStudentData] = useState<StudentData>([]);
  const batchAddStudents = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/users/create-student/batch`,
    requiresAuthorization: true,
  });
  const [adviserData, setAdviserData] = useState<AdviserData>([]);
  const batchAttachAdvisers = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/users/attach-adviser/batch`,
    requiresAuthorization: true,
  });

  const handleAddStudents = async () => {
    try {
      const processedValues = processBatchStudentData(studentData);
      await batchAddStudents.call(processedValues);
      setSuccess("Successfully added the students!");
      handleClearStudents();
    } catch (error) {
      setError(error);
    }
  };

  const handleClearStudents = () => {
    setStudentData([]);
  };

  const handleAttachAdvisers = async () => {
    try {
      const processedValues = processBatchAdviserData(adviserData);
      await batchAttachAdvisers.call(processedValues);
      setSuccess("Successfully attached the advisers!");
      handleClearAdvisers();
    } catch (error) {
      setError(error);
    }
  };

  const handleClearAdvisers = () => {
    setAdviserData([]);
  };

  return (
    <>
      <SnackbarAlert snackbar={snackbar} handleClose={handleClose} />
      <Body>
        <Button
          color="primary"
          variant="outlined"
          sx={{ mb: "1rem" }}
          onClick={router.back}
        >
          <ArrowBack sx={{ mr: "0.25rem" }} />
          Back
        </Button>
        <Stack direction="column" spacing="2rem">
          <Box>
            <Stack
              direction="row"
              marginBottom="0.5rem"
              spacing="0.5rem"
              alignItems="center"
            >
              <Typography variant="h6">Batch Add Students</Typography>
              <Tooltip title="This creates new users with a student role attached to them">
                <HelpOutline fontSize="small" />
              </Tooltip>
              <CSVLink
                data={[Object.values(STUDENT_CSV_HEADERS)]}
                filename="skylab-add-students-csv-template"
                style={{ textDecoration: "none", marginLeft: "auto" }}
              >
                <Tooltip title="Download CSV Template">
                  <Button color="info">CSV Template</Button>
                </Tooltip>
              </CSVLink>
            </Stack>
            <BatchAddStudentsForm
              studentData={studentData}
              setStudentData={setStudentData}
              handleAddStudents={handleAddStudents}
              handleClearStudents={handleClearStudents}
              isSubmitting={isCalling(batchAddStudents.status)}
            />
          </Box>
          <Box>
            <Stack
              direction="row"
              marginBottom="0.5rem"
              alignItems="center"
              spacing="0.5rem"
            >
              <Typography variant="h6">Batch Attach Advisers</Typography>
              <Tooltip title="This attaches an adviser role onto EXISTING users (with a past student role) via their NUSNET ID">
                <HelpOutline fontSize="small" />
              </Tooltip>
              <CSVLink
                data={[Object.values(ADVISER_CSV_HEADERS)]}
                filename="skylab-attach-advisers-csv-template"
                style={{ textDecoration: "none", marginLeft: "auto" }}
              >
                <Tooltip title="Download CSV Template">
                  <Button color="info">CSV Template</Button>
                </Tooltip>
              </CSVLink>
            </Stack>
            <BatchAttachAdvisersForm
              adviserData={adviserData}
              setAdviserData={setAdviserData}
              handleAttachAdvisers={handleAttachAdvisers}
              handleClearAdvisers={handleClearAdvisers}
              isSubmitting={isCalling(batchAttachAdvisers.status)}
            />
          </Box>
        </Stack>
      </Body>
    </>
  );
};
export default BatchAdd;
