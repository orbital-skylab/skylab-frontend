import { Dispatch, FC, SetStateAction, useState } from "react";
import Modal from "../Modal";
import { Button, Stack, Typography } from "@mui/material";
import { Project } from "@/types/projects";
import { generateRoundRobinRelations } from "@/helpers/relations";
import PreviewRelationsTable from "@/components/tables/PreviewRelationsTable/PreviewRelationsTable";
import useApiCall from "@/hooks/useApiCall";
import { HTTP_METHOD, CreateRelationResponse } from "@/types/api";
import { Mutate } from "@/hooks/useFetch";
import { GetRelationsResponse } from "@/types/api";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  projects: Project[];
  mutate: Mutate<GetRelationsResponse>;
};

const CreateAutomaticallyModal: FC<Props> = ({
  open,
  setOpen,
  projects,
  mutate,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleCloseModal = () => setOpen(false);
  const { setSuccess, setError } = useSnackbarAlert();

  const addRelation = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/relations`,
    onSuccess: ({ relation }: CreateRelationResponse) => {
      mutate(({ relations }) => {
        const newRelations = [...relations, relation];
        return { relations: newRelations };
      });
    },
  });

  const generatedRelations = generateRoundRobinRelations(projects);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await Promise.all(
        generatedRelations.map(async (relation) => {
          const processedValues = {
            relation: {
              fromProjectId: relation.fromProjectId,
              toProjectId: relation.toProjectId,
            },
          };

          return await addRelation.call(processedValues);
        })
      );
      // Sort the relations by fromProjectId asc and then toProjectId asc
      mutate(({ relations }) => {
        return {
          relations: relations.sort((a, b) => {
            if (a.fromProjectId === b.fromProjectId) {
              return a.toProjectId - b.toProjectId;
            }
            return a.fromProjectId - b.fromProjectId;
          }),
        };
      });
      setSuccess(
        `You have successfully created ${generatedRelations.length} new relations!`
      );
      handleCloseModal();
    } catch (error) {
      setError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      handleClose={handleCloseModal}
      title={`Create Automatically`}
      subheader={`This will create an evaluation relation from each team to the next three teams.\n\ne.g.\nTeam A will evaluate Team B, C, and D\nTeam B will evaluate Team C, D, and E`}
    >
      <Typography
        sx={{ marginBottom: "0.5rem" }}
        fontWeight="bold"
      >{`Relations that will be created (${generatedRelations.length})`}</Typography>
      <PreviewRelationsTable relations={generatedRelations} />
      <Stack direction="row" justifyContent="space-between" marginTop="2rem">
        <Button size="small" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          Add relations
        </Button>
      </Stack>
    </Modal>
  );
};

export default CreateAutomaticallyModal;
