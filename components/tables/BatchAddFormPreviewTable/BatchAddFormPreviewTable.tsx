import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { FC } from "react";

type Props = {
  previewData: Record<string, string | number>[];
};

const BatchAddFormPreviewTable: FC<Props> = ({ previewData }) => {
  return (
    <>
      <Box
        sx={{
          overflow: "scroll",
          maxHeight: "40rem",
        }}
      >
        <Table
          stickyHeader
          size="small"
          sx={{
            width: "100%",
          }}
        >
          <TableHead>
            <TableRow>
              {Object.keys(previewData[0]).map((header, index) => (
                <TableCell key={index}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {previewData.map((row, index) => (
              <TableRow key={index}>
                {Object.values(row).map((value, index) => (
                  <TableCell key={index}>{value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </>
  );
};
export default BatchAddFormPreviewTable;
