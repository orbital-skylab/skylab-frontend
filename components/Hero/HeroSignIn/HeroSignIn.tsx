import TextInput from "@/components/FormControllers/TextInput";
import useAuth from "@/hooks/useAuth";
import { Box, Stack, Typography, Button, Alert, Snackbar } from "@mui/material";
import { Formik, FormikHelpers } from "formik";
import { FC, useState } from "react";

interface SignInFormValuesType {
  email: string;
  password: string;
}

const HeroSignIn: FC = () => {
  const { user, signIn } = useAuth();
  const [signInError, setSignInError] = useState("");
  const [hasSignedInSuccessfully, setHasSignedInSuccessfully] = useState(false);

  const initialValues: SignInFormValuesType = {
    email: "",
    password: "",
  };

  const handleSubmit = async (
    values: SignInFormValuesType,
    actions: FormikHelpers<SignInFormValuesType>
  ) => {
    const { email, password } = values;
    try {
      await signIn(email, password);
      setHasSignedInSuccessfully(true);
    } catch (error) {
      setSignInError(error instanceof Error ? error.message : String(error));
    }

    actions.setSubmitting(false);
  };

  const handleCloseSnackbar = () => {
    setSignInError("");
    setHasSignedInSuccessfully(false);
  };

  return (
    <>
      <Snackbar
        open={!!signInError}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error">{signInError}</Alert>
      </Snackbar>
      <Snackbar
        open={hasSignedInSuccessfully}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success">You have signed in successfully</Alert>
      </Snackbar>
      {!user ? (
        <Box sx={{ width: "100%" }}>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                <Stack gap="1rem" width="100%">
                  <Typography variant="h6" fontWeight={400} marginBottom="1rem">
                    Involved in Orbital? Sign in here
                  </Typography>
                  <TextInput
                    label="Email"
                    type="email"
                    name="email"
                    formik={formik}
                  />
                  <TextInput
                    label="Password"
                    type="password"
                    name="password"
                    formik={formik}
                  />
                  <Button
                    variant="contained"
                    disabled={formik.isSubmitting}
                    type="submit"
                  >
                    Sign In
                  </Button>
                </Stack>
              </form>
            )}
          </Formik>
        </Box>
      ) : null}
    </>
  );
};
export default HeroSignIn;
