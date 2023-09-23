import { AnnouncementCommentThread } from "@/types/announcements";
import { Box, Button, Card, Stack } from "@mui/material";
import { FC, useState } from "react";
import CommentContent from "./CommentContent";
import ActionLink from "@/components/typography/ActionLink";
import RichTextEditor from "@/components/formikFormControllers/RichTextEditor";
import { Formik } from "formik";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import useAuth from "@/contexts/useAuth";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";

type Props = {
  commentThread: AnnouncementCommentThread;
  refetch: () => void;
};

type SubmitCommentFormValuesType = {
  content: string;
};

const CommentThreadCard: FC<Props> = ({ commentThread, refetch }) => {
  const { setSuccess, setError } = useSnackbarAlert();
  const [rootComment, ...remainingComments] = commentThread;
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const { user } = useAuth();

  const { call, status } = useApiCall({
    endpoint: `/announcements/${rootComment.announcementId}/comments`,
    onSuccess: () => {
      setSuccess("Successfully replied to comment");
      if (refetch) {
        refetch();
      }
      setIsReplyOpen(false);
    },
    onError: () => {
      setError(
        "An error occurred while replying to comment. Please try again later"
      );
    },
  });

  const handleSubmitReply = async (values: SubmitCommentFormValuesType) => {
    await call({
      comment: {
        ...values,
        authorId: user?.id,
        parentCommentId: rootComment.id,
      },
    });
  };

  return (
    <Card sx={{ p: "0.25rem" }}>
      <Formik
        initialValues={{ content: "" } as SubmitCommentFormValuesType}
        onSubmit={handleSubmitReply}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit}>
            <Stack gap="0.5rem">
              <CommentContent comment={rootComment} refetch={refetch} />
              {remainingComments.map((comment) => (
                <Stack direction="row" key={comment.id}>
                  <Box
                    sx={{
                      width: "2px",
                      ml: "0.5rem",
                      mr: "0.5rem",
                      height: "full",
                      backgroundColor: "lightgray",
                    }}
                  />
                  <CommentContent
                    comment={comment}
                    sx={{ py: "0.25rem" }}
                    refetch={refetch}
                  />
                </Stack>
              ))}
              <Stack sx={{ px: "0.25rem", pb: "0.25rem" }}>
                {isReplyOpen ? (
                  <Stack gap="0.75rem">
                    <RichTextEditor
                      id="reply-comment-content-input"
                      name="content"
                      formik={formik}
                    />
                    <Stack direction="row" justifyContent="space-between">
                      <Button
                        id="reply-comment-post-button"
                        variant="contained"
                        type="submit"
                        size="small"
                        disabled={formik.isSubmitting}
                        sx={{ width: "fit-content" }}
                      >
                        {isCalling(status) ? "Replying..." : "Reply"}
                      </Button>
                      <ActionLink
                        onClick={() => setIsReplyOpen(false)}
                        sx={{ alignSelf: "end" }}
                      >
                        Close
                      </ActionLink>
                    </Stack>
                  </Stack>
                ) : (
                  <ActionLink
                    id="reply-comment-button"
                    onClick={() => setIsReplyOpen(true)}
                  >
                    Reply
                  </ActionLink>
                )}
              </Stack>
            </Stack>
          </form>
        )}
      </Formik>
    </Card>
  );
};
export default CommentThreadCard;
