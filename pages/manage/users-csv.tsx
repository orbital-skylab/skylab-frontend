import { useState } from "react";
// Components
import Body from "@/components/layout/Body";
import AutoBreadcrumbs from "@/components/layout/AutoBreadcrumbs";
import HeadingWithCsvTemplate from "@/components/csvForms/HeadingWithCsvTemplate/HeadingWithCsvTemplate";
import BatchAddProjectsAndStudentsForm, {
  AddProjectsAndStudentsData,
  ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS,
  processBatchStudentData,
} from "@/components/csvForms/BatchAddProjectsAndStudentsForm";
import BatchAddAdvisersForm, {
  AddAdvisersData,
  ADD_ADVISERS_CSV_HEADERS,
  processBatchAddAdvisersData,
} from "@/components/csvForms/BatchAddAdvisersForm";
import BatchAddMentorsForm, {
  AddMentorsData,
  ADD_MENTORS_CSV_HEADERS,
  processBatchAddMentorsData,
} from "@/components/csvForms/BatchAddMentorsForm";
import { Box, Stack } from "@mui/material";
// Hooks
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
// Types
import type { NextPage } from "next";
import { HTTP_METHOD } from "@/types/api";
import { ROLES } from "@/types/roles";

const CsvAdd: NextPage = () => {
  const { setSuccess, setError } = useSnackbarAlert();

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
      const { message } = await batchAddProjectsAndStudents.call(
        processedValues
      );
      if (message?.length > 0) {
        setError(`The following rows were not successfully added:\n${message}`);
      } else {
        setSuccess("Successfully added the projects and students!");
      }
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
      const { message } = await batchAddAdvisers.call(processedValues);
      if (message?.length > 0) {
        setError(`The following rows were not successfully added:\n${message}`);
      } else {
        setSuccess("Successfully added the projects and students!");
      }
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
      const { message } = await batchAddMentors.call(processedValues);
      if (message?.length > 0) {
        setError(`The following rows were not successfully added:\n${message}`);
      } else {
        setSuccess("Successfully added the projects and students!");
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleClearAddMentors = () => {
    setAddAdvisersData([]);
  };

  return (
    <>
      <Body authorizedRoles={[ROLES.ADMINISTRATORS]}>
        <AutoBreadcrumbs />
        <Stack direction="column" spacing="2rem">
          <Box>
            <HeadingWithCsvTemplate
              title="Add Projects and Students"
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
              title="Add Advisers"
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
              title="Add Mentors"
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
        </Stack>
      </Body>
    </>
  );
};
export default CsvAdd;
