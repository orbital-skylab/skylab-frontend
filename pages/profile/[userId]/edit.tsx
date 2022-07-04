import type { NextPage } from "next";
// Components
import Body from "@/components/layout/Body";
import TextInput from "@/components/formikFormControllers/TextInput";
import SnackbarAlert from "@/components/SnackbarAlert";
import { Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import GoBackButton from "@/components/buttons/GoBackButton";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
// Helpers
import { Formik, FormikHelpers } from "formik";
// Types
import { GetUserResponse, HTTP_METHOD } from "@/types/api";
import { UserMetadata } from "@/types/users";
import { useRouter } from "next/router";
import useFetch, { isFetching } from "@/hooks/useFetch";
import { areAllEmptyValues, stripEmptyValues } from "@/helpers/forms";
import { isNotUndefined } from "@/helpers/types";

type EditProfileFormValues = Partial<UserMetadata>;

const EditProfile: NextPage = () => {
  const router = useRouter();
  const { userId } = router.query;

  const { data: userResponse, status: getUserStatus } =
    useFetch<GetUserResponse>({
      endpoint: `/users/${userId}`,
      enabled: !!userId,
    });
  const user = isNotUndefined(userResponse)
    ? userResponse.user
    : ({} as UserMetadata);

  const editProfile = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/users/${userId}`,
  });
  const { snackbar, handleClose, setSuccess, setError } = useSnackbarAlert();

  const initialValues: EditProfileFormValues = {
    profilePicUrl: user.profilePicUrl ?? "",
    githubUrl: user.githubUrl ?? "",
    linkedinUrl: user.linkedinUrl ?? "",
    personalSiteUrl: user.personalSiteUrl ?? "",
    selfIntro: user.selfIntro ?? "",
  };

  const handleSubmit = async (
    values: EditProfileFormValues,
    actions: FormikHelpers<EditProfileFormValues>
  ) => {
    const processedValues = stripEmptyValues(values);

    try {
      await editProfile.call({ user: processedValues });
      setSuccess(
        `You have successfully edited ${userResponse?.user.name}'s profile`
      );
      actions.resetForm();
    } catch (error) {
      setError(error);
    }
  };

  return (
    <>
      <SnackbarAlert snackbar={snackbar} handleClose={handleClose} />
      <Body flexColCenter isLoading={isFetching(getUserStatus)}>
        <GoBackButton sx={{ alignSelf: "start" }} />
        <Container maxWidth="sm" sx={{ padding: 0 }}>
          <Typography variant="h5" fontWeight={600} mb="1rem">
            {`Edit ${user.name ?? user.email}'s Profile`}
          </Typography>
          <Card>
            <CardContent>
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {(formik) => {
                  return (
                    <form onSubmit={formik.handleSubmit}>
                      <Stack direction="column" spacing="1rem">
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
                        <Stack direction="row" justifyContent="end">
                          <LoadingButton
                            type="submit"
                            variant="contained"
                            disabled={
                              areAllEmptyValues(formik.values) ||
                              snackbar.severity === "success"
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
