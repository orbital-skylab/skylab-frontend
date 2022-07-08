import { useState } from "react";
// Components
import Body from "@/components/layout/Body";
import AutoBreadcrumbs from "@/components/AutoBreadcrumbs";
import SnackbarAlert from "@/components/SnackbarAlert";
import HeadingWithCsvTemplate from "@/components/batchForms/HeadingWithCsvTemplate/HeadingWithCsvTemplate";
import BatchAddProjectsAndStudentsForm, {
  AddProjectsAndStudentsData,
  ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS,
  processBatchStudentData,
} from "@/components/batchForms/BatchAddProjectsAndStudentsForm";
import BatchAddAdvisersForm, {
  AddAdvisersData,
  ADD_ADVISERS_CSV_HEADERS,
  processBatchAddAdvisersData,
} from "@/components/batchForms/BatchAddAdvisersForm";
import BatchAddMentorsForm, {
  AddMentorsData,
  ADD_MENTORS_CSV_HEADERS,
  processBatchAddMentorsData,
} from "@/components/batchForms/BatchAddMentorsForm";
import BatchAttachAdvisersForm, {
  processBatchAdviserData,
  ATTACH_ADVISERS_CSV_HEADERS,
  AttachAdvisersData,
} from "@/components/batchForms/BatchAttachAdvisersForm";
import { Box, Stack } from "@mui/material";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import { isCalling } from "@/hooks/useApiCall/useApiCall.helpers";
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
// Types
import type { NextPage } from "next";
import { HTTP_METHOD } from "@/types/api";
import { ROLES } from "@/types/roles";

const BatchAdd: NextPage = () => {
  const { snackbar, handleClose, setSuccess, setError } = useSnackbarAlert();

  /** Add Projects and Students Functions */
  const [addProjectsAndStudentsData, setAddProjectsAndStudentsData] =
    useState<AddProjectsAndStudentsData>([]);
  const batchAddProjectsAndStudents = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/students/batch`,
    requiresAuthorization: true,
  });

  const handleAddProjectsAndStudents = async () => {
    try {
      const processedValues = processBatchStudentData(
        addProjectsAndStudentsData
      );
      await batchAddProjectsAndStudents.call(processedValues);
      setSuccess("Successfully added the projects and students!");
      handleClearProjectsAndStudents();
    } catch (error) {
      setError(error);
    }
  };

  const handleClearProjectsAndStudents = () => {
    setAddProjectsAndStudentsData([]);
  };

  /** Add Advisers Functions */
  const [addAdvisersData, setAddAdvisersData] = useState<AddAdvisersData>([]);
  const batchAddAdvisers = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/advisers/batch`,
    requiresAuthorization: true,
  });

  const handleAddAdvisers = async () => {
    try {
      const processedValues = processBatchAddAdvisersData(addAdvisersData);
      await batchAddAdvisers.call(processedValues);
      setSuccess("Successfully added the advisers!");
      handleClearAddAdvisers();
    } catch (error) {
      setError(error);
    }
  };

  const handleClearAddAdvisers = () => {
    setAddAdvisersData([]);
  };

  /** Add Mentors Functions */
  const [addMentorsData, setAddMentorsData] = useState<AddMentorsData>([]);
  const batchAddMentors = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/mentors/batch`,
    requiresAuthorization: true,
  });

  const handleAddMentors = async () => {
    try {
      const processedValues = processBatchAddMentorsData(addMentorsData);
      await batchAddMentors.call(processedValues);
      setSuccess("Successfully added the mentors!");
      handleClearAddMentors();
    } catch (error) {
      setError(error);
    }
  };

  const handleClearAddMentors = () => {
    setAddAdvisersData([]);
  };

  /** Attach Advisers Functions */
  const [attachAdvisersData, setAttachAdvisersData] =
    useState<AttachAdvisersData>([]);
  const batchAttachAdvisers = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/users/attach-adviser/batch`,
    requiresAuthorization: true,
  });

  const handleAttachAdvisers = async () => {
    try {
      const processedValues = processBatchAdviserData(attachAdvisersData);
      await batchAttachAdvisers.call(processedValues);
      setSuccess("Successfully attached the advisers!");
      handleClearAttachAdvisers();
    } catch (error) {
      setError(error);
    }
  };

  const handleClearAttachAdvisers = () => {
    setAttachAdvisersData([]);
  };

  return (
    <>
      <SnackbarAlert snackbar={snackbar} handleClose={handleClose} />
      <Body authorizedRoles={[ROLES.ADMINISTRATORS]}>
        <AutoBreadcrumbs />
        <Stack direction="column" spacing="2rem">
          <Box>
            <HeadingWithCsvTemplate
              title="Batch Add Projects and Students"
              tooltipText="This creates new projects and new users with a student role attached to them"
              csvTemplateHeaders={[
                Object.values(ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS),
              ]}
            />
            <BatchAddProjectsAndStudentsForm
              setAddProjectsAndStudentsData={setAddProjectsAndStudentsData}
              handleAddProjectsAndStudents={handleAddProjectsAndStudents}
              handleClearProjectsAndStudents={handleClearProjectsAndStudents}
              isSubmitting={isCalling(batchAddProjectsAndStudents.status)}
            />
          </Box>
          <Box>
            <HeadingWithCsvTemplate
              title="Batch Add Advisers"
              tooltipText="This creates new users with an adviser role attached to them"
              csvTemplateHeaders={[Object.values(ADD_ADVISERS_CSV_HEADERS)]}
            />
            <BatchAddAdvisersForm
              setAddAdvisersData={setAddAdvisersData}
              handleAddAdvisers={handleAddAdvisers}
              handleClearAddAdvisers={handleClearAddAdvisers}
              isSubmitting={isCalling(batchAddAdvisers.status)}
            />
          </Box>
          <Box>
            <HeadingWithCsvTemplate
              title="Batch Add Mentors"
              tooltipText="This creates new users with an mentor role attached to them"
              csvTemplateHeaders={[Object.values(ADD_MENTORS_CSV_HEADERS)]}
            />
            <BatchAddMentorsForm
              setAddMentorsData={setAddMentorsData}
              handleAddMentors={handleAddMentors}
              handleClearAddMentors={handleClearAddMentors}
              isSubmitting={isCalling(batchAddMentors.status)}
            />
          </Box>
          <Box>
            <HeadingWithCsvTemplate
              title="Batch Attach Advisers"
              tooltipText="This attaches an adviser role onto EXISTING users (with a past student role) via their NUSNET ID"
              csvTemplateHeaders={[Object.values(ATTACH_ADVISERS_CSV_HEADERS)]}
            />
            <BatchAttachAdvisersForm
              setAttachAdvisersData={setAttachAdvisersData}
              handleAttachAdvisers={handleAttachAdvisers}
              handleClearAttachAdvisers={handleClearAttachAdvisers}
              isSubmitting={isCalling(batchAttachAdvisers.status)}
            />
          </Box>
        </Stack>
      </Body>
    </>
  );
};
export default BatchAdd;
