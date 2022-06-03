import type { NextPage } from "next";
// Libraries
import { Formik, FormikHelpers } from "formik";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
// Components
import Body from "@/components/Body";
import TextInput from "@/components/FormControllers/TextInput";
import useAuth from "@/hooks/useAuth";
import { COHORTS } from "@/types/projects";

interface SignUpFormValuesType {
  email: string;
  password: string;
  matricNo: string;
  nusnetId: string;
}

const SignUp: NextPage = () => {
  const { signUp } = useAuth();

  const initialValues: SignUpFormValuesType = {
    email: "",
    password: "",
    matricNo: "",
    nusnetId: "",
  };

  const handleSubmit = async (
    values: SignUpFormValuesType,
    actions: FormikHelpers<SignUpFormValuesType>
  ) => {
    const { email, password, matricNo, nusnetId } = values;

    try {
      await signUp(email, password, matricNo, nusnetId, COHORTS.CURRENT);
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
            <Box>
              <Typography variant="caption" fontWeight={400}>
                Dev: For testing purposes
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                Create a new student here!
              </Typography>
            </Box>
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
                    <TextInput
                      label="Matric Number"
                      name="matricNo"
                      formik={formik}
                    />
                    <TextInput
                      label="NUSNet ID"
                      name="nusnetId"
                      formik={formik}
                    />
                    <Button
                      variant="contained"
                      disabled={formik.isSubmitting}
                      type="submit"
                    >
                      Sign Up
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
