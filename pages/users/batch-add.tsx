import { useState } from "react";
import { useRouter } from "next/router";
// Components
import Body from "@/components/layout/Body";
import SnackbarAlert from "@/components/SnackbarAlert";
import BatchAddStudentsForm, {
  ADD_STUDENT_CSV_HEADERS,
  processBatchStudentData,
  StudentData,
} from "@/components/batchForms/BatchAddStudentsForm";
import BatchAttachAdvisersForm, {
  AdviserData,
  processBatchAdviserData,
  ATTACH_ADVISER_CSV_HEADERS,
} from "@/components/batchForms/BatchAttachAdvisersForm";
import { Box, Button, Stack } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import { isCalling } from "@/hooks/useApiCall/useApiCall.helpers";
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
// Types
import type { NextPage } from "next";
import { HTTP_METHOD } from "@/types/api";
import HeadingWithCsvTemplate from "@/components/batchForms/HeadingWithCsvTemplate/HeadingWithCsvTemplate";

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
            <HeadingWithCsvTemplate
              title="Batch Add Projects and Students"
              tooltipText="This creates new projects and new users with a student role attached to them"
              csvTemplateHeaders={[Object.values(ADD_STUDENT_CSV_HEADERS)]}
            />
            <BatchAddStudentsForm
              setStudentData={setStudentData}
              handleAddStudents={handleAddStudents}
              handleClearStudents={handleClearStudents}
              isSubmitting={isCalling(batchAddStudents.status)}
            />
          </Box>
          <Box>
            <HeadingWithCsvTemplate
              title="Batch Add Advisers"
              tooltipText="This creates new users with an adviser role attached to them"
              csvTemplateHeaders={[Object.values(ADD_STUDENT_CSV_HEADERS)]}
            />
            <BatchAddStudentsForm
              setStudentData={setStudentData}
              handleAddStudents={handleAddStudents}
              handleClearStudents={handleClearStudents}
              isSubmitting={isCalling(batchAddStudents.status)}
            />
          </Box>
          <Box>
            <HeadingWithCsvTemplate
              title="Batch Attach Advisers"
              tooltipText="This attaches an adviser role onto EXISTING users (with a past student role) via their NUSNET ID"
              csvTemplateHeaders={[Object.values(ATTACH_ADVISER_CSV_HEADERS)]}
            />
            <BatchAttachAdvisersForm
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
