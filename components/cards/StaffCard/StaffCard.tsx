import { FC } from "react";
// Libraries
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import styles from "./StaffCard.module.scss";
import { User } from "@/types/users";
import Link from "next/link";
import { PAGES } from "@/helpers/navigation";

type Props = {
  staff: User;
};

const StaffCard: FC<Props> = ({ staff }) => {
  return (
    <Card>
      <CardContent>
        <Stack spacing="0.5rem">
          <Typography variant="h5" align="center" fontWeight={600}>
            {staff.name}
          </Typography>
          <Box
            sx={{
              width: "100%",
              aspectRatio: "1 / 1",
              display: "flex",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: "50%",
              border: "1px solid black",
            }}
          >
            <img
              src={
                staff.profilePicUrl ??
                "https://secure.gravatar.com/avatar/c82a148955fb775cc59952b99503470d.png?r=PG&s=150"
              }
              alt={staff.name}
              className={styles.staffImage}
            />
          </Box>
          <Link href={`${PAGES.STAFF}/${staff.email}`} passHref>
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                width: "fit-content",
                alignSelf: "center",
              }}
            >
              View Profile
            </Button>
          </Link>
        </Stack>
      </CardContent>
    </Card>
  );
};
export default StaffCard;
