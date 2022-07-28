import { useState } from "react";
// Components
import Body from "@/components/layout/Body";
import AutoBreadcrumbs from "@/components/layout/AutoBreadcrumbs";
import HeadingWithCsvTemplate from "@/components/csvForms/HeadingWithCsvTemplate/HeadingWithCsvTemplate";
import BatchAddTeamsAndStudentsForm, {
  AddTeamsAndStudentsData,
  ADD_TEAMS_AND_STUDENTS_CSV_HEADERS,
  processBatchStudentData,
} from "@/components/csvForms/BatchAddTeamsAndStudentsForm";
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

  /** Add Teams and Students Functions */
  const [addTeamsAndStudentsData, setAddTeamsAndStudentsData] =
    useState<AddTeamsAndStudentsData>([]);
  const batchAddTeamsAndStudents = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/students/batch`,
    requiresAuthorization: true,
  });

  const handleAddTeamsAndStudents = async () => {
    try {
      const processedValues = processBatchStudentData(addTeamsAndStudentsData);
      await batchAddTeamsAndStudents.call(processedValues);
      setSuccess("Successfully added the teams and students!");
      handleClearTeamsAndStudents();
    } catch (error) {
      setError(error);
    }
  };

  const handleClearTeamsAndStudents = () => {
    setAddTeamsAndStudentsData([]);
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

  return (
    <>
      <Body authorizedRoles={[ROLES.ADMINISTRATORS]}>
        <AutoBreadcrumbs />
        <Stack direction="column" spacing="2rem">
          <Box>
            <HeadingWithCsvTemplate
              title="Add Teams and Students"
              tooltipText="This creates new teams and new users with a student role attached to them"
              csvTemplateHeaders={[
                Object.values(ADD_TEAMS_AND_STUDENTS_CSV_HEADERS),
              ]}
            />
            <BatchAddTeamsAndStudentsForm
              setAddTeamsAndStudentsData={setAddTeamsAndStudentsData}
              handleAddTeamsAndStudents={handleAddTeamsAndStudents}
              handleClearTeamsAndStudents={handleClearTeamsAndStudents}
              isSubmitting={isCalling(batchAddTeamsAndStudents.status)}
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
