import Body from "@/components/Body";
import TextInput from "@/components/FormControllers/TextInput";
import {
  Button,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, FormikHelpers } from "formik";
import type { NextPage } from "next";
import Link from "next/link";

interface SignUpFormValuesType {
  email: string;
}

const ForgotPassword: NextPage = () => {
  const initialValues: SignUpFormValuesType = {
    email: "",
  };

  const handleSubmit = (
    values: SignUpFormValuesType,
    actions: FormikHelpers<SignUpFormValuesType>
  ) => {
    console.log("Submited", values);
    actions.setSubmitting(false);
  };

  return (
    <Body>
      <Container maxWidth="xs">
        <Stack gap="1rem">
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

          <Typography textAlign="center">
            Already have an account?
            <br />
            <Link href="/sign-in">Sign in</Link>
          </Typography>
        </Stack>
      </Container>
    </Body>
  );
};
export default ForgotPassword;
