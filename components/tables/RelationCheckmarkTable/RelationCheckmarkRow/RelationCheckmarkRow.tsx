import { Dispatch, FC, SetStateAction } from "react";
// Components
import HoverLink from "@/components/typography/HoverLink";
import { Checkbox, TableCell, TableRow } from "@mui/material";
// Helpers
import { PAGES } from "@/helpers/navigation";
// Types
import { EvaluationRelation } from "@/types/relations";

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
          <HoverLink href={`${PAGES.PROJECTS}/${relation.fromProjectId}`}>
            {relation.fromProject?.teamName}
          </HoverLink>
        </TableCell>
        <TableCell>
          <HoverLink href={`${PAGES.PROJECTS}/${relation.toProjectId}`}>
            {relation.toProject?.teamName}
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
      </TableRow>
    </>
  );
};

export default RelationCheckmarkRow;
