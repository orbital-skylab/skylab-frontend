import BatchAddExternalVotersForm from "@/components/csvForms/BatchAddExternalVotersForm";
import {
  ADD_EXTERNAL_VOTERS_CSV_DESCRIPTION,
  processBatchAddExternalVotersData,
} from "@/components/csvForms/BatchAddExternalVotersForm/BatchAddExternalVotersForm.helper";
import {
  ADD_EXTERNAL_VOTERS_CSV_HEADERS,
  AddExternalVotersData,
} from "@/components/csvForms/BatchAddExternalVotersForm/BatchAddExternalVotersForm.types";
import CsvPreviewCard from "@/components/csvForms/CsvPreviewCard";
import Modal from "@/components/modals/Modal";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import { Mutate } from "@/hooks/useFetch";
import { GetExternalVotersResponse, HTTP_METHOD } from "@/types/api";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Dispatch, FC, SetStateAction, useState } from "react";

type Props = {
  voteEventId: number;
  open: boolean;
  handleCloseMenu: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetExternalVotersResponse>;
};

const ImportExternalVoterCsvModal: FC<Props> = ({
  voteEventId,
  open,
  handleCloseMenu,
  setOpen,
  mutate,
}) => {
  const [addExternalVotersData, setAddExternalVotersData] =
    useState<AddExternalVotersData>([]);

  const { setSuccess, setError } = useSnackbarAlert();
  const batchAddExternalVoters = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/vote-events/${voteEventId}/voter-management/external-voters/batch`,
    onSuccess: ({ externalVoters }: GetExternalVotersResponse) => {
      mutate(() => {
        const newExternalVoters = [...externalVoters];

        return { externalVoters: newExternalVoters };
      });
    },
  });

  const handleImport = async () => {
    try {
      const processedValues = processBatchAddExternalVotersData(
        addExternalVotersData
      );
      const { message } = await batchAddExternalVoters.call(processedValues);
      if (message?.length > 0) {
        setError(`The following rows were not successfully added:\n${message}`);
      } else {
        setSuccess("Successfully added the external voters!");
        handleCloseModal();
        handleCloseMenu();
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleClearImportData = () => {
    setAddExternalVotersData([]);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      handleClose={handleCloseModal}
      title="Import CSV"
      subheader="Import external voters with a CSV file."
    >
      <Stack direction="column" spacing="2rem">
        <Box>
          <Typography>
            For each row in the CSV file, a new external voter will be added to
            the vote event. Only the voter ID is required.
          </Typography>
          <BatchAddExternalVotersForm
            addExternalVotersData={addExternalVotersData}
            setAddExternalVotersData={setAddExternalVotersData}
            handleAddExternalVoters={handleImport}
            handleClearAddExternalVoters={handleClearImportData}
            isSubmitting={isCalling(batchAddExternalVoters.status)}
          />
        </Box>
        <Box>
          <Typography fontSize="1.5rem" fontWeight="bold">
            Unsure of what to include in the CSV file?
          </Typography>
          <CsvPreviewCard
            templateFileTitle="external-voters-template"
            csvTemplateHeaders={[
              Object.values(ADD_EXTERNAL_VOTERS_CSV_HEADERS),
            ]}
            csvTemplateDescription={ADD_EXTERNAL_VOTERS_CSV_DESCRIPTION}
          />
        </Box>
      </Stack>
      <Stack direction="row" justifyContent="space-between" marginTop="0.5rem">
        <Button
          id="import-external-voter-csv-return-button"
          size="small"
          onClick={handleCloseModal}
        >
          Return
        </Button>
      </Stack>
    </Modal>
  );
};
export default ImportExternalVoterCsvModal;
