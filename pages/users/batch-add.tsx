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
import { Button, Stack, Tooltip, Typography } from "@mui/material";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import { isCalling } from "@/hooks/useApiCall/useApiCall.helpers";
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
// Helpers
import { CSVLink } from "react-csv";
// Types
import type { NextPage } from "next";
import { HTTP_METHOD } from "@/types/api";
import { ArrowBack } from "@mui/icons-material";

const BatchAdd: NextPage = () => {
  const { snackbar, handleClose, setSuccess, setError } = useSnackbarAlert();
  const router = useRouter();
  const [studentData, setStudentData] = useState<StudentData>([]);
  const batchAddStudents = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/users/create-student/batch`,
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
        <Stack
          direction="row"
          justifyContent="space-between"
          marginBottom="0.5rem"
        >
          <Typography variant="h6" mb="0.5rem">
            Batch Add Students
          </Typography>
          <CSVLink
            data={[Object.values(STUDENT_CSV_HEADERS)]}
            filename="skylab-student-csv-template"
            style={{ textDecoration: "none" }}
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
      </Body>
    </>
  );
};
export default BatchAdd;
