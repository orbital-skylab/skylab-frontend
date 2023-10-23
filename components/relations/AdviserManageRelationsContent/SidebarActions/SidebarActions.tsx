import AddRelationsModal from "@/components/modals/AddRelationsModal";
import AddRelationsViaGroupModal from "@/components/modals/AddRelationsViaGroupModal";
import DeleteRelationsViaTeamModal from "@/components/modals/DeleteRelationsViaTeamModal";
import DeleteSelectedRelationsModal from "@/components/modals/DeleteSelectedRelationsModal";
import { Mutate } from "@/hooks/useFetch";
import { GetRelationsResponse } from "@/types/api";
import { Project } from "@/types/projects";
import { EvaluationRelation } from "@/types/relations";
import { Delete, Add } from "@mui/icons-material";
import { Stack, Typography, Button } from "@mui/material";
import { FC, useState } from "react";

type Props = {
  selectedRelationIds?: Set<number>;
  projects: Project[];
  relations: EvaluationRelation[];
  mutateRelations: Mutate<GetRelationsResponse>;
};

const SidebarActions: FC<Props> = ({
  selectedRelationIds,
  projects,
  relations,
  mutateRelations,
}) => {
  const [isAddRelationsModalOpen, setIsAddRelationsModalOpen] = useState(false);
  const [
    isDeleteSelectedRelationsModalOpen,
    setIsDeleteSelectedRelationsModalOpen,
  ] = useState(false);
  const [isAddRelationGroupOpen, setIsAddRelationGroupOpen] = useState(false);
  const [isDeleteRelationsViaTeamOpen, setIsDeleteRelationsViaTeamOpen] =
    useState(false);

  const handleOpenAddRelationModal = () => {
    setIsAddRelationsModalOpen(true);
  };

  const handleOpenDeleteSelectedRelationsModal = () => {
    setIsDeleteSelectedRelationsModalOpen(true);
  };

  const handleOpenAddRelationGroupModal = () => {
    setIsAddRelationGroupOpen(true);
  };

  const handleOpenDeleteRelationsViaTeamModal = () => {
    setIsDeleteRelationsViaTeamOpen(true);
  };

  console.log(selectedRelationIds);

  return (
    <>
      <AddRelationsModal
        open={isAddRelationsModalOpen}
        setOpen={setIsAddRelationsModalOpen}
        projects={projects}
        mutate={mutateRelations}
      />
      {selectedRelationIds ? (
        <DeleteSelectedRelationsModal
          open={isDeleteSelectedRelationsModalOpen}
          setOpen={setIsDeleteSelectedRelationsModalOpen}
          selectedRelationIds={selectedRelationIds}
          mutate={mutateRelations}
          relations={relations}
        />
      ) : null}
      <AddRelationsViaGroupModal
        open={isAddRelationGroupOpen}
        setOpen={setIsAddRelationGroupOpen}
        projects={projects}
      />
      <DeleteRelationsViaTeamModal
        open={isDeleteRelationsViaTeamOpen}
        setOpen={setIsDeleteRelationsViaTeamOpen}
        projects={projects}
        relations={relations}
      />
      <Stack
        width="22rem"
        gap="1rem"
        position="sticky"
        top="9rem"
        alignSelf="flex-start"
      >
        <Typography fontSize="1.5rem" fontWeight="bold">
          Actions
        </Typography>
        <Stack gap="0.5rem">
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              justifyContent: "flex-start",
            }}
            onClick={handleOpenAddRelationModal}
          >
            Add relations
          </Button>
          {selectedRelationIds ? (
            <Button
              variant="contained"
              sx={{
                justifyContent: "flex-start",
              }}
              startIcon={<Delete />}
              disabled={selectedRelationIds.size === 0}
              color="error"
              onClick={handleOpenDeleteSelectedRelationsModal}
              id="delete-selected-relations-button"
            >
              Delete selected relations
            </Button>
          ) : null}
        </Stack>
        <Typography fontWeight="bold">Shortcut actions</Typography>
        <Stack gap="0.5rem">
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              justifyContent: "flex-start",
            }}
            onClick={handleOpenAddRelationGroupModal}
          >
            Add relations via group
          </Button>
          <Button
            variant="contained"
            sx={{
              justifyContent: "flex-start",
            }}
            startIcon={<Delete />}
            color="error"
            onClick={handleOpenDeleteRelationsViaTeamModal}
          >
            Delete relations via team
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
export default SidebarActions;
