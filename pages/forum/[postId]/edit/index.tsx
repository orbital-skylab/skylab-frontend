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
import { GetForumPostResponse, HTTP_METHOD } from "@/types/api";
import useFetch from "@/hooks/useFetch";

interface EditForumPostFormValuesType {
  title: string;
  body: string;
  category: string;
}

const EditPost: NextPage = () => {
  const router = useRouter();
  const { postId } = router.query;
  const { setSuccess, setError } = useSnackbarAlert();

  const { data } = useFetch<GetForumPostResponse>({
    endpoint: `/forumposts/${postId}`,
  });

  const editPostValidationSchema = Yup.object({
    title: Yup.string().required(ERRORS.REQUIRED),
    body: Yup.string().required(ERRORS.REQUIRED),
    category: Yup.string().required(ERRORS.REQUIRED),
  });

  const editForumPost = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/forumposts/${postId}`,
    onSuccess: () => {
      setSuccess(
        "Post edited successfully! Redirecting you to the forum page..."
      );
      setTimeout(() => {
        router.push("/forum");
      }, 3000);
    },
    onError: () => {
      setError("Something went wrong while creating the post");
    },
  });

  const initialValues: EditForumPostFormValuesType = {
    title: data?.forumPost.title ?? "",
    body: data?.forumPost.body ?? "",
    category: data?.forumPost.category ?? "",
  };

  const handleSubmit = async (values: EditForumPostFormValuesType) => {
    await editForumPost.call({
      ...values,
    });
  };

  return (
    <>
      <CustomHead title="Edit Post" description="Edit your post here" />
      <Body>
        <AutoBreadcrumbs />
        <GoBackButton />
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={editPostValidationSchema}
          enableReinitialize={true}
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
                Edit Post
              </Button>
            </Stack>
          )}
        </Formik>
      </Body>
    </>
  );
};

export default EditPost;
