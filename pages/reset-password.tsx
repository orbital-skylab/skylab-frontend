import type { NextPage } from "next";
import Link from "next/link";
// Components
import Body from "@/components/layout/Body";
import TextInput from "@/components/formikFormControllers/TextInput";
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import CustomHead from "@/components/layout/CustomHead";
// Helpers
import { PAGES } from "@/helpers/navigation";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { ERRORS } from "@/helpers/errors";
// Hooks
import useAuth from "@/contexts/useAuth";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";

interface SignUpFormValuesType {
  email: string;
}

const ResetPassword: NextPage = () => {
  const { resetPassword } = useAuth();
  const { setSuccess, setError } = useSnackbarAlert();

  const initialValues: SignUpFormValuesType = {
    email: "",
  };

  const handleSubmit = async (
    values: SignUpFormValuesType,
    helpers: FormikHelpers<SignUpFormValuesType>
  ) => {
    try {
      if (!window.location.origin) {
        throw new Error("Cannot fetch the page origin");
      }
      await resetPassword({
        email: values.email,
        origin: window.location.origin,
      });
      setSuccess(
        "Successfully reset password! You should be receiving an email with a link soon!"
      );
      helpers.resetForm();
    } catch (error) {
      setError(error);
    }
  };

  return (
    <>
      <CustomHead
        title="Reset Password"
        description="Forgot your password? Reset your password using your email here!"
      />
      <Body sx={{ display: "grid", placeItems: "center" }}>
        <Container maxWidth="xs">
          <Stack gap="1rem" justifyContent="center">
            <Typography variant="h6" fontWeight={600}>
              Reset Password
            </Typography>
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={resetPasswordValidationSchema}
            >
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
export default ResetPassword;

const resetPasswordValidationSchema = Yup.object().shape({
  email: Yup.string().email(ERRORS.INVALID_EMAIL).required(ERRORS.REQUIRED),
});
