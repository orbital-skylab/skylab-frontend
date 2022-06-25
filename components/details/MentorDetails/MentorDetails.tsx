import { MentorRole } from "@/types/roles";
import { Box, Typography } from "@mui/material";
import { FC } from "react";

type Props = { mentorRole: MentorRole };

const MentorDetails: FC<Props> = ({ mentorRole }) => {
  return (
    <>
      <Box>
        <Typography>{`Mentor ID: ${mentorRole.id}`}</Typography>
        <Typography>{`Cohort Year: ${mentorRole.cohortYear}`}</Typography>
        <Typography>{`Projects:`}</Typography>
        {mentorRole.projectIds.map((projectId) => (
          <Typography key={projectId}>{projectId}</Typography>
        ))}
      </Box>
    </>
  );
};
export default MentorDetails;
