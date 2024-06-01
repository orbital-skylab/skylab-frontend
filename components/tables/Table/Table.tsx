import {
  TableContainer,
  TableHead,
  Table as MUITable,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { FC } from "react";

type Props = {
  id?: string;
  headings: { heading: string; align: "left" | "right" }[];
  rows: JSX.Element[];
};

/**
 * Wrapper component to manage all the table logic while using the MUI Table component under the hood
 */
const Table: FC<Props> = ({ id, headings, rows }) => {
  return (
    <TableContainer id={id}>
      <MUITable>
        <TableHead>
          <TableRow>
            {headings.map(({ heading, align }) => (
              <TableCell key={heading} align={align}>
                {heading}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>{rows}</TableBody>
      </MUITable>
    </TableContainer>
  );
};
export default Table;
