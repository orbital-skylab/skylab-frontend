import TextInput from "@/components/formikFormControllers/TextInput";
import useAuth from "@/contexts/useAuth";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import { ERRORS } from "@/helpers/errors";
import { LoadingButton } from "@mui/lab";
import { Box, Stack, Typography } from "@mui/material";
import { Formik } from "formik";
import { FC } from "react";
import * as Yup from "yup";

interface ExternalVoterSignInFormValuesType {
  voterId: string;
}

const ExternalVoterSignInForm: FC = () => {
  const { externalVoterSignIn } = useAuth();
  const { setSuccess, setError } = useSnackbarAlert();

  const initialValues = {
    voterId: "",
  };

  const handleSubmit = async (values: ExternalVoterSignInFormValuesType) => {
    const { voterId } = values;
    try {
      await externalVoterSignIn(voterId);
      setSuccess("You have signed in successfully!");
    } catch (error) {
      setError(error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={externalVoterSignInValidationSchema}
    >
      {(formik) => (
        <form id="sign-in-form" onSubmit={formik.handleSubmit}>
          <Stack gap="1rem" width="100%">
            <Box>
              <Typography variant="caption">
                Participating in voting?
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                Sign In With Your Voter ID
              </Typography>
            </Box>
            <TextInput
              label="Voter ID"
              id="sign-in-voter-id-input"
              type="text"
              name="voterId"
              formik={formik}
            />
            <LoadingButton
              id="sign-in-button"
              variant="contained"
              disabled={formik.isSubmitting}
              type="submit"
            >
              Sign In
            </LoadingButton>
          </Stack>
        </form>
      )}
    </Formik>
  );
};
export default ExternalVoterSignInForm;

const externalVoterSignInValidationSchema = Yup.object().shape({
  voterId: Yup.string().required(ERRORS.REQUIRED),
});
