import Body from "@/components/layout/Body";
import TextInput from "@/components/formControllers/TextInput";
import SnackbarAlert from "@/components/SnackbarAlert";
import { SNACKBAR_ALERT_INITIAL } from "@/helpers/forms";
import { PAGES } from "@/helpers/navigation";
import useApiCall from "@/hooks/useApiCall";
import useAuth from "@/hooks/useAuth";
import { HTTP_METHOD } from "@/types/api";
import { SnackbarAlertType } from "@/types/forms";
import {
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { Formik, FormikHelpers, FormikProps } from "formik";
import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";

interface EditProfileFormValues {
  profilePicUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  personalSiteUrl: string;
  selfIntro: string;
}

const EditProfile: NextPage = () => {
  const { user } = useAuth();
  const editProfile = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/users/${user?.email}`,
  });
  const [snackbar, setSnackbar] = useState<SnackbarAlertType>(
    SNACKBAR_ALERT_INITIAL
  );
  const [hasSuccessfullySubmitted, setHasSuccessfullySubmitted] =
    useState(false);

  const initialValues: EditProfileFormValues = {
    profilePicUrl: "",
    githubUrl: "",
    linkedinUrl: "",
    personalSiteUrl: "",
    selfIntro: "",
  };

  const handleSubmit = async (
    values: EditProfileFormValues,
    actions: FormikHelpers<EditProfileFormValues>
  ) => {
    const processedValues = Object.fromEntries(
      Object.entries(values).filter(([, value]) => value !== "")
    );

    try {
      const res = await editProfile.call({ user: processedValues });
      console.log(res);
      setSnackbar({
        severity: "success",
        message: "You have successfully edited your profile",
      });
      setHasSuccessfullySubmitted(true);
      actions.resetForm();
    } catch (error) {
      setSnackbar({
        severity: "error",
        message: error instanceof Error ? error.message : String(error),
      });
    }

    actions.setSubmitting(false);
  };

  function hasNoneSelected(formik: FormikProps<EditProfileFormValues>) {
    return Object.values(formik.values).reduce((a, b) => a && b === "", true);
  }

  return (
    <>
      <SnackbarAlert snackbar={snackbar} setSnackbar={setSnackbar} />
      <Body flexColCenter>
        <Container maxWidth="sm" sx={{ padding: 0 }}>
          <Typography variant="h5" fontWeight={600} mb="1rem">
            Edit your profile
          </Typography>
          <Card>
            <CardContent>
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {(formik) => {
                  return (
                    <form onSubmit={formik.handleSubmit}>
                      <Stack direction="column" spacing="0.5rem">
                        <TextInput
                          name="profilePicUrl"
                          label="Profile Picture URL"
                          formik={formik}
                        />
                        <TextInput
                          name="githubUrl"
                          label="GitHub URL"
                          formik={formik}
                        />
                        <TextInput
                          name="linkedinUrl"
                          label="LinkedIn URL"
                          formik={formik}
                        />
                        <TextInput
                          name="personalSiteUrl"
                          label="Personal Site URL"
                          formik={formik}
                        />
                        <TextInput
                          name="selfIntro"
                          label="Self Introduction"
                          multiline
                          minRows={3}
                          formik={formik}
                        />
                        <Stack direction="row" justifyContent="space-between">
                          <Link href={PAGES.PROFILE} passHref>
                            <Button variant="contained">Back</Button>
                          </Link>
                          <LoadingButton
                            type="submit"
                            variant="contained"
                            disabled={
                              hasNoneSelected(formik) ||
                              hasSuccessfullySubmitted
                            }
                            loading={formik.isSubmitting}
                          >
                            Edit
                          </LoadingButton>
                        </Stack>
                      </Stack>
                    </form>
                  );
                }}
              </Formik>
            </CardContent>
          </Card>
        </Container>
      </Body>
    </>
  );
};
export default EditProfile;
