import { Dispatch, FC, SetStateAction } from "react";
// Components
import HoverLink from "@/components/typography/HoverLink";
import { Box, Checkbox, TableCell, TableRow } from "@mui/material";
// Helpers
import { PAGES } from "@/helpers/navigation";
// Types
import { EvaluationRelation } from "@/types/relations";
import { Project } from "@/types/projects";

type Props = {
  relation: EvaluationRelation;
  showAdviserColumn: boolean;
  selectedRelationIds: Set<number>;
  setSelectedRelationIds: Dispatch<SetStateAction<Set<number>>>;
};

const RelationCheckmarkRow: FC<Props> = ({
  relation,
  showAdviserColumn,
  selectedRelationIds,
  setSelectedRelationIds,
}) => {
  const isItemSelected = selectedRelationIds.has(relation.id);

  const toggleSelected = () => {
    setSelectedRelationIds((prevSelectedRelationIds) => {
      const newSet = new Set(prevSelectedRelationIds);
      if (newSet.has(relation.id)) {
        newSet.delete(relation.id);
      } else {
        newSet.add(relation.id);
      }
      return newSet;
    });
  };

  const renderProjectLink = (project: Project) => (
    <Box
      key={project.id}
      component="span"
      sx={{ color: project.hasDropped ? "red" : "inherit" }}
    >
      <HoverLink href={`${PAGES.PROJECTS}/${project.id}`}>
        {project.teamName}
      </HoverLink>
    </Box>
  );

  return (
    <>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="info"
            checked={isItemSelected}
            onClick={toggleSelected}
          />
        </TableCell>
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
      </TableRow>
    </>
  );
};

export default RelationCheckmarkRow;
