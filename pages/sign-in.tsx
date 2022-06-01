import type { NextPage } from "next";
import Link from "next/link";
// Libraries
import { Formik, FormikHelpers } from "formik";
import { Button, Container, Stack, Typography, Divider } from "@mui/material";
// Components
import Body from "@/components/Body";
import TextInput from "@/components/FormControllers/TextInput";
import useAuth from "@/hooks/useAuth";
interface SignInFormValuesType {
  email: string;
  password: string;
}

const SignIn: NextPage = () => {
  const { signIn } = useAuth();

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
      console.log("Submitted: ", values);
    } catch (error) {
      console.log(error);
    }

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
                      disabled={formik.isSubmitting}
                      type="submit"
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
