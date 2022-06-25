import { User } from "@/types/users";
import { Box, Typography } from "@mui/material";
import { FC } from "react";

type Props = { user: User };

const UserDetails: FC<Props> = ({ user }) => {
  return (
    <>
      <Box>
        <Typography>{`User ID: ${user.id}`}</Typography>
        <Typography>{`Name: ${user.name}`}</Typography>
        <Typography>{`Email: ${user.email}`}</Typography>
      </Box>
    </>
  );
};
export default UserDetails;
