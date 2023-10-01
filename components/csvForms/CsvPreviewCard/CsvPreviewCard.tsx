import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { CSVLink } from "react-csv";
import { FC, useState } from "react";

type Props = {
  templateFileTitle: string;
  csvTemplateHeaders: string[][];
  csvTemplateDescription: Record<
    string,
    { description: string; example: string }
  >;
};

const CsvPreviewCard: FC<Props> = ({
  templateFileTitle,
  csvTemplateHeaders,
  csvTemplateDescription,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const headers = csvTemplateHeaders[0];

  return (
    <Card>
      <CardContent sx={{ display: "grid", placeItems: "center" }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <CSVLink
            data={csvTemplateHeaders}
            filename={templateFileTitle}
            style={{ textDecoration: "none" }}
          >
            <Typography
              sx={{
                textAlign: "center",
                textDecoration: "underline",
                fontSize: "1rem",
                color: "blue",
              }}
            >
              Download CSV Template
            </Typography>
          </CSVLink>
          <Divider>
            <Typography>OR</Typography>
          </Divider>
          <Button
            sx={{
              width: "fit-content",
              mx: "auto",
            }}
            variant="contained"
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
          >
            {isPreviewOpen ? "Close preview" : "Preview CSV data fields"}
          </Button>
          {isPreviewOpen ? (
            <Table size="small">
              <TableHead
                sx={{
                  background: "#f0f0f0",
                }}
              >
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>CSV Heading</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Example</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {headers.map((header) => (
                  <TableRow key={header}>
                    <TableCell>{header}</TableCell>
                    <TableCell>
                      {csvTemplateDescription[header].description}
                    </TableCell>
                    <TableCell>
                      {csvTemplateDescription[header].example}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </Box>
      </CardContent>
    </Card>
  );
};
export default CsvPreviewCard;
