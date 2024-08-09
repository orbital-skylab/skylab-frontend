import TextInput from "@/components/formikFormControllers/TextInput";
import Modal from "@/components/modals/Modal";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useApiCall from "@/hooks/useApiCall";
import { Mutate } from "@/hooks/useFetch";
import { GetExternalVotersResponse, HTTP_METHOD } from "@/types/api";
import { LoadingButton } from "@mui/lab";
import { Button, Stack } from "@mui/material";
import { Formik } from "formik";
import { Dispatch, FC, SetStateAction } from "react";
import * as Yup from "yup";

type GenerateVoterIdsFormValuesType = {
  voterIdAmount: string;
  voterIdLength: string;
};

type Props = {
  voteEventId: number;
  open: boolean;
  handleCloseMenu: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetExternalVotersResponse>;
};

const ExternalVoterGenerationModal: FC<Props> = ({
  voteEventId,
  open,
  handleCloseMenu,
  setOpen,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const generateVoterIds = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/vote-events/${voteEventId}/voter-management/external-voters/generate`,
    onSuccess: ({ externalVoters }: GetExternalVotersResponse) => {
      mutate(() => {
        return {
          externalVoters: externalVoters,
        };
      });
      setSuccess("Voter IDs generated successfully.");
    },
  });

  const initialValues = {
    voterIdAmount: "",
    voterIdLength: "",
  };

  const handleGenerate = async (values: GenerateVoterIdsFormValuesType) => {
    try {
      await generateVoterIds.call({
        amount: parseInt(values.voterIdAmount),
        length: parseInt(values.voterIdLength),
      });

      handleCloseMenu();
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
      open={open}
      handleClose={handleCloseModal}
      title="Generate Voter IDs"
      subheader="Enter the amount and length of the voter IDs you want to generate."
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleGenerate}
        validationSchema={generateVoterIdsFormValidationSchema}
      >
        {(formik) => (
          <>
            <Stack direction="column" spacing="1rem">
              <TextInput
                id="voter-id-amount-input"
                name="voterIdAmount"
                label="Amount of Voter IDs"
                size="small"
                formik={formik}
              />
              <TextInput
                id="voter-id-length-input"
                name="voterIdLength"
                label="Length of Voter IDs"
                size="small"
                formik={formik}
              />
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              marginTop="2rem"
            >
              <Button
                id="generate-voter-ids-return-button"
                size="small"
                onClick={handleCloseModal}
              >
                Return
              </Button>

              <LoadingButton
                id="generate-voter-ids-button"
                size="small"
                variant="contained"
                onClick={formik.submitForm}
                disabled={formik.isSubmitting}
                loading={formik.isSubmitting}
              >
                Generate
              </LoadingButton>
            </Stack>
          </>
        )}
      </Formik>
    </Modal>
  );
};
export default ExternalVoterGenerationModal;

const generateVoterIdsFormValidationSchema = Yup.object().shape({
  voterIdAmount: Yup.number()
    .required("Amount of voter IDs is required.")
    .min(1, "Amount of voter IDs must be at least 1.")
    .max(1000, "Amount of voter IDs cannot exceed 1000.")
    .integer("Amount of voter IDs must be an integer."),
  voterIdLength: Yup.number()
    .required("Length of voter IDs is required.")
    .min(1, "Length of voter IDs must be at least 5.")
    .max(20, "Length of voter IDs cannot exceed 20.")
    .integer("Length of voter IDs must be an integer."),
});
