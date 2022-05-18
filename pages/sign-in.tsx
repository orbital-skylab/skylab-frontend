import type { NextPage } from "next";
import Link from "next/link";
// Types
import { FormikSignInValues } from "@/types/formikValues";
// Libraries
import { useFormik } from "formik";
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

const SignIn: NextPage = () => {
  const formik = useFormik<FormikSignInValues>({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log("Submitted", values);
    },
  });
  console.log(formik.values);

  return (
    <>
      <Body>
        <Container maxWidth="xs">
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
            <Button variant="contained" onClick={formik.submitForm}>
              Sign In
            </Button>
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
