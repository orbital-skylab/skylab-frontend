import { Dispatch, FC, SetStateAction } from "react";
// Components
import Modal from "../Modal";
import { Button, Stack } from "@mui/material";
// Hooks
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
// Types
import { HTTP_METHOD, GetAnnouncementsResponse } from "@/types/api";
import { Mutate } from "@/hooks/useFetch";
import { Announcement } from "@/types/announcements";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  announcement: Announcement;
  mutate: Mutate<GetAnnouncementsResponse>;
};

const DeleteAnnouncementModal: FC<Props> = ({
  open,
  setOpen,
  announcement,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const deleteAnnouncement = useApiCall({
    method: HTTP_METHOD.DELETE,
    endpoint: `/announcements/${announcement.id}`,
    onSuccess: () => {
      mutate((data) => {
        const oldAnnouncementIdx = data.announcements.findIndex(
          (oldAnnouncement) => oldAnnouncement.id === announcement.id
        );
        const newAnnouncements = [...data.announcements];
        newAnnouncements.splice(oldAnnouncementIdx, 1);
        return { announcements: newAnnouncements };
      });
    },
  });

  const handleDelete = async () => {
    try {
      await deleteAnnouncement.call();
      setSuccess(
        `You have successfully deleted the announcement ${announcement.title}!`
      );
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
        title={`Delete Announcement`}
        subheader={`You are deleting the announcement ${announcement.title}.\n\nThis action is irreversible, are you sure?`}
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
            disabled={isCalling(deleteAnnouncement.status)}
          >
            Delete
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
export default DeleteAnnouncementModal;
