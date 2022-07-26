import { FC, useState } from "react";
// Components
import { Button, Stack, Tooltip } from "@mui/material";
import AddRelationModal from "@/components/modals/AddRelationModal";
import { Add, Delete } from "@mui/icons-material";
import AddRelationsViaGroupModal from "@/components/modals/AddRelationsViaGroupModal";
import DeleteRelationsViaTeamModal from "@/components/modals/DeleteRelationsViaTeamModal";
// Types
import { Mutate } from "@/hooks/useFetch";
import { GetRelationsResponse } from "@/types/api";
import { Project } from "@/types/projects";

type Props = {
  projects: Project[];
  mutate: Mutate<GetRelationsResponse>;
};

const ActionButtons: FC<Props> = ({ projects, mutate }) => {
  const [isAddRelationOpen, setIsAddRelationOpen] = useState(false);
  const [isAddRelationGroupOpen, setIsAddRelationGroupOpen] = useState(false);
  const [isDeleteRelationsViaTeamOpen, setIsDeleteRelationsViaTeamOpen] =
    useState(false);

  const handleOpenAddRelationModal = () => {
    setIsAddRelationOpen(true);
  };

  const handleOpenAddRelationGroupModal = () => {
    setIsAddRelationGroupOpen(true);
  };

  const handleOpenDeleteRelationsViaTeamModal = () => {
    setIsDeleteRelationsViaTeamOpen(true);
  };

  return (
    <>
      <AddRelationModal
        open={isAddRelationOpen}
        setOpen={setIsAddRelationOpen}
        mutate={mutate}
        projects={projects}
      />
      <AddRelationsViaGroupModal
        open={isAddRelationGroupOpen}
        setOpen={setIsAddRelationGroupOpen}
        projects={projects}
      />
      <DeleteRelationsViaTeamModal
        open={isDeleteRelationsViaTeamOpen}
        setOpen={setIsDeleteRelationsViaTeamOpen}
        projects={projects}
      />
      <Stack direction="row" sx={{ gap: "0.5rem" }}>
        <Tooltip title="Quickly add relations by creating 'groups'">
          <Button onClick={handleOpenAddRelationGroupModal} variant="outlined">
            <Add sx={{ marginRight: "0.2rem" }} /> Relations via Group
          </Button>
        </Tooltip>
        <Tooltip title="Delete all relations linked to a team">
          <Button
            onClick={handleOpenDeleteRelationsViaTeamModal}
            variant="outlined"
          >
            <Delete sx={{ marginRight: "0.2rem" }} /> Relations via Team
          </Button>
        </Tooltip>
        <Button
          onClick={handleOpenAddRelationModal}
          variant="outlined"
          sx={{ marginLeft: "auto" }}
        >
          <Add sx={{ marginRight: "0.2rem" }} /> Relation
        </Button>
      </Stack>
    </>
  );
};
export default ActionButtons;
