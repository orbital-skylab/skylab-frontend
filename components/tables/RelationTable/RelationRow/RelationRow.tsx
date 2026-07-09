import { FC, useState } from "react";
// Components
import HoverLink from "@/components/typography/HoverLink";
import DeleteRelationModal from "@/components/modals/DeleteRelationModal";
import { Box, Button, Stack, TableCell, TableRow } from "@mui/material";
import EditRelationModal from "@/components/modals/EditRelationModal";
// Helpers
import { PAGES } from "@/helpers/navigation";
// Types
import { Mutate } from "@/hooks/useFetch";
import { BASE_TRANSITION } from "@/styles/constants";
import { GetRelationsResponse } from "@/types/api";
import { EvaluationRelation } from "@/types/relations";
import { Project } from "@/types/projects";

type Props = {
  relation: EvaluationRelation;
  mutate: Mutate<GetRelationsResponse>;
  projects: Project[];
  showAdviserColumn: boolean;
};

const RelationRow: FC<Props> = ({
  relation,
  mutate,
  projects,
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

  const renderProjectLink = (project: Project) => (
    <Box
      key={project.id}
      sx={{ color: project.hasDropped ? "red" : "inherit" }}
    >
      <HoverLink href={`${PAGES.PROJECTS}/${project.id}`}>
        {project.name}
      </HoverLink>
    </Box>
  );

  return (
    <>
      <EditRelationModal
        open={isEditRelationOpen}
        setOpen={setIsEditRelationOpen}
        relation={relation}
        mutate={mutate}
        projects={projects}
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
          {relation.fromProject && renderProjectLink(relation.fromProject)}
        </TableCell>
        <TableCell>
          {relation.toProject && renderProjectLink(relation.toProject)}
        </TableCell>
        {showAdviserColumn && (
          <TableCell>
            {relation.adviser && (
              <HoverLink href={`${PAGES.USERS}/${relation.adviser.id}`}>
                {relation.adviser.name}
              </HoverLink>
            )}
          </TableCell>
        )}
        <TableCell align="right">
          <Stack direction="row" justifyContent="end" spacing="0.5rem">
            <Button id="edit-relation-button" onClick={handleOpenEditModal}>
              Edit
            </Button>
            <Button
              id="delete-relation-button"
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
