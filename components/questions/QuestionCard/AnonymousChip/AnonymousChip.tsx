import { AdminPanelSettings } from "@mui/icons-material";
import { Chip, Tooltip } from "@mui/material";
import { FC } from "react";

const AnonymousChip: FC = () => {
  return (
    <Tooltip title="This question is anonymous, meaning the receiving party will not know the submitter.">
      <Chip
        icon={<AdminPanelSettings />}
        label="Anonymous"
        size="small"
        color="primary"
        variant="outlined"
      />
    </Tooltip>
  );
};
export default AnonymousChip;
