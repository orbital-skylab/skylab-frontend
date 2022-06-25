import Body from "@/components/layout/Body";
import TextInput from "@/components/formControllers/TextInput";
import { PAGES } from "@/helpers/navigation";
import useAuth from "@/hooks/useAuth";
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { Formik, FormikHelpers } from "formik";
import type { NextPage } from "next";
import Link from "next/link";
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
import SnackbarAlert from "@/components/SnackbarAlert";

interface SignUpFormValuesType {
  email: string;
}

const ForgotPassword: NextPage = () => {
  const { resetPassword } = useAuth();
  const { snackbar, handleClose, setError } = useSnackbarAlert();

  const initialValues: SignUpFormValuesType = {
    email: "",
  };

  const handleSubmit = async (
    values: SignUpFormValuesType,
    actions: FormikHelpers<SignUpFormValuesType>
  ) => {
    try {
      await resetPassword(values.email);
    } catch (error) {
      setError(error);
    }
    actions.setSubmitting(false);
  };

  return (
    <>
      <SnackbarAlert snackbar={snackbar} handleClose={handleClose} />
      <Body flexColCenter>
        <Container maxWidth="xs">
          <Stack gap="1rem" justifyContent="center">
            <Typography variant="h6" fontWeight={600}>
              Reset Password
            </Typography>
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {(formik) => (
                <form onSubmit={formik.handleSubmit}>
                  <Stack gap="1rem">
                    <TextInput
                      label="Email"
                      name="email"
                      type="email"
                      formik={formik}
                    />
                    <Button
                      variant="contained"
                      disabled={formik.isSubmitting}
                      type="submit"
                    >
                      Reset Password
                    </Button>
                  </Stack>
                </form>
              )}
            </Formik>
            <Divider />
            <Box>
              <Typography textAlign="left" variant="subtitle2" fontWeight={600}>
                Already have an account?
              </Typography>
              <Link href={PAGES.LANDING} passHref>
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
                  Sign In
                </Typography>
              </Link>
            </Box>
          </Stack>
        </Container>
      </Body>
    </>
  );
};
export default ForgotPassword;
