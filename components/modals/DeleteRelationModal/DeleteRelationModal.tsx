import { Dispatch, FC, SetStateAction } from "react";
// Components
import { Stack, Button } from "@mui/material";
import Modal from "../Modal";
// Hook
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
// Types
import { Mutate } from "@/hooks/useFetch";
import { GetRelationsResponse, HTTP_METHOD } from "@/types/api";
import { EvaluationRelation } from "@/types/relations";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relation: EvaluationRelation;
  mutate: Mutate<GetRelationsResponse>;
};

const DeleteRelationModal: FC<Props> = ({
  open,
  setOpen,
  relation,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const deleteRelation = useApiCall({
    method: HTTP_METHOD.DELETE,
    endpoint: `/relations/${relation.id}`,
    onSuccess: () => {
      mutate(({ relations }) => {
        const newRelations = [...relations];
        const deleteRelationIdx = newRelations.findIndex(
          (rel) => rel.id === relation.id
        );
        newRelations.splice(deleteRelationIdx, 1);

        return { relations: newRelations };
      });
    },
  });

  const handleDelete = async () => {
    try {
      await deleteRelation.call();
      setSuccess(`You have successfully deleted the relation ${relation.id}!`);
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
        title={`Delete Relation`}
        subheader={`You are deleting relation ${relation.id}. Note that only the relation will be deleted but the teams will not be deleted.\n\nThis action is irreversible, are you sure?`}
        sx={{ width: "400px" }}
      >
        <Stack direction="row" justifyContent="space-between" marginTop="2rem">
          <Button size="small" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={isCalling(deleteRelation.status)}
          >
            Delete
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default DeleteRelationModal;
