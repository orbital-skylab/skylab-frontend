import TextInput from "@/components/formikFormControllers/TextInput";
import Modal from "@/components/modals/Modal";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import { ERRORS } from "@/helpers/errors";
import useApiCall from "@/hooks/useApiCall";
import { Mutate } from "@/hooks/useFetch";
import {
  CreateCandidateResponse,
  GetCandidatesResponse,
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
  mutate: Mutate<GetCandidatesResponse>;
};

const AddCandidateModal: FC<Props> = ({
  voteEventId,
  open,
  handleCloseMenu,
  setOpen,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const addCandidate = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/vote-events/${voteEventId}/candidates`,
    onSuccess: ({ candidate }: CreateCandidateResponse) => {
      mutate((data) => {
        const newCandidates = [...data.candidates];
        newCandidates.push(candidate);
        return { candidates: newCandidates };
      });
    },
  });

  const initialValues = {
    projectId: "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await addCandidate.call({ projectId: values.projectId });
      setOpen(false);
      handleCloseMenu();
      setSuccess(
        `You have successfully added a candidate with id ${values.projectId}!`
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
      title="Add Candidate"
      subheader={`Enter the project ID of the project you want to add as a candidate.`}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={addCandidateValidationSchema}
      >
        {(formik) => (
          <>
            <TextInput
              id="project-id-input"
              name="projectId"
              label="Project ID"
              size="small"
              formik={formik}
            />
            <Stack
              direction="row"
              justifyContent="space-between"
              marginTop="0.5rem"
            >
              <Button
                id="add-candidate-return-button"
                size="small"
                onClick={handleCloseModal}
                disabled={formik.isSubmitting}
              >
                Return
              </Button>
              <Button
                id="add-candidate-button"
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
export default AddCandidateModal;

const addCandidateValidationSchema = Yup.object().shape({
  projectId: Yup.string().required(ERRORS.REQUIRED).matches(/^\d+$/, {
    message: "Project ID must be a number",
  }),
});
