import { Typography } from "@mui/material";
import { FC } from "react";

type Props = {
  onClick: () => void;
};

const ActionLink: FC<Props> = ({ children, onClick }) => {
  return (
    <>
      <Typography
        color="blue"
        fontSize="0.75rem"
        fontWeight="600"
        sx={{ cursor: "pointer", ":hover": { textDecoration: "underline" } }}
        onClick={onClick}
      >
        {children}
      </Typography>
    </>
  );
};
export default ActionLink;
