import type { NextPage } from "next";
// Libraries
import { Formik, FormikHelpers } from "formik";
import { Button, Container, Stack, Typography } from "@mui/material";
// Components
import Body from "@/components/Body";
import TextInput from "@/components/FormControllers/TextInput";
import useAuth from "@/hooks/useAuth";

interface SignUpFormValuesType {
  email: string;
  password: string;
}

const SignUp: NextPage = () => {
  const { signUp } = useAuth();

  const initialValues: SignUpFormValuesType = {
    email: "",
    password: "",
  };

  const handleSubmit = async (
    values: SignUpFormValuesType,
    actions: FormikHelpers<SignUpFormValuesType>
  ) => {
    const { email, password } = values;

    try {
      await signUp(email, password);
    } catch (error) {
      console.log(error);
    }

    console.log("Submitted: ", values);
    actions.setSubmitting(false);
  };

  return (
    <>
      <Body>
        <Container maxWidth="xs">
          <Stack gap="1rem">
            <Typography textAlign="center">
              Dev: For testing purposes
            </Typography>
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
          </Stack>
        </Container>
      </Body>
    </>
  );
};
export default SignUp;
