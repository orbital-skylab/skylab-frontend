import Body from "@/components/layout/Body";
import TextInput from "@/components/formControllers/TextInput";
import { PAGES } from "@/helpers/navigation";
import useAuth from "@/hooks/useAuth";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { Formik, FormikHelpers } from "formik";
import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";

interface SignUpFormValuesType {
  email: string;
}

const ForgotPassword: NextPage = () => {
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");

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
      setError(error instanceof Error ? error.message : String(error));
    }
    actions.setSubmitting(false);
  };

  const handleCloseSnackbar = () => {
    setError("");
  };

  return (
    <>
      <Snackbar
        open={!!error}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
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
