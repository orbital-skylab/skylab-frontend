import useAuth from "@/hooks/useAuth";
import { FULL_HEIGHT_MINUS_NAV, NAVBAR_HEIGHT_REM } from "@/styles/constants";
import { Box, Typography, Stack, Grid, Button, Container } from "@mui/material";
import { Formik, FormikHelpers } from "formik";
import { FC } from "react";
import TextInput from "../FormControllers/TextInput";

interface SignInFormValuesType {
  email: string;
  password: string;
}

const Hero: FC = () => {
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
    await signIn(email, password);

    console.log("Submitted: ", values);

    actions.setSubmitting(false);
  };

  return (
    <Box
      sx={{
        paddingBottom: { md: NAVBAR_HEIGHT_REM },
      }}
    >
      <Container maxWidth="lg">
        <Grid container>
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              height: FULL_HEIGHT_MINUS_NAV,
              paddingBottom: { xs: NAVBAR_HEIGHT_REM, md: 0 },
              display: "grid",
              placeItems: "center",
            }}
          >
            <Stack direction="column" spacing="1rem">
              <Typography
                variant="h1"
                fontSize={{ xs: 64, md: 96 }}
                fontWeight={600}
                sx={{
                  letterSpacing: "0.25rem",
                  textAlign: { xs: "center", md: "left" },
                }}
                color="primary"
              >
                Skylab
              </Typography>
              <Typography
                variant="body1"
                fontSize={{ xs: 18, md: 24 }}
                sx={{ textAlign: { xs: "center", md: "left" } }}
              >
                The platform powering{" "}
                <Typography component="span" fontSize="inherit">
                  NUS Orbital
                </Typography>
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  width: "fit-content",
                  alignSelf: { xs: "center", md: "start" },
                }}
              >
                View Projects
              </Button>
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              height: { md: FULL_HEIGHT_MINUS_NAV },
              marginBottom: { xs: "4rem", md: 0 },
              display: "grid",
              placeItems: "center",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {(formik) => (
                  <form onSubmit={formik.handleSubmit}>
                    <Stack gap="1rem" width="100%">
                      <Typography
                        variant="h6"
                        fontWeight={400}
                        marginBottom="1rem"
                      >
                        Involved in Orbital? Sign in here
                      </Typography>
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
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
export default Hero;
