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
        relations={[]}
      />
      <Stack direction="row" sx={{ gap: "0.5rem" }}>
        <Tooltip title="Quickly add relations by creating 'groups'">
          <Button
            id="add-relations-group-button"
            onClick={() => setIsAddRelationGroupOpen(true)}
            variant="outlined"
          >
            <Add sx={{ marginRight: "0.2rem" }} /> Relations via Group
          </Button>
        </Tooltip>
        <Tooltip title="Delete all relations linked to a team">
          <Button
            id="delete-team-relations-button"
            onClick={() => setIsDeleteRelationsViaTeamOpen(true)}
            variant="outlined"
          >
            <Delete sx={{ marginRight: "0.2rem" }} /> Relations via Team
          </Button>
        </Tooltip>
        <Button
          id="add-single-relation-button"
          onClick={() => setIsAddRelationOpen(true)}
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
