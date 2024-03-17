import { NextPage } from "next";
import { Stack, Button } from "@mui/material";
import CustomHead from "@/components/layout/CustomHead";
import Body from "@/components/layout/Body";
import GoBackButton from "@/components/buttons/GoBackButton";
import CreatePostForm from "@/components/forms/CreatePostForm";
import AutoBreadcrumbs from "@/components/layout/AutoBreadcrumbs";
import * as Yup from "yup";
import { Formik } from "formik";
import { ERRORS } from "@/helpers/errors";
import useApiCall from "@/hooks/useApiCall";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import { useRouter } from "next/router";
import useAuth from "@/contexts/useAuth";

interface AddForumPostFormValuesType {
  title: string;
  body: string;
  category: string;
}

const CreatePost: NextPage = () => {
  const router = useRouter();
  const { setSuccess, setError } = useSnackbarAlert();
  const { user } = useAuth();

  const createPostValidationSchema = Yup.object({
    title: Yup.string().required(ERRORS.REQUIRED),
    body: Yup.string().required(ERRORS.REQUIRED),
    category: Yup.string().required(ERRORS.REQUIRED),
  });

  const addForumPost = useApiCall({
    endpoint: "/forumposts",
    onSuccess: () => {
      setSuccess(
        "Post created successfully! Redirecting you to the forum page..."
      );
      setTimeout(() => {
        router.push("/forum");
      }, 3000);
    },
    onError: () => {
      setError("Something went wrong while creating the post");
    },
  });

  const initialValues: AddForumPostFormValuesType = {
    title: "",
    body: "",
    category: "",
  };

  const handleSubmit = async (values: AddForumPostFormValuesType) => {
    await addForumPost.call({
      ...values,
      userId: user?.id,
    });
  };

  return (
    <>
      <CustomHead title="Create Post" description="Create Posts here" />
      <Body>
        <AutoBreadcrumbs />
        <GoBackButton />
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={createPostValidationSchema}
        >
          {(formik) => (
            <Stack gap="1rem">
              <CreatePostForm formik={formik} />
              <Button
                variant="contained"
                onClick={formik.submitForm}
                disabled={formik.isSubmitting}
                sx={{ width: "fit-content" }}
              >
                Create Post
              </Button>
            </Stack>
          )}
        </Formik>
      </Body>
    </>
  );
};

export default CreatePost;
