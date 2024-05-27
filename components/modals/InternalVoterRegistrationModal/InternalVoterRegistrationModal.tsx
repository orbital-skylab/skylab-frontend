import Modal from "@/components/modals/Modal";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import { Mutate } from "@/hooks/useFetch";
import {
  EditVoteEventResponse,
  GetVoteEventResponse,
  HTTP_METHOD,
} from "@/types/api";
import { AppRegistration, Close } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";

type Props = {
  voteEventId: number;
  isRegistrationOpen: boolean;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetVoteEventResponse>;
};

const InternalVoterRegistrationModal: FC<Props> = ({
  voteEventId,
  isRegistrationOpen,
  open,
  setOpen,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const toggleRegistration = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/vote-events/${voteEventId}`,
    onSuccess: ({ voteEvent }: EditVoteEventResponse) => {
      mutate(() => {
        return {
          voteEvent: {
            ...voteEvent,
          },
        };
      });
    },
  });

  const handleToggleRegistration = async () => {
    try {
      await toggleRegistration.call({
        voteEvent: {
          voterManagement: {
            isRegistrationOpen: !isRegistrationOpen,
          },
        },
      });
      setSuccess(
        `You have successfully ${
          isRegistrationOpen ? "closed" : "opened"
        } then registration!`
      );
    } catch (error) {
      setError(error);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      handleClose={handleCloseModal}
      title="Registration"
      subheader={
        isRegistrationOpen
          ? "Close the registration for the vote event."
          : "Open the registration which allows users to register themselves as an internal voter."
      }
    >
      <Stack direction="row" justifyContent="space-between" marginTop="0.5rem">
        <Button
          id="registration-return-button"
          size="small"
          onClick={handleCloseModal}
          disabled={isCalling(toggleRegistration.status)}
        >
          Return
        </Button>
        <Button
          id={`${isRegistrationOpen ? "close" : "open"}-registration-button`}
          size="small"
          variant="contained"
          onClick={handleToggleRegistration}
          disabled={isCalling(toggleRegistration.status)}
        >
          {isRegistrationOpen ? (
            <>
              <Close fontSize="small" sx={{ marginRight: "0.2rem" }} />
              Close Registration
            </>
          ) : (
            <>
              <AppRegistration
                fontSize="small"
                sx={{ marginRight: "0.2rem" }}
              />
              Open Registration
            </>
          )}
        </Button>
      </Stack>
    </Modal>
  );
};
export default InternalVoterRegistrationModal;
