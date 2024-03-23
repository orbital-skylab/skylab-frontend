import RichTextEditor from "@/components/formikFormControllers/RichTextEditor";
import DeletePostCommentModal from "@/components/modals/DeletePostCommentModal";
import ActionLink from "@/components/typography/ActionLink";
import RichText from "@/components/typography/RichText";
import useAuth from "@/contexts/useAuth";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import { timeAgo } from "@/helpers/dates";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import { ForumPostComment } from "@/types/forumpost";
import { HTTP_METHOD } from "@/types/api";
import { Box, Button, Stack, SxProps, Typography } from "@mui/material";
import { Formik } from "formik";
import { FC, useState } from "react";

type Props = {
  comment: ForumPostComment;
  sx?: SxProps;
  refetch: () => void;
};

type EditCommentFormValuesType = {
  content: string;
};

const CommentContent: FC<Props> = ({ comment, sx, refetch }) => {
  const { user } = useAuth();
  const [isDeleteCommentModalOpen, setIsDeleteCommentModalOpen] =
    useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { setSuccess, setError } = useSnackbarAlert();
  const authorId = comment.user.id;

  const isAuthor = user?.id === authorId;

  const { call, status } = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/forumposts/${comment.forumPostId}/comments/${comment.id}`,
    onSuccess: () => {
      setSuccess("Successfully edited your comment");
      if (refetch) {
        refetch();
      }
      setIsEditMode(false);
    },
    onError: () => {
      setError(
        "An error occurred while editing your comment. Please try again later"
      );
    },
  });

  const handleOpenDeleteModal = () => {
    setIsDeleteCommentModalOpen(true);
  };

  const handleToggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const isSoftDeleted = comment.deletedAt;

  const initialValues: EditCommentFormValuesType = {
    content: comment.content,
  };

  const handleSubmitEditComment = async (values: EditCommentFormValuesType) => {
    await call({
      comment: {
        ...values,
      },
    });
  };

  return (
    <>
      <Formik onSubmit={handleSubmitEditComment} initialValues={initialValues}>
        {(formik) => (
          <>
            <DeletePostCommentModal
              open={isDeleteCommentModalOpen}
              setOpen={setIsDeleteCommentModalOpen}
              comment={comment}
              refetch={refetch}
            />
            <Box
              width="100%"
              sx={{
                ...sx,
                py: "0.25rem",
                px: "0.5rem",
                borderRadius: "0.25rem",
                background: isEditMode ? "#F5F5F5" : "inherit",
                outline: isEditMode ? "1px solid #E0E0E0" : "none",
                ":hover": {
                  background: isEditMode ? "#F0F0F0" : "#F5F5F5",
                },
              }}
            >
              <Stack direction="row">
                <Stack
                  sx={{
                    width: "100%",
                  }}
                >
                  <Typography fontSize="1rem" fontWeight={600}>
                    {comment.user.name}
                  </Typography>
                  <Typography fontSize="0.75rem" mb="0.25rem">
                    {timeAgo(comment.createdAt)}
                  </Typography>
                  {isEditMode ? (
                    <Stack gap="0.25rem" mt="0.25rem">
                      <RichTextEditor
                        id="edit-comment-content-input"
                        name="content"
                        formik={formik}
                      />
                      <Stack direction="row" justifyContent="space-between">
                        <Button
                          id="edit-comment-post-button"
                          size="small"
                          variant="contained"
                          onClick={formik.submitForm}
                          disabled={formik.isSubmitting}
                        >
                          {isCalling(status) ? "Editing..." : "Edit"}
                        </Button>
                        <ActionLink
                          onClick={handleToggleEditMode}
                          sx={{
                            alignSelf: "end",
                          }}
                        >
                          Close
                        </ActionLink>
                      </Stack>
                    </Stack>
                  ) : (
                    <RichText
                      htmlContent={
                        isSoftDeleted
                          ? "This comment has been deleted"
                          : comment.content
                      }
                      sx={{
                        fontSize: "0.875rem",
                        ...(isSoftDeleted
                          ? {
                              fontStyle: "italic",
                              color: "gray",
                              fontWeight: "600",
                            }
                          : {}),
                      }}
                    />
                  )}
                </Stack>
                {isAuthor && !isEditMode ? (
                  <Stack direction="row" alignSelf="end" gap="0.75rem">
                    <ActionLink
                      id="edit-comment-button"
                      onClick={handleToggleEditMode}
                    >
                      Edit
                    </ActionLink>
                    <ActionLink
                      id="delete-comment-button"
                      sx={{
                        color: "#D32F2F",
                      }}
                      onClick={handleOpenDeleteModal}
                    >
                      Delete
                    </ActionLink>
                  </Stack>
                ) : null}
              </Stack>
            </Box>
          </>
        )}
      </Formik>
    </>
  );
};
export default CommentContent;
