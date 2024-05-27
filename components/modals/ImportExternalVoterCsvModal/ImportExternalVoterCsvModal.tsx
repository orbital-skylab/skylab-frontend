import Modal from "@/components/modals/Modal";
import { Mutate } from "@/hooks/useFetch";
import { GetExternalVotersResponse } from "@/types/api";
import { Button, Stack } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";

type Props = {
  voteEventId: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetExternalVotersResponse>;
};

const ImportExternalVoterCsvModal: FC<Props> = ({
  //voteEventId,
  open,
  setOpen,
  //mutate,
}) => {
  const handleImport = () => {
    handleCloseModal();
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
      <Stack direction="row" justifyContent="space-between" marginTop="0.5rem">
        <Button
          id="import-external-voter-csv-return-button"
          size="small"
          onClick={handleCloseModal}
        >
          Return
        </Button>
        <Button
          id="import-external-voter-csv-button"
          size="small"
          variant="contained"
          onClick={handleImport}
        >
          Import
        </Button>
      </Stack>
    </Modal>
  );
};
export default ImportExternalVoterCsvModal;
