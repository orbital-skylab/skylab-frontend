import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import { Mutate } from "@/hooks/useFetch";
import {
  GetVoteEventResponse,
  GetVoteEventsResponse,
  HTTP_METHOD,
} from "@/types/api";
import { VoteEvent } from "@/types/voteEvents";
import { LoadingButton } from "@mui/lab";
import { Button, Stack } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";
import Modal from "../Modal";

type Props = {
  voteEvent: VoteEvent;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetVoteEventsResponse>;
};

const RegisterForVoteEventModal: FC<Props> = ({
  voteEvent,
  open,
  setOpen,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const registerUser = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/vote-events/${voteEvent.id}/register`,
    onSuccess: ({ voteEvent }: GetVoteEventResponse) => {
      mutate((data) => {
        const newVoteEvents = data.voteEvents.map((ve) =>
          ve.id === voteEvent.id ? voteEvent : ve
        );
        return { voteEvents: newVoteEvents };
      });
    },
  });

  const handleRegister = async () => {
    try {
      await registerUser.call();
      setSuccess(
        `You have successfully registered for the vote event: ${voteEvent.title}!`
      );
      handleCloseModal();
    } catch (error) {
      setError(error);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <Modal
      id="register-for-vote-event-modal"
      open={open}
      handleClose={handleCloseModal}
      title={`Register for Vote Event`}
      subheader={`Register for the vote event: ${voteEvent.title}.\n\nThis action is irreversible, are you sure?`}
    >
      <Stack spacing={2} direction="row" justifyContent="flex-end">
        <Button
          id="register-for-vote-event-cancel-button"
          size="small"
          onClick={handleCloseModal}
          disabled={isCalling(registerUser.status)}
        >
          Cancel
        </Button>
        <LoadingButton
          id="register-for-vote-event-confirm-button"
          size="small"
          onClick={handleRegister}
          variant="contained"
          color="primary"
          disabled={isCalling(registerUser.status)}
          loading={isCalling(registerUser.status)}
        >
          Register
        </LoadingButton>
      </Stack>
    </Modal>
  );
};
export default RegisterForVoteEventModal;
