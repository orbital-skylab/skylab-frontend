import { FC, useState } from "react";
// Components
import HoverLink from "@/components/typography/HoverLink";
import DeleteRelationModal from "@/components/modals/DeleteRelationModal";
import { Button, Stack, TableCell, TableRow } from "@mui/material";
import EditRelationModal from "@/components/modals/EditRelationModal";
// Helpers
import { PAGES } from "@/helpers/navigation";
// Types
import { Mutate } from "@/hooks/useFetch";
import { BASE_TRANSITION } from "@/styles/constants";
import { GetRelationsResponse } from "@/types/api";
import { EvaluationRelation } from "@/types/relations";
import { Team } from "@/types/teams";

type Props = {
  relation: EvaluationRelation;
  mutate: Mutate<GetRelationsResponse>;
  teams: Team[];
  showAdviserColumn: boolean;
};

const RelationRow: FC<Props> = ({
  relation,
  mutate,
  teams,
  showAdviserColumn,
}) => {
  const [isEditRelationOpen, setIsEditRelationOpen] = useState(false);
  const [isDeleteRelationOpen, setIsDeleteRelationOpen] = useState(false);

  const handleOpenEditModal = () => {
    setIsEditRelationOpen(true);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteRelationOpen(true);
  };

  return (
    <>
      <EditRelationModal
        open={isEditRelationOpen}
        setOpen={setIsEditRelationOpen}
        relation={relation}
        mutate={mutate}
        teams={teams}
      />
      <DeleteRelationModal
        open={isDeleteRelationOpen}
        setOpen={setIsDeleteRelationOpen}
        relation={relation}
        mutate={mutate}
      />
      <TableRow>
        <TableCell>{relation.id}</TableCell>
        <TableCell>
          <HoverLink href={`${PAGES.TEAMS}/${relation.fromTeamId}`}>
            {relation.fromTeam?.name}
          </HoverLink>
        </TableCell>
        <TableCell>
          <HoverLink href={`${PAGES.TEAMS}/${relation.toTeamId}`}>
            {relation.toTeam?.name}
          </HoverLink>
        </TableCell>
        {showAdviserColumn && (
          <TableCell>
            {relation.adviser && (
              <HoverLink href={`${PAGES.USERS}/${relation.adviser.adviserId}`}>
                {relation.adviser.name}
              </HoverLink>
            )}
          </TableCell>
        )}
        <TableCell align="right">
          <Stack direction="row" justifyContent="end" spacing="0.5rem">
            <Button onClick={handleOpenEditModal}>Edit</Button>
            <Button
              onClick={handleOpenDeleteModal}
              sx={{
                transition: BASE_TRANSITION,
                "&:hover": {
                  backgroundColor: "error.main",
                  color: "white",
                },
              }}
            >
              Delete
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
};

export default RelationRow;
