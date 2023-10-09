import { Dispatch, FC, SetStateAction } from "react";
// Components
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import RelationCheckmarkRow from "./RelationCheckmarkRow";
// Types
import { EvaluationRelation } from "@/types/relations";

type Props = {
  relations: EvaluationRelation[];
  showAdviserColumn?: boolean;
  selectedRelationIds: Set<number>;
  setSelectedRelationIds: Dispatch<SetStateAction<Set<number>>>;
};

const columnHeadings: { heading: string; align: "left" | "right" }[] = [
  { heading: "Relation ID", align: "left" },
  { heading: "Evaluator", align: "left" },
  { heading: "Evaluatee", align: "left" },
  { heading: "Adviser", align: "left" },
];

const RelationCheckmarkTable: FC<Props> = ({
  relations,
  showAdviserColumn,
  selectedRelationIds,
  setSelectedRelationIds,
}) => {
  const filteredColumnHeadings = columnHeadings.filter(({ heading }) => {
    switch (heading) {
      case "Adviser":
        return Boolean(showAdviserColumn);

      default:
        return true;
    }
  });

  const numSelected = selectedRelationIds.size;

  const onSelectAllClick = () => {
    if (numSelected > 0) {
      setSelectedRelationIds(new Set());
      return;
    }
    const newSelectedRelationIds = relations.map(({ id }) => id);
    setSelectedRelationIds(new Set(newSelectedRelationIds));
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={
                    relations.length > 0 && numSelected === relations.length
                  }
                  indeterminate={
                    numSelected > 0 && numSelected < relations.length
                  }
                  onChange={onSelectAllClick}
                />
              </TableCell>
              {filteredColumnHeadings.map(({ heading, align }) => (
                <TableCell key={heading} align={align}>
                  {heading}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {relations.map((relation) => (
              <RelationCheckmarkRow
                key={relation.id}
                relation={relation}
                showAdviserColumn={Boolean(showAdviserColumn)}
                selectedRelationIds={selectedRelationIds}
                setSelectedRelationIds={setSelectedRelationIds}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default RelationCheckmarkTable;
