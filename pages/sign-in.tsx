import type { NextPage } from "next";
import Link from "next/link";
// Types
import { AllFormikValues, FormikSignInValues } from "@/types/formikValues";
// Libraries
import { Formik, FormikHandlers, FormikHelpers, useFormik } from "formik";
import {
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
// Components
import Body from "@/components/Body";
import TextInput from "@/components/FormControllers/TextInput";

interface FormValuesType {
  email: string;
  password: string;
}

const SignIn: NextPage = () => {
  const initialValues: FormValuesType = {
    email: "",
    password: "",
  };

  const handleSubmit = (
    values: FormValuesType,
    actions: FormikHelpers<FormValuesType>
  ) => {
    console.log("Submitted", values);
    actions.setSubmitting(false);
  };

  return (
    <>
      <Body>
        <Container maxWidth="xs">
          <Stack gap="1rem">
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {(formik) => (
                <form onSubmit={formik.handleSubmit}>
                  <Stack gap="1rem">
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
                      onClick={formik.submitForm}
                      disabled={formik.isSubmitting}
                    >
                      Sign In
                    </Button>
                  </Stack>
                </form>
              )}
            </Formik>

            <Divider />

            <Typography textAlign="center">
              Forgot your password?
              <br />
              <Link href="/forgot-password">Reset password</Link>
            </Typography>
          </Stack>
        </Container>
      </Body>
    </>
  );
};
export default SignIn;
