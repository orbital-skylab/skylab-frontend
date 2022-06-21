/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextPage } from "next";
// Libraries
import { Formik, FormikHelpers } from "formik";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
// Components
import Body from "@/components/layout/Body";
import TextInput from "@/components/placeholderfc/TextInput";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import useFetch, { FETCH_STATUS } from "@/hooks/useFetch";
// Types
import { Cohort } from "@/types/cohorts";

interface SignUpFormValuesType {
  name: string;
  email: string;
  password: string;
  matricNo: string;
  nusnetId: string;
}

const SignUp: NextPage = () => {
  const { signUp } = useAuth();
  const [log, setLog] = useState<string[]>([]);
  const { data: cohort, status: fetchCohortStatus } = useFetch<Cohort>({
    endpoint: "/cohorts/latest",
  });
  const { academicYear: cohortYear } = cohort ?? { academicYear: 0 };

  const initialValues: SignUpFormValuesType = {
    name: "",
    email: "",
    password: "",
    matricNo: "",
    nusnetId: "",
  };

  const handleSubmit = async (
    values: SignUpFormValuesType,
    actions: FormikHelpers<SignUpFormValuesType>
  ) => {
    const { name, email, password, matricNo, nusnetId } = values;
    if (fetchCohortStatus === FETCH_STATUS.FETCHING) {
      alert("Still fetching latest cohort... Please try again");
      return;
    }
    try {
      await signUp({
        name,
        email,
        password,
        matricNo,
        nusnetId,
        role: "students",
        cohortYear,
      });
      alert("Success");
    } catch (error) {
      alert(error instanceof Error ? error.message : String(error));
    }

    actions.setSubmitting(false);
  };

  const seedUsers = async () => {
    const promises = [];
    /** STUDENTS */
    for (let i = 0; i < 8; i++) {
      promises.push(
        signUp({
          name: `Student ${i}`,
          email: `student${i}@gmail.com`,
          password: "test1234",
          cohortYear,
          role: "students",
          matricNo: `A000000${i}X`,
          nusnetId: `e000000${i}`,
        })
      );
      setLog((log) => {
        return [...log, `Added student ${i} to promises`];
      });
    }
    /** ADVISERS */
    for (let i = 0; i < 2; i++) {
      promises.push(
        signUp({
          name: `Adviser ${i}`,
          email: `adviser${i}@gmail.com`,
          password: "test1234",
          cohortYear,
          role: "advisers",
        })
      );
      setLog((log) => {
        return [...log, `Added adviser ${i} to promises`];
      });
    }

    /** MENTORS */
    for (let i = 0; i < 2; i++) {
      promises.push(
        signUp({
          name: `Mentor ${i}`,
          email: `mentor${i}@gmail.com`,
          password: "test1234",
          cohortYear,
          role: "mentors",
        })
      );
      setLog((log) => {
        return [...log, `Added mentor ${i} to promises`];
      });
    }

    setLog((log) => {
      return [...log, "Waiting for responses..."];
    });

    await Promise.all(promises);

    setLog((log) => {
      return [...log, "Seeding completed"];
    });
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
                    <TextInput label="Name" name="name" formik={formik} />
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
            <Button onClick={seedUsers}>Seed Users</Button>
            {log.length > 0 ? (
              <>
                <Typography variant="h6" mt="1rem">
                  Logs:
                </Typography>
                {log.map((entry) => (
                  <Typography key={entry}>{entry}</Typography>
                ))}
              </>
            ) : null}
          </Stack>
        </Container>
      </Body>
    </>
  );
};
export default SignUp;
