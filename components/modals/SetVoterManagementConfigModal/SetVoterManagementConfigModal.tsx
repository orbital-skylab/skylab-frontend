import Modal from "@/components/modals/Modal";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import { CALL_STATUS, isCalling } from "@/hooks/useApiCall";
import { EditVoteEventResponse } from "@/types/api";
import { VoteEvent } from "@/types/voteEvents";
import { Button, Stack } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";

type Props = {
  open: boolean;
  processedValues: { voteEvent: VoteEvent };
  setOpen: Dispatch<SetStateAction<boolean>>;
  setOpenPrevious: Dispatch<SetStateAction<boolean>>;
  setVoterManagement: {
    status: CALL_STATUS;
    setEndpoint: (endpoint: string) => void;
    call: ({
      voteEvent,
    }: {
      voteEvent: VoteEvent;
    }) => Promise<EditVoteEventResponse>;
  };
};

const SetVoterManagementConfigModal: FC<Props> = ({
  open,
  processedValues,
  setOpen,
  setOpenPrevious,
  setVoterManagement,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const handleCloseModal = () => {
    setOpen(false);
    setOpenPrevious(true);
  };

  const handleConfirm = async () => {
    try {
      await setVoterManagement.call(processedValues);
      setSuccess("You have successfully edited the voter management config!");
      setOpen(false);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <Modal
      id="confirm-set-voter-management-config-modal"
      open={open}
      handleClose={handleCloseModal}
      title="Warning"
      subheader="All existing voters (if any) will be refreshed"
      sx={{ width: "400px" }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Button
          id="set-voter-management-config-modal-cancel-button"
          size="small"
          onClick={handleCloseModal}
          disabled={isCalling(setVoterManagement.status)}
        >
          Cancel
        </Button>
        <Button
          id="set-voter-management-config-modal-confirm-button"
          size="small"
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={isCalling(setVoterManagement.status)}
        >
          Confirm
        </Button>
      </Stack>
    </Modal>
  );
};
export default SetVoterManagementConfigModal;
