import { AdviserRole } from "@/types/roles";
import { Box, Typography } from "@mui/material";
import { FC } from "react";

type Props = { adviserRole: AdviserRole };

const AdviserDetails: FC<Props> = ({ adviserRole }) => {
  return (
    <>
      <Box>
        <Typography>{`Adviser ID: ${adviserRole.id}`}</Typography>
        <Typography>{`Cohort Year: ${adviserRole.cohortYear}`}</Typography>
        <Typography>{`NUSNET ID: ${adviserRole.nusnetId}`}</Typography>
        <Typography>{`Matriculation Number: ${adviserRole.matricNo}`}</Typography>
        <Typography>{`Projects:`}</Typography>
        {adviserRole.projectIds.map((projectId) => (
          <Typography key={projectId}>{projectId}</Typography>
        ))}
      </Box>
    </>
  );
};
export default AdviserDetails;
