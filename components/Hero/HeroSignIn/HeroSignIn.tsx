import TextInput from "@/components/formControllers/TextInput";
import SnackbarAlert from "@/components/SnackbarAlert/SnackbarAlert";
import { PAGES } from "@/helpers/navigation";
import useAuth from "@/hooks/useAuth";
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
import { Box, Stack, Typography, Button } from "@mui/material";
import { Formik, FormikHelpers } from "formik";
import Link from "next/link";
import { FC } from "react";

export const LANDING_SIGN_IN_ID = "landingSignIn";

interface SignInFormValuesType {
  email: string;
  password: string;
}

const HeroSignIn: FC = () => {
  const { user, signIn } = useAuth();
  const { snackbar, setSuccess, setError, handleClose } = useSnackbarAlert();

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
      setSuccess("You have signed in successfully!");
    } catch (error) {
      setError(error);
    }

    actions.setSubmitting(false);
  };

  return (
    <>
      <SnackbarAlert snackbar={snackbar} handleClose={handleClose} />
      {!user ? (
        <Box sx={{ width: "100%" }} id={LANDING_SIGN_IN_ID}>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                <Stack gap="1rem" width="100%">
                  <Box>
                    <Typography variant="caption" fontWeight={400}>
                      Involved in Orbital?
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      Sign In Here!
                    </Typography>
                  </Box>
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
                  <Link href={PAGES.FORGOT_PASSWORD} passHref>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        "&:hover": {
                          color: "secondary.main",
                          textDecoration: "underline",
                          cursor: "pointer",
                          transitionDuration: "150ms",
                        },
                      }}
                    >
                      Forgot your password?
                    </Typography>
                  </Link>
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
