import Body from "@/components/layout/Body";
import { UploadFile } from "@mui/icons-material";
import { Box, Card, CardContent, Input, Typography } from "@mui/material";
import type { NextPage } from "next";

const BatchAdd: NextPage = () => {
  return (
    <Body>
      <Typography variant="h6" mb="0.5rem">
        Batch Add Students
      </Typography>
      <Card>
        <CardContent sx={{ display: "grid", placeItems: "center" }}>
          <Box
            component="label"
            sx={{
              cursor: "pointer",
              width: "100%",
              height: "100%",
              background: "gray",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Drag and drop a CSV, XLS or XLSX spreadsheet here or click
            <UploadFile />
            <Input
              type="file"
              inputProps={{
                accept:
                  ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
              }}
              sx={{ display: "none" }}
            />
          </Box>
        </CardContent>
      </Card>
    </Body>
  );
};
export default BatchAdd;
