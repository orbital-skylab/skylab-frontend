import type { NextPage } from "next";
// Components
import Body from "@/components/layout/Body";
import TextInput from "@/components/formikFormControllers/TextInput";
import { Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import GoBackButton from "@/components/buttons/GoBackButton";
import NoneFound from "@/components/emptyStates/NoneFound";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import UnauthorizedWrapper from "@/components/wrappers/UnauthorizedWrapper";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useFetch, { isFetching } from "@/hooks/useFetch";
import { useRouter } from "next/router";
import useAuth from "@/contexts/useAuth";
// Helpers
import { Formik } from "formik";
import { areAllEmptyValues, stripEmptyStrings } from "@/helpers/forms";
import { userHasRole } from "@/helpers/roles";
// Types
import { GetUserResponse, HTTP_METHOD } from "@/types/api";
import { UserMetadata } from "@/types/users";
import { ROLES } from "@/types/roles";

type EditProfileFormValues = Partial<UserMetadata>;

const EditProfile: NextPage = () => {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const { userId } = router.query;

  const { data: userResponse, status: getUserStatus } =
    useFetch<GetUserResponse>({
      endpoint: `/users/${userId}`,
      enabled: !!userId,
    });
  const user = userResponse ? userResponse.user : undefined;

  const isCurrentUser = user && currentUser && user.id === currentUser.id;

  const editProfile = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/users/${userId}`,
  });
  const { setSuccess, setError } = useSnackbarAlert();

  const initialValues: EditProfileFormValues = {
    name: user?.name ?? "",
    profilePicUrl: user?.profilePicUrl ?? "",
    githubUrl: user?.githubUrl ?? "",
    linkedinUrl: user?.linkedinUrl ?? "",
    personalSiteUrl: user?.personalSiteUrl ?? "",
    selfIntro: user?.selfIntro ?? "",
  };

  const handleSubmit = async (values: EditProfileFormValues) => {
    const processedValues = stripEmptyStrings(values);

    try {
      await editProfile.call({ user: processedValues });
      setSuccess(
        `You have successfully edited ${userResponse?.user.name}'s profile`
      );
    } catch (error) {
      setError(error);
    }
  };

  return (
    <>
      <Body
        isLoading={isFetching(getUserStatus)}
        authorizedRoles={[ROLES.ADMINISTRATORS]}
      >
        <NoDataWrapper
          noDataCondition={user === undefined}
          fallback={
            <NoneFound
              showReturnHome
              message="There is no such user with that user ID"
            />
          }
        >
          <UnauthorizedWrapper
            isUnauthorized={
              !userHasRole(currentUser, ROLES.ADMINISTRATORS) && !isCurrentUser
            }
          >
            <GoBackButton />
            <Container maxWidth="sm" sx={{ padding: 0 }}>
              <Typography variant="h5" fontWeight={600} mb="1rem">
                {`Edit ${user?.name ?? user?.email}'s Profile`}
              </Typography>
              <Card>
                <CardContent>
                  <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                    {(formik) => {
                      return (
                        <form onSubmit={formik.handleSubmit}>
                          <Stack direction="column" spacing="1rem">
                            <TextInput
                              id="edit-name-input"
                              name="name"
                              label="Name"
                              formik={formik}
                            />
                            <TextInput
                              id="edit-profil-picture-input"
                              name="profilePicUrl"
                              label="Profile Picture URL"
                              formik={formik}
                            />
                            <TextInput
                              id="edit-github-input"
                              name="githubUrl"
                              label="GitHub URL"
                              formik={formik}
                            />
                            <TextInput
                              id="edit-linkedin-input"
                              name="linkedinUrl"
                              label="LinkedIn URL"
                              formik={formik}
                            />
                            <TextInput
                              id="edit-personal-site-input"
                              name="personalSiteUrl"
                              label="Personal Site URL"
                              formik={formik}
                            />
                            <TextInput
                              id="edit-self-intro-input"
                              name="selfIntro"
                              label="Self Introduction"
                              multiline
                              minRows={3}
                              formik={formik}
                            />
                            <Stack direction="row" justifyContent="end">
                              <LoadingButton
                                id="save-profile-button"
                                type="submit"
                                variant="contained"
                                disabled={areAllEmptyValues(formik.values)}
                                loading={formik.isSubmitting}
                              >
                                Save
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
          </UnauthorizedWrapper>
        </NoDataWrapper>
      </Body>
    </>
  );
};
export default EditProfile;
