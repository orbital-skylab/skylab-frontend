import { StudentRole } from "@/types/roles";
import { Box, Typography } from "@mui/material";
import { FC } from "react";

type Props = { studentRole: StudentRole };

const StudentDetails: FC<Props> = ({ studentRole }) => {
  return (
    <>
      <Box>
        <Typography>{`Student ID: ${studentRole.id}`}</Typography>
        <Typography>{`Cohort Year: ${studentRole.cohortYear}`}</Typography>
        <Typography>{`NUSNET ID: ${studentRole.nusnetId}`}</Typography>
        <Typography>{`Matriculation Number: ${studentRole.matricNo}`}</Typography>
        <Typography>{`Project ID: ${studentRole.projectId}`}</Typography>
      </Box>
    </>
  );
};
export default StudentDetails;
