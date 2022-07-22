import type { NextPage } from "next";
// Components
import Body from "@/components/layout/Body";
import TextInput from "@/components/formikFormControllers/TextInput";
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoneFound from "@/components/emptyStates/NoneFound";
import CustomHead from "@/components/CustomHead";
// Helpers
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
// Hooks
import useAuth from "@/contexts/useAuth";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import { useRouter } from "next/router";
// Constants
import { ERRORS } from "@/helpers/errors";
import Link from "next/link";
import { PAGES } from "@/helpers/navigation";

interface ChangePasswordFormValuesType {
  newPassword: string;
  confirmNewPassword: string;
}

const ChangePassword: NextPage = () => {
  const router = useRouter();
  const { token, id } = router.query;
  const { changePassword } = useAuth();
  const { setSuccess, setError } = useSnackbarAlert();

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
          "The link is invalid. Please try to reset your password again"
        );
      }

      await changePassword({
        newPassword: values.newPassword,
        token,
        id: parseInt(id, 10),
      });
      setSuccess("Successfully changed password! You can now sign in.");
      setTimeout(() => {
        router.push(PAGES.LANDING);
      }, 3000);
      helpers.resetForm();
    } catch (error) {
      setError(error);
    }
  };

  return (
    <>
      <CustomHead
        title="Change Password"
        description="Change your password using the link received in your inbox!"
      />
      <Body sx={{ display: "grid", placeItems: "center" }}>
        <NoDataWrapper
          noDataCondition={!token || !id}
          fallback={
            <NoneFound
              message="The link is invalid. If you are trying to reset your password, please try again."
              showReturnHome
            />
          }
        >
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
              <Box>
                <Typography
                  textAlign="left"
                  variant="subtitle2"
                  fontWeight={600}
                >
                  Already have an account?
                </Typography>
                <Link href={PAGES.LANDING} passHref>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      "&:hover": {
                        color: "secondary.main",
                        textDecoration: "underline",
                        cursor: "pointer",
                        transitionDuration: "150ms",
                      },
                    }}
                  >
                    Sign In
                  </Typography>
                </Link>
              </Box>
            </Stack>
          </Container>
        </NoDataWrapper>
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
