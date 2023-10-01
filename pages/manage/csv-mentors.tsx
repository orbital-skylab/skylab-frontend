import CsvPreviewCard from "@/components/csvForms/CsvPreviewCard";
import AutoBreadcrumbs from "@/components/layout/AutoBreadcrumbs";
import Body from "@/components/layout/Body";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import { HTTP_METHOD } from "@/types/api";
import { ROLES } from "@/types/roles";
import { Box, Stack, Typography } from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";
import BatchAddMentorsForm, {
  ADD_MENTORS_CSV_DESCRIPTION,
  ADD_MENTORS_CSV_HEADERS,
  AddMentorsData,
  processBatchAddMentorsData,
} from "@/components/csvForms/BatchAddMentorsForm";

const CsvAdvisers: NextPage = () => {
  const { setSuccess, setError } = useSnackbarAlert();

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
    setAddMentorsData([]);
  };

  return (
    <Body authorizedRoles={[ROLES.ADMINISTRATORS]}>
      <AutoBreadcrumbs />
      <Stack direction="column" spacing="2rem">
        <Box>
          <Typography>
            For each row in the CSV file, a new mentor will be created by
            creating a new user and attaching a mentor role to it.
          </Typography>
          <BatchAddMentorsForm
            setAddMentorsData={setAddMentorsData}
            handleAddMentors={handleAddMentors}
            handleClearAddMentors={handleClearAddMentors}
            isSubmitting={isCalling(batchAddMentors.status)}
          />
        </Box>
        <Box>
          <Typography fontSize="1.5rem" fontWeight="bold">
            Unsure of what to include in the CSV file?
          </Typography>
          <CsvPreviewCard
            templateFileTitle="mentors-template"
            csvTemplateHeaders={[Object.values(ADD_MENTORS_CSV_HEADERS)]}
            csvTemplateDescription={ADD_MENTORS_CSV_DESCRIPTION}
          />
        </Box>
      </Stack>
    </Body>
  );
};

export default CsvAdvisers;
