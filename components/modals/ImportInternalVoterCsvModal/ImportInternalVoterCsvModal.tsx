import Modal from "@/components/modals/Modal";
import { Mutate } from "@/hooks/useFetch";
import { GetInternalVotersResponse } from "@/types/api";
import { Button, Stack } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";

type Props = {
  voteEventId: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetInternalVotersResponse>;
};

const ImportInternalVoterCsvModal: FC<Props> = ({
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
      subheader="Import internal voters with a CSV file."
    >
      <Stack direction="row" justifyContent="space-between" marginTop="0.5rem">
        <Button
          id="import-internal-voter-csv-return-button"
          size="small"
          onClick={handleCloseModal}
        >
          Return
        </Button>
        <Button
          id="import-internal-voter-csv-button"
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
export default ImportInternalVoterCsvModal;
