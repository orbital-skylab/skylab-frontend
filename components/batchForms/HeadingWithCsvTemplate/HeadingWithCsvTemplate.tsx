import { HelpOutline } from "@mui/icons-material";
import { Stack, Typography, Tooltip, Button } from "@mui/material";
import { FC } from "react";
import { CSVLink } from "react-csv";

type Props = {
  title: string;
  tooltipText: string;
  csvTemplateHeaders: string[][];
};

const HeadingWithCsvTemplate: FC<Props> = ({
  title,
  tooltipText,
  csvTemplateHeaders,
}) => {
  const filename = `${title.toLowerCase().replaceAll(" ", "-")}-csv-template`;

  return (
    <Stack
      direction="row"
      marginBottom="0.5rem"
      alignItems="center"
      spacing="0.5rem"
    >
      <Typography variant="h6">{title}</Typography>
      <Tooltip title={tooltipText}>
        <HelpOutline fontSize="small" />
      </Tooltip>
      <CSVLink
        data={csvTemplateHeaders}
        filename={filename}
        style={{ textDecoration: "none", marginLeft: "auto" }}
      >
        <Tooltip title="Download CSV Template">
          <Button color="info">CSV Template</Button>
        </Tooltip>
      </CSVLink>
    </Stack>
  );
};
export default HeadingWithCsvTemplate;
