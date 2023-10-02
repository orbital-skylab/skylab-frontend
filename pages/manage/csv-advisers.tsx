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
import BatchAddAdvisersForm, {
  ADD_ADVISERS_CSV_DESCRIPTION,
  ADD_ADVISERS_CSV_HEADERS,
  AddAdvisersData,
  processBatchAddAdvisersData,
} from "@/components/csvForms/BatchAddAdvisersForm";

const CsvAdvisers: NextPage = () => {
  const { setSuccess, setError } = useSnackbarAlert();

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
        setSuccess("Successfully added the advisers!");
      }
      handleClearAddAdvisers();
    } catch (error) {
      setError(error);
    }
  };

  const handleClearAddAdvisers = () => {
    setAddAdvisersData([]);
  };

  return (
    <Body authorizedRoles={[ROLES.ADMINISTRATORS]}>
      <AutoBreadcrumbs />
      <Stack direction="column" spacing="2rem">
        <Box>
          <Typography>
            For each row in the CSV file, a new adviser will be created by
            creating a new user and attaching an adviser role to it.
          </Typography>
          <BatchAddAdvisersForm
            addAdvisersData={addAdvisersData}
            setAddAdvisersData={setAddAdvisersData}
            handleAddAdvisers={handleAddAdvisers}
            handleClearAddAdvisers={handleClearAddAdvisers}
            isSubmitting={isCalling(batchAddAdvisers.status)}
          />
        </Box>
        <Box>
          <Typography fontSize="1.5rem" fontWeight="bold">
            Unsure of what to include in the CSV file?
          </Typography>
          <CsvPreviewCard
            templateFileTitle="advisers-template"
            csvTemplateHeaders={[Object.values(ADD_ADVISERS_CSV_HEADERS)]}
            csvTemplateDescription={ADD_ADVISERS_CSV_DESCRIPTION}
          />
        </Box>
      </Stack>
    </Body>
  );
};

export default CsvAdvisers;
