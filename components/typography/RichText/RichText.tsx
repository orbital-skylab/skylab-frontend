import { SxProps, Typography } from "@mui/material";
import { FC } from "react";
import parse from "html-react-parser";

type Props = {
  sx?: SxProps;
  htmlContent: string;
};

const RichText: FC<Props> = ({ sx, htmlContent }) => {
  return (
    <Typography component="span" sx={sx}>
      {parse(htmlContent)}
    </Typography>
  );
};
export default RichText;
