import { Dispatch, FC, SetStateAction } from "react";
import Modal from "../Modal";
import { Button, Stack } from "@mui/material";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import { HTTP_METHOD } from "@/types/api";
import { Mutate } from "@/hooks/useFetch";
import { ForumPost } from "@/types/forumpost";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  forumpost: ForumPost;
  mutate: Mutate<ForumPost[]>;
};

const DeleteForumPostModal: FC<Props> = ({
  open,
  setOpen,
  forumpost,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const deleteForumPost = useApiCall({
    method: HTTP_METHOD.DELETE,
    endpoint: `/forumposts/${forumpost.id}`,
    onSuccess: () => {
      mutate((previousPosts) => {
        const updatedPosts = previousPosts.filter(
          (post) => post.id !== forumpost.id
        );
        return updatedPosts;
      });
    },
  });

  const handleDelete = async () => {
    try {
      await deleteForumPost.call();
      setSuccess(`You have successfully deleted the post ${forumpost.title}!`);
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
        title={`Delete Post`}
        subheader={`You are deleting the post "${forumpost.title}".\n\nThis action is irreversible, are you sure?`}
        sx={{ width: "400px" }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Button size="small" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            id="delete-announcement-confirm-button"
            size="small"
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={isCalling(deleteForumPost.status)}
          >
            Delete
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
export default DeleteForumPostModal;
