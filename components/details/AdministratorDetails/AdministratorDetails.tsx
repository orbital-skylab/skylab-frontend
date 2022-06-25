import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
import { AdministratorRole } from "@/types/roles";
import { Box, Typography } from "@mui/material";
import { FC } from "react";

type Props = { administratorRole: AdministratorRole };

const AdministratorDetails: FC<Props> = ({ administratorRole }) => {
  return (
    <>
      <Box>
        <Typography>{`Administrator ID: ${administratorRole.id}`}</Typography>
        <Typography>{`Start Date: ${isoDateToLocaleDateWithTime(
          administratorRole.startDate
        )}`}</Typography>
        <Typography>{`End Date: ${isoDateToLocaleDateWithTime(
          administratorRole.endDate
        )}`}</Typography>
      </Box>
    </>
  );
};
export default AdministratorDetails;
