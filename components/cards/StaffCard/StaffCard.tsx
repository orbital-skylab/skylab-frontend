import { FC } from "react";
// Libraries
import { Box, Stack, Typography } from "@mui/material";
import styles from "./StaffCard.module.scss";
import { User } from "@/types/users";

type Props = {
  staff: User;
};

const StaffCard: FC<Props> = ({ staff }) => {
  return (
    <Stack>
      <Typography variant="h6" align="center">
        {staff.name}
      </Typography>
      <Box
        sx={{
          width: "100%",
          aspectRatio: "3 / 4",
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius: "0.5rem",
        }}
      >
        <img
          src={staff.profilePicUrl}
          alt={staff.name}
          className={styles.staffImage}
        />
      </Box>
    </Stack>
  );
};
export default StaffCard;
