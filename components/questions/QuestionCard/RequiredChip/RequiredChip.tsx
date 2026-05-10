import { PriorityHigh } from "@mui/icons-material";
import { Chip, Tooltip } from "@mui/material";
import { FC } from "react";

const RequiredChip: FC = () => {
  return (
    <Tooltip title="This question is required, meaning the receiver must answer it before submitting.">
      <Chip
        icon={<PriorityHigh />}
        label="Required"
        size="small"
        color="primary"
        variant="outlined"
      />
    </Tooltip>
  );
};
export default RequiredChip;
