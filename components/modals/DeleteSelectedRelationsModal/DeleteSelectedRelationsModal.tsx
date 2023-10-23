import { Dispatch, FC, SetStateAction, useState } from "react";
// Components
import { Stack, Button, Typography } from "@mui/material";
import Modal from "../Modal";
// Hook
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
// Types
import { Mutate } from "@/hooks/useFetch";
import { GetRelationsResponse, HTTP_METHOD } from "@/types/api";
import { ApiServiceBuilder } from "@/helpers/api";
import PreviewRelationsTable from "@/components/tables/PreviewRelationsTable/PreviewRelationsTable";
import { EvaluationRelation } from "@/types/relations";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedRelationIds: Set<number>;
  relations: EvaluationRelation[];
  mutate: Mutate<GetRelationsResponse>;
};

const DeleteSelectedRelationsModal: FC<Props> = ({
  open,
  setOpen,
  selectedRelationIds,
  relations,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();
  const [isCalling, setIsCalling] = useState(false);

  const handleDelete = async () => {
    try {
      setIsCalling(true);
      await Promise.all(
        Array.from(selectedRelationIds).map(async (id) => {
          /* API service is used instead of hook because the endpoint is not constant. */
          const apiServiceBuilder = new ApiServiceBuilder({
            method: HTTP_METHOD.DELETE,
            endpoint: `/relations/${id}`,
            requiresAuthorization: true,
          });
          const apiService = apiServiceBuilder.build();
          await apiService();
        })
      );
      setSuccess(
        `You have successfully deleted ${selectedRelationIds.size} relation${
          selectedRelationIds.size !== 1 ? "s" : ""
        }!`
      );
      mutate(({ relations }) => {
        const newRelations = [...relations];
        return {
          relations: newRelations.filter(
            (rel) => !selectedRelationIds.has(rel.id)
          ),
        };
      });
      handleCloseModal();
    } catch (error) {
      setError(error);
    } finally {
      setIsCalling(false);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const relationsToDelete = relations.filter((relation) =>
    selectedRelationIds.has(relation.id)
  );

  return (
    <>
      <Modal
        open={open}
        handleClose={handleCloseModal}
        title={`Delete Selected Relations`}
        sx={{ width: "400px" }}
      >
        <Typography
          sx={{ marginBottom: "0.5rem" }}
          fontWeight="bold"
        >{`Relations that will be deleted (${selectedRelationIds.size})`}</Typography>
        <PreviewRelationsTable relations={relationsToDelete} />
        <Stack direction="row" justifyContent="space-between" marginTop="2rem">
          <Button size="small" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            id="confirm-delete-selected-relations-button"
            size="small"
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={isCalling}
          >
            Delete
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default DeleteSelectedRelationsModal;
