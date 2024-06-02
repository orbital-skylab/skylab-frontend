import TextInput from "@/components/formikFormControllers/TextInput";
import Modal from "@/components/modals/Modal";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import { ERRORS } from "@/helpers/errors";
import useApiCall from "@/hooks/useApiCall";
import { Mutate } from "@/hooks/useFetch";
import {
  CreateExternalVoterResponse,
  GetExternalVotersResponse,
  HTTP_METHOD,
} from "@/types/api";
import { Button, Stack } from "@mui/material";
import { Formik } from "formik";
import { Dispatch, FC, SetStateAction } from "react";
import * as Yup from "yup";

type Props = {
  voteEventId: number;
  open: boolean;
  handleCloseMenu: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetExternalVotersResponse>;
};

const AddExternalVoterModal: FC<Props> = ({
  voteEventId,
  open,
  handleCloseMenu,
  setOpen,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const addExternalVoter = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/vote-events/${voteEventId}/voter-management/external-voters`,
    onSuccess: ({ externalVoter }: CreateExternalVoterResponse) => {
      mutate((data) => {
        const newExternalVoters = [...data.externalVoters];
        newExternalVoters.push(externalVoter);
        return { externalVoters: newExternalVoters };
      });
    },
  });

  const initialValues = {
    voterId: "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await addExternalVoter.call({ voterId: values.voterId });
      setOpen(false);
      handleCloseMenu();
      setSuccess("You have successfully added an external voter!");
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
      title="Add Voter ID"
      subheader="Enter the voter ID of the external voter you want to add."
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={addExternalVoterValidationSchema}
      >
        {(formik) => (
          <>
            <TextInput
              id="voterId-input"
              name="voterId"
              label="Voter ID"
              size="small"
              formik={formik}
            />
            <Stack
              direction="row"
              justifyContent="space-between"
              marginTop="0.5rem"
            >
              <Button
                id="add-external-voter-return-button"
                size="small"
                onClick={handleCloseModal}
                disabled={formik.isSubmitting}
              >
                Return
              </Button>
              <Button
                id="add-external-voter-button"
                size="small"
                variant="contained"
                onClick={formik.submitForm}
                disabled={formik.isSubmitting}
              >
                Add
              </Button>
            </Stack>
          </>
        )}
      </Formik>
    </Modal>
  );
};
export default AddExternalVoterModal;

const addExternalVoterValidationSchema = Yup.object().shape({
  voterId: Yup.string().required(ERRORS.REQUIRED),
});
