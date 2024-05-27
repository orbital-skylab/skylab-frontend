import { Dispatch, FC, SetStateAction } from "react";
import { GetExternalVotersResponse } from "@/types/api";
import { Mutate } from "@/hooks/useFetch";
import Modal from "@/components/modals/Modal";
import { Button, Stack } from "@mui/material";

type Props = {
  voteEventId: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetExternalVotersResponse>;
};

const ExternalVoterGenerationModal: FC<Props> = ({
  //voteEventId,
  open,
  setOpen,
  //mutate,
}) => {
  const handleGenerate = () => {
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setOpen(false);
  };
  return (
    <Modal
      open={open}
      handleClose={handleCloseModal}
      title="Automatic Generation"
      subheader="Enter the amount of voter IDs you want to generate."
    >
      <Stack justifyContent="space-between" marginTop="0.5rem">
        <Button
          id="import-internal-voter-csv-button"
          size="small"
          variant="contained"
          onClick={handleGenerate}
        >
          Import
        </Button>
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
export default ExternalVoterGenerationModal;
