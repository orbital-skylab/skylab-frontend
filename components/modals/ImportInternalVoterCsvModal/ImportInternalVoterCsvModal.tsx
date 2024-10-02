import BatchAddInternalVotersForm from "@/components/csvForms/BatchAddInternalVotersForm";
import {
  ADD_INTERNAL_VOTERS_CSV_DESCRIPTION,
  processBatchAddInternalVotersData,
} from "@/components/csvForms/BatchAddInternalVotersForm/BatchAddInternalVotersForm.helper";
import {
  ADD_INTERNAL_VOTERS_CSV_HEADERS,
  AddInternalVotersData,
} from "@/components/csvForms/BatchAddInternalVotersForm/BatchAddInternalVotersForm.types";
import CsvPreviewCard from "@/components/csvForms/CsvPreviewCard";
import Modal from "@/components/modals/Modal";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import { Mutate } from "@/hooks/useFetch";
import { GetInternalVotersResponse, HTTP_METHOD } from "@/types/api";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Dispatch, FC, SetStateAction, useState } from "react";

type Props = {
  voteEventId: number;
  open: boolean;
  handleCloseMenu: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetInternalVotersResponse>;
};

const ImportInternalVoterCsvModal: FC<Props> = ({
  voteEventId,
  open,
  handleCloseMenu,
  setOpen,
  mutate,
}) => {
  const [addInternalVotersData, setAddInternalVotersData] =
    useState<AddInternalVotersData>([]);

  const { setSuccess, setError } = useSnackbarAlert();
  const batchAddInternalVoters = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/vote-events/${voteEventId}/voter-management/internal-voters/batch`,
    onSuccess: ({ internalVoters }: GetInternalVotersResponse) => {
      mutate(() => {
        const newInternalVoters = [...internalVoters];

        return { internalVoters: newInternalVoters };
      });
    },
  });

  const handleImport = async () => {
    try {
      const processedValues = processBatchAddInternalVotersData(
        addInternalVotersData
      );
      await batchAddInternalVoters.call(processedValues);
      setSuccess("Successfully added the internal voters!");
      handleCloseModal();
    } catch (error) {
      setError(error);
    }
  };

  const handleClearImportData = () => {
    setAddInternalVotersData([]);
  };

  const handleCloseModal = () => {
    handleCloseMenu();
    setOpen(false);
  };

  return (
    <Modal
      id="import-internal-voter-csv-modal"
      open={open}
      handleClose={handleCloseModal}
      title="Import CSV"
      subheader="Import internal voters with a CSV file."
    >
      <Stack direction="column" spacing="2rem">
        <Box>
          <Typography>
            For each row in the CSV file, a new internal voter will be added to
            the vote event. Only the email is required.
          </Typography>
          <BatchAddInternalVotersForm
            addInternalVotersData={addInternalVotersData}
            setAddInternalVotersData={setAddInternalVotersData}
            handleAddInternalVoters={handleImport}
            handleClearAddInternalVoters={handleClearImportData}
            isSubmitting={isCalling(batchAddInternalVoters.status)}
          />
        </Box>
        <Box>
          <Typography fontWeight="bold">
            Unsure of what to include in the CSV file?
          </Typography>
          <CsvPreviewCard
            templateFileTitle="internal-voters-template"
            csvTemplateHeaders={[
              Object.values(ADD_INTERNAL_VOTERS_CSV_HEADERS),
            ]}
            csvTemplateDescription={ADD_INTERNAL_VOTERS_CSV_DESCRIPTION}
          />
        </Box>
      </Stack>
      <Stack direction="row" justifyContent="left" marginTop="0.5rem">
        <Button
          id="import-internal-voter-csv-return-button"
          size="small"
          onClick={handleCloseModal}
        >
          Return
        </Button>
      </Stack>
    </Modal>
  );
};
export default ImportInternalVoterCsvModal;
