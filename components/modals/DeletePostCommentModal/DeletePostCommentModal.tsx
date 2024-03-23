import { Dispatch, FC, SetStateAction } from "react";
// Components
import Modal from "../Modal";
import { Button, Stack } from "@mui/material";
// Hooks
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
// Types
import { HTTP_METHOD } from "@/types/api";
import { ForumPostComment } from "@/types/forumpost";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  comment: ForumPostComment;
  refetch: () => void;
};

const DeletePostCommentModal: FC<Props> = ({
  open,
  setOpen,
  comment,
  refetch,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const deleteComment = useApiCall({
    method: HTTP_METHOD.DELETE,
    endpoint: `/forumposts/${comment.forumPostId}/comments/${comment.id}`,
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = async () => {
    try {
      await deleteComment.call();
      setSuccess(`You have successfully deleted your comment!`);
      handleCloseModal();
    } catch (error) {
      setError(error);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        handleClose={handleCloseModal}
        title={`Delete Comment`}
        subheader={`You are deleting your comment.\n\nThis action is irreversible, are you sure?`}
        sx={{ width: "400px" }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Button size="small" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            id="delete-comment-confirm-button"
            size="small"
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={isCalling(deleteComment.status)}
          >
            Delete
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
export default DeletePostCommentModal;
