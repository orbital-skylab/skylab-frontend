import { EvaluationRelation } from "@/types/relations";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FC } from "react";

type Props = {
  relations: Partial<EvaluationRelation>[];
};

const PreviewRelationsTable: FC<Props> = ({ relations }) => {
  if (!relations.length) {
    return <Typography>No relations found</Typography>;
  }

  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                }}
              >
                Evaluator
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                }}
                align="right"
              >
                Evaluatee
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {relations.map((relation, idx) => (
              <TableRow key={idx}>
                <TableCell>{relation.fromProject?.teamName}</TableCell>
                <TableCell align="right">
                  {relation.toProject?.teamName}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
export default PreviewRelationsTable;
