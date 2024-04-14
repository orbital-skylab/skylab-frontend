import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import useFetch, { isFetching } from "@/hooks/useFetch";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import { GetForumPostWithCommentThreadsResponse } from "@/types/api";
import CustomHead from "@/components/layout/CustomHead";
import GoBackButton from "@/components/buttons/GoBackButton";
import Body from "@/components/layout/Body";
import { formatCategory } from "@/helpers/forumpost";
import { timeAgo } from "@/helpers/dates";
import RichText from "@/components/typography/RichText";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useAuth from "@/contexts/useAuth";
import { Formik } from "formik";
import RichTextEditor from "@/components/formikFormControllers/RichTextEditor";
import PostCommentThreadCard from "@/components/cards/PostCommentCard";

type SubmitCommentFormValuesType = {
  content: string;
};

const PostDetails: NextPage = () => {
  const router = useRouter();
  const { postId } = router.query;
  const { setSuccess, setError } = useSnackbarAlert();
  const { user } = useAuth();

  const {
    data: postResponse,
    status: getPostStatus,
    refetch,
  } = useFetch<GetForumPostWithCommentThreadsResponse>({
    endpoint: `/forumposts/${postId}`,
    enabled: !!postId,
  });

  const post = postResponse ? postResponse.forumPost : undefined;

  const { call, status } = useApiCall({
    endpoint: `/forumposts/${postId}/comments`,
    onSuccess: () => {
      setSuccess("Successfully commented");
      refetch();
    },
    onError: () => {
      setError("An error occurred while commenting. Please try again later");
    },
  });

  const handleSubmitComment = (values: SubmitCommentFormValuesType) => {
    call({ comment: { ...values, userId: user?.id } });
  };

  return (
    <>
      <CustomHead title={post?.title} />
      <Body isLoading={isFetching(getPostStatus)} loadingText="Loading post...">
        <GoBackButton />
        <Stack direction="column" gap="2rem">
          <Card sx={{ margin: "auto", width: "100%" }}>
            <CardHeader
              avatar={
                <Avatar src={post?.user.profilePicUrl} aria-label="recipe">
                  {post?.user.name[0]}
                </Avatar>
              }
              title={post?.user.name}
              subheader={
                post?.createdAt ? timeAgo(post.createdAt) : "Unknown date"
              }
              action={
                <Chip
                  label={formatCategory(post?.category ?? "Unknown")}
                  variant="outlined"
                />
              }
              sx={{ paddingBottom: 0 }}
            />
            <CardContent>
              <Typography variant="h5" component="div" marginBottom={2}>
                {post?.title}
              </Typography>
              <RichText htmlContent={post?.body ?? ""} />
            </CardContent>
          </Card>
          <Formik
            initialValues={{ content: "" } as SubmitCommentFormValuesType}
            onSubmit={handleSubmitComment}
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                <Stack direction="column" gap="1rem">
                  <RichTextEditor
                    id="comment-content-input"
                    name="content"
                    formik={formik}
                  />
                  <Button
                    id="comment-button"
                    variant="contained"
                    type="submit"
                    sx={{ width: "fit-content" }}
                  >
                    {isCalling(status) ? "Loading..." : "Comment"}
                  </Button>
                </Stack>
              </form>
            )}
          </Formik>
          <Stack direction="column" gap="0.5rem">
            {post?.postCommentThreads.map((commentThread, index) => (
              <PostCommentThreadCard
                key={index}
                commentThread={commentThread}
                refetch={refetch}
              />
            ))}
          </Stack>
        </Stack>
      </Body>
    </>
  );
};

export default PostDetails;
