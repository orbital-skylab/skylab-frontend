import type { NextPage } from "next";
// Components
import Body from "@/components/layout/Body";
import TextInput from "@/components/formControllers/TextInput";
import SnackbarAlert from "@/components/SnackbarAlert";
import { Button, Container, Divider, Stack, Typography } from "@mui/material";
// Helpers
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
// Hooks
import useAuth from "@/hooks/useAuth";
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
// Constants
import { ERRORS } from "@/helpers/errors";
import { useRouter } from "next/router";

interface ChangePasswordFormValuesType {
  newPassword: string;
  confirmNewPassword: string;
}

const ChangePassword: NextPage = () => {
  const router = useRouter();
  const { token, id } = router.query;
  const { changePassword } = useAuth();
  const { snackbar, handleClose, setSuccess, setError } = useSnackbarAlert();

  const initialValues: ChangePasswordFormValuesType = {
    newPassword: "",
    confirmNewPassword: "",
  };

  const handleSubmit = async (
    values: ChangePasswordFormValuesType,
    helpers: FormikHelpers<ChangePasswordFormValuesType>
  ) => {
    try {
      if (
        !token ||
        !id ||
        typeof token !== "string" ||
        typeof id !== "string"
      ) {
        throw new Error(
          "The reset password link is invalid. Please try to reset your password again"
        );
      }

      await changePassword({
        newPassword: values.newPassword,
        token,
        id: parseInt(id, 10),
      });
      setSuccess("Successfully changed password!");
      helpers.resetForm();
    } catch (error) {
      setError(error);
    }
  };

  return (
    <>
      <SnackbarAlert snackbar={snackbar} handleClose={handleClose} />
      <Body flexColCenter>
        <Container maxWidth="xs">
          <Stack gap="1rem" justifyContent="center">
            <Typography variant="h6" fontWeight={600}>
              Change Password
            </Typography>
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={changePasswordValidationSchema}
            >
              {(formik) => (
                <form onSubmit={formik.handleSubmit}>
                  <Stack gap="1rem">
                    <TextInput
                      label="New Password"
                      name="newPassword"
                      type="password"
                      formik={formik}
                    />
                    <TextInput
                      label="Confirm New Password"
                      name="confirmNewPassword"
                      type="password"
                      formik={formik}
                    />

                    <Button
                      variant="contained"
                      disabled={formik.isSubmitting}
                      type="submit"
                    >
                      Change Password
                    </Button>
                  </Stack>
                </form>
              )}
            </Formik>
            <Divider />
          </Stack>
        </Container>
      </Body>
    </>
  );
};
export default ChangePassword;

const changePasswordValidationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, ERRORS.PASSWORD_LENGTH)
    .required(ERRORS.REQUIRED),
  confirmNewPassword: Yup.string()
    .test(
      "isSameAsNewPassword",
      ERRORS.CONFIRM_PASSWORD_MUST_BE_SAME,
      (value, ctx) => value === ctx.parent.newPassword
    )
    .required(ERRORS.REQUIRED),
});
