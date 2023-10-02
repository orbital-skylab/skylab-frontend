import { Dispatch, FC, SetStateAction } from "react";
// Components
import Modal from "../Modal";
import { Button, Stack } from "@mui/material";
// Hooks
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
// Types
import { HTTP_METHOD, GetCohortsResponse } from "@/types/api";
import { Mutate } from "@/hooks/useFetch";
import { Cohort } from "@/types/cohorts";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  cohort: Cohort;
  mutate: Mutate<GetCohortsResponse>;
};

const DeleteCohortModal: FC<Props> = ({ open, setOpen, cohort, mutate }) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const deleteCohort = useApiCall({
    method: HTTP_METHOD.DELETE,
    endpoint: `/cohorts/${cohort.academicYear}`,
    onSuccess: () => {
      mutate((data) => {
        const oldCohortAcademicYear = cohort.academicYear;
        const oldCohortIdx = data.cohorts.findIndex(
          (cohort) => cohort.academicYear === oldCohortAcademicYear
        );
        const newCohorts = [...data.cohorts];
        newCohorts.splice(oldCohortIdx, 1);
        return { cohorts: newCohorts };
      });
    },
  });

  const handleDelete = async () => {
    try {
      await deleteCohort.call();
      setSuccess(
        `You have successfully deleted the cohort ${cohort.academicYear}!`
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
        title={`Delete Cohort`}
        subheader={`You are deleting the cohort ${cohort.academicYear}.\n\nThis action is irreversible, are you sure?`}
        sx={{ width: "400px" }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Button size="small" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            id="confirm-delete-cohort-modal"
            size="small"
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={isCalling(deleteCohort.status)}
          >
            Delete
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
export default DeleteCohortModal;
