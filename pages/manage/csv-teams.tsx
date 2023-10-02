import CsvPreviewCard from "@/components/csvForms/CsvPreviewCard";
import {
  ADD_PROJECTS_AND_STUDENTS_CSV_DESCRIPTION,
  ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS,
  AddProjectsAndStudentsData,
  processBatchStudentData,
} from "@/components/csvForms/BatchAddProjectsAndStudentsForm";
import BatchAddStudentsForm from "@/components/csvForms/BatchAddProjectsAndStudentsForm/BatchAddProjectsAndStudentsForm";
import AutoBreadcrumbs from "@/components/layout/AutoBreadcrumbs";
import Body from "@/components/layout/Body";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import { HTTP_METHOD } from "@/types/api";
import { ROLES } from "@/types/roles";
import { Box, Stack, Typography } from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";

const CsvTeams: NextPage = () => {
  const { setSuccess, setError } = useSnackbarAlert();

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

  return (
    <Body authorizedRoles={[ROLES.ADMINISTRATORS]}>
      <AutoBreadcrumbs />
      <Stack direction="column" spacing="2rem">
        <Box>
          <Typography>
            For each row in the CSV file, a new team as well as the students in
            the team will be created. The student is created by creating a new
            user and adding the student role to them.
          </Typography>
          <BatchAddStudentsForm
            setAddProjectsAndStudentsData={setAddProjectsAndStudentsData}
            handleAddProjectsAndStudents={handleAddProjectsAndStudents}
            handleClearProjectsAndStudents={handleClearProjectsAndStudents}
            isSubmitting={isCalling(batchAddProjectsAndStudents.status)}
          />
        </Box>
        <Box>
          <Typography fontSize="1.5rem" fontWeight="bold">
            Unsure of what to include in the CSV file?
          </Typography>
          <CsvPreviewCard
            templateFileTitle="teams-template"
            csvTemplateHeaders={[
              Object.values(ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS),
            ]}
            csvTemplateDescription={ADD_PROJECTS_AND_STUDENTS_CSV_DESCRIPTION}
          />
        </Box>
      </Stack>
    </Body>
  );
};

export default CsvTeams;
