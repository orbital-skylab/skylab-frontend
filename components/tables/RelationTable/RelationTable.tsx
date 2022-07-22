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
import RelationRow from "./RelationRow";
// Types
import { Mutate } from "@/hooks/useFetch";
import { GetRelationsResponse } from "@/types/api";
import { EvaluationRelation } from "@/types/relations";
import { Project } from "@/types/projects";

type Props = {
  relations: EvaluationRelation[];
  mutate: Mutate<GetRelationsResponse>;
  projects: Project[];
  showAdviserColumn?: boolean;
};

const columnHeadings = [
  "Relation ID",
  "Evaluator",
  "Evaluatee",
  "Adviser",
  "Actions",
];

const RelationTable: FC<Props> = ({
  relations,
  mutate,
  projects,
  showAdviserColumn,
}) => {
  const filteredColumnHeadings = columnHeadings.filter((heading) => {
    switch (heading) {
      case "Adviser":
        return Boolean(showAdviserColumn);

      default:
        return true;
    }
  });

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {filteredColumnHeadings.map((heading) => (
                <TableCell key={heading}>{heading}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {relations.map((relation) => (
              <RelationRow
                key={relation.id}
                relation={relation}
                mutate={mutate}
                projects={projects}
                showAdviserColumn={Boolean(showAdviserColumn)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default RelationTable;
