import TextInput from "@/components/formikFormControllers/TextInput";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import { Mutate } from "@/hooks/useFetch";
import {
  CreateExternalVoterResponse,
  CreateInternalVoterResponse,
  EditVoteEventResponse,
  GetExternalVotersResponse,
  GetInternalVotersResponse,
  GetVoteEventResponse,
  HTTP_METHOD,
} from "@/types/api";
import { LIST_TYPES, VoterManagement } from "@/types/voteEvents";
import { AppRegistration, Close } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import { Formik } from "formik";
import { Dispatch, FC, SetStateAction } from "react";
import Modal from "../Modal";

type Props = {
  voterManagement: VoterManagement;
  selectedList: LIST_TYPES;
  isRegistrationOpen: boolean;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutateInternalVoters: Mutate<GetInternalVotersResponse> | null;
  mutateExternalVoters: Mutate<GetExternalVotersResponse> | null;
  mutate: Mutate<GetVoteEventResponse>;
};

type AddInternalExternalVoterFormValuesType = {
  string: string;
};

const AddVoterModal: FC<Props> = ({
  voterManagement,
  selectedList,
  isRegistrationOpen,
  open,
  setOpen,
  mutateInternalVoters,
  mutateExternalVoters,
  mutate,
}) => {
  const {
    voteEventId,
    registration,
    internalCsvImport,
    generation,
    externalCsvImport,
  } = voterManagement;
  const showRegistration =
    registration && selectedList === LIST_TYPES.INTERNAL_VOTERS;
  const showInternalCsvImport =
    internalCsvImport && selectedList === LIST_TYPES.INTERNAL_VOTERS;
  const showGeneration =
    generation && selectedList === LIST_TYPES.EXTERNAL_VOTERS;
  const showExternalCsvImport =
    externalCsvImport && selectedList === LIST_TYPES.EXTERNAL_VOTERS;
  const isInternalList = selectedList === LIST_TYPES.INTERNAL_VOTERS;
  const { setSuccess, setError } = useSnackbarAlert();

  const addInternalVoter = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/vote-events/${voteEventId}/voter-management/internal-voters`,
    onSuccess: ({ internalVoter }: CreateInternalVoterResponse) => {
      if (mutateInternalVoters === null) {
        return;
      }
      mutateInternalVoters((data) => {
        const newInternalVoters = [...data.internalVoters];
        newInternalVoters.push(internalVoter);
        return { internalVoters: newInternalVoters };
      });
    },
  });

  const addExternalVoter = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/vote-events/${voteEventId}/voter-management/external-voters`,
    onSuccess: ({ externalVoter }: CreateExternalVoterResponse) => {
      if (mutateExternalVoters === null) {
        return;
      }
      mutateExternalVoters((data) => {
        const newExternalVoters = [...data.externalVoters];
        newExternalVoters.push(externalVoter);
        return { externalVoters: newExternalVoters };
      });
    },
  });

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

  const initialValues: AddInternalExternalVoterFormValuesType = { string: "" };

  const handleSubmit = async (
    values: AddInternalExternalVoterFormValuesType
  ) => {
    try {
      if (isInternalList) {
        await addInternalVoter.call({ email: values.string });
      } else {
        await addExternalVoter.call({ voterId: values.string });
      }
      setSuccess(`You have successfully added the voter!`);
    } catch (error) {
      setError(error);
    }
  };

  const handleToggleRegistration = async () => {
    try {
      await toggleRegistration.call({
        voteEvent: {
          isRegistrationOpen: !isRegistrationOpen,
        },
      });
      setSuccess(
        `You have successfully ${
          isRegistrationOpen ? "closed" : "opened"
        } the registration!`
      );
    } catch (error) {
      setError(error);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleInternalCsvImport = () => {
    return;
  };

  const handleGenerateVotingId = () => {
    return;
  };

  const handleIExternalCsvImport = () => {
    return;
  };

  return (
    <Modal
      open={open}
      handleClose={handleCloseModal}
      title={`Add ${selectedList}`}
      subheader={`You are adding new ${selectedList} to the vote event.`}
    >
      <Stack direction="column" justifyContent="space-between" marginTop="1rem">
        {showRegistration && (
          <Button
            id={
              isRegistrationOpen
                ? "close-registration-button"
                : "open-registration-button"
            }
            size="small"
            variant="contained"
            onClick={handleToggleRegistration}
            color={isRegistrationOpen ? "error" : "success"}
            disabled={isCalling(toggleRegistration.status)}
          >
            {isRegistrationOpen ? (
              <>
                <AppRegistration
                  fontSize="small"
                  sx={{ marginRight: "0.2rem" }}
                />
                Close Registration
              </>
            ) : (
              <>
                <Close fontSize="small" sx={{ marginRight: "0.2rem" }} />
                Open Registration
              </>
            )}
          </Button>
        )}
        {showInternalCsvImport && (
          <Button
            id="import-internal-voters-button"
            size="small"
            variant="contained"
            onClick={handleInternalCsvImport}
          >
            Import Internal Voters
          </Button>
        )}
        {showGeneration && (
          <Button
            id="generate-external-voters-button"
            size="small"
            variant="contained"
            onClick={handleGenerateVotingId}
          >
            Generate External Voters
          </Button>
        )}
        {showExternalCsvImport && (
          <Button
            id="import-external-voters-button"
            size="small"
            variant="contained"
            onClick={handleIExternalCsvImport}
          >
            Import External Voters
          </Button>
        )}
      </Stack>
      <Typography variant="h6" sx={{ marginTop: "1rem" }}>
        Add {isInternalList ? "Voter by Email" : "Voter Id"}
      </Typography>

      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <Stack
            direction="row"
            justifyContent="space-between"
            marginTop="0.5rem"
          >
            <TextInput
              name="string"
              label={isInternalList ? "Email" : "Voter Id"}
              size="small"
              formik={formik}
            />
            <Button
              id={
                isInternalList
                  ? "add-internal-voter-button"
                  : "add-external-voter-button"
              }
              size="small"
              variant="contained"
              onClick={formik.submitForm}
              disabled={formik.isSubmitting}
            >
              Add
            </Button>
          </Stack>
        )}
      </Formik>

      <Stack direction="row" justifyContent="space-between" marginTop="2rem">
        <Button size="small" onClick={handleCloseModal}>
          Return
        </Button>
      </Stack>
    </Modal>
  );
};
export default AddVoterModal;
