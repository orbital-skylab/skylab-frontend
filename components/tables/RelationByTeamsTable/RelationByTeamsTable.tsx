import { FC } from "react";
// Components
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import RelationByTeamRow from "./RelationRow";
// Types
import { EvaluationRelation } from "@/types/relations";
import { groupRelationsByTeam } from "@/helpers/relations";

type Props = {
  relations: EvaluationRelation[];
  showAdviserColumn?: boolean;
  onlyViewTeamsNotSatisfyingRequirements: boolean;
};

const columnHeadings: { heading: string; align: "left" | "right" }[] = [
  { heading: "Team", align: "left" },
  { heading: "Evaluatees", align: "left" },
  { heading: "Evaluators", align: "left" },
  { heading: "Adviser", align: "left" },
];

const RelationByTeamsTable: FC<Props> = ({
  relations,
  showAdviserColumn,
  onlyViewTeamsNotSatisfyingRequirements,
}) => {
  const filteredColumnHeadings = columnHeadings.filter(({ heading }) => {
    switch (heading) {
      case "Adviser":
        return Boolean(showAdviserColumn);

      default:
        return true;
    }
  });

  const groupedRelations = groupRelationsByTeam(relations);

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {filteredColumnHeadings.map(({ heading, align }) => (
                <TableCell
                  key={heading}
                  align={align}
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {heading}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(groupedRelations).map(([id, groupedRelation]) => (
              <RelationByTeamRow
                key={id}
                groupedRelation={groupedRelation}
                showAdviserColumn={Boolean(showAdviserColumn)}
                onlyViewTeamsNotSatisfyingRequirements={
                  onlyViewTeamsNotSatisfyingRequirements
                }
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default RelationByTeamsTable;
