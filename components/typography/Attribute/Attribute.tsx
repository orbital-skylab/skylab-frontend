import { isArray } from "@/helpers/types";
import { Box, Typography } from "@mui/material";
import { FC } from "react";

type Props = {
  attribute: string;
  value: string | number | string[] | number[];
};

/**
 * Renders an attribute and its value(s)
 * (eg. ID: 1)
 */
const Attribute: FC<Props> = ({ attribute, value }) => {
  return (
    <Typography variant="subtitle2">
      {attribute}
      {": "}
      {isArray(value) ? (
        <Box component="span" sx={{ color: "secondary.main" }}>
          {value.join(", ")}
        </Box>
      ) : (
        <Box component="span" sx={{ color: "secondary.main" }}>
          {value}
        </Box>
      )}
    </Typography>
  );
};
export default Attribute;
