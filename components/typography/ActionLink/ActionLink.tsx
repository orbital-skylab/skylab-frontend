import { SxProps, Typography } from "@mui/material";
import { FC } from "react";

type Props = {
  onClick: () => void;
  sx?: SxProps;
};

const ActionLink: FC<Props> = ({ children, onClick, sx }) => {
  return (
    <>
      <Typography
        color="blue"
        fontSize="0.75rem"
        fontWeight="600"
        sx={{
          cursor: "pointer",
          ":hover": { textDecoration: "underline" },
          ...sx,
        }}
        onClick={onClick}
      >
        {children}
      </Typography>
    </>
  );
};
export default ActionLink;
