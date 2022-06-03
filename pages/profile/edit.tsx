import Body from "@/components/Body";
import SnackbarAlert from "@/components/SnackbarAlert";
import { SNACKBAR_ALERT_INITIAL } from "@/helpers/forms";
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
import { Formik, FormikHelpers } from "formik";
import type { NextPage } from "next";
import { useState } from "react";

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
    } catch (error) {
      setSnackbar({
        severity: "error",
        message: error instanceof Error ? error.message : String(error),
      });
    }

    actions.setSubmitting(false);
  };

  return (
    <>
      <SnackbarAlert snackbar={snackbar} setSnackbar={setSnackbar} />
      <Body flexColCenter>
        <Container maxWidth="sm">
          <Typography variant="h5" fontWeight={600} mb="1rem">
            Edit your profile
          </Typography>
          <Card>
            <CardContent>
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {(formik) => {
                  return (
                    <form onSubmit={formik.handleSubmit}>
                      <Stack direction="row" justifyContent="space-between">
                        <Button variant="contained">Back</Button>
                        <Button type="submit" variant="contained">
                          Edit
                        </Button>
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
