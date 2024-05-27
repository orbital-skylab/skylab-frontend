import TextInput from "@/components/formikFormControllers/TextInput";
import Modal from "@/components/modals/Modal";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useApiCall from "@/hooks/useApiCall";
import { Mutate } from "@/hooks/useFetch";
import {
  CreateInternalVoterResponse,
  GetInternalVotersResponse,
  HTTP_METHOD,
} from "@/types/api";
import { Button, Stack } from "@mui/material";
import { Formik } from "formik";
import { Dispatch, FC, SetStateAction } from "react";

type Props = {
  voteEventId: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetInternalVotersResponse>;
};

const AddInternalVoterModal: FC<Props> = ({
  voteEventId,
  open,
  setOpen,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const addInternalVoter = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/vote-events/${voteEventId}/voter-management/internal-voters`,
    onSuccess: ({ internalVoter }: CreateInternalVoterResponse) => {
      mutate((data) => {
        const newInternalVoters = [...data.internalVoters];
        newInternalVoters.push(internalVoter);
        return { internalVoters: newInternalVoters };
      });
    },
  });

  const initialValues = {
    email: "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await addInternalVoter.call({ email: values.email });
      setOpen(false);
      setSuccess("You have successfully added an internal voter!");
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
      title="Add By Email"
      subheader={`Enter an email to add the following user as an internal voter.`}
    >
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <>
            <TextInput
              name="email"
              label="Email"
              size="small"
              formik={formik}
            />
            <Stack
              direction="row"
              justifyContent="space-between"
              marginTop="0.5rem"
            >
              <Button
                id="add-internal-voter-return-button"
                size="small"
                onClick={handleCloseModal}
                disabled={formik.isSubmitting}
              >
                Return
              </Button>
              <Button
                id="add-internal-voter-button"
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
export default AddInternalVoterModal;
