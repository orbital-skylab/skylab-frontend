import Attribute from "@/components/typography/Attribute";
import { StudentRole } from "@/types/roles";
import { FC } from "react";

type Props = { studentRole: StudentRole };

const StudentDetails: FC<Props> = ({ studentRole }) => {
  return (
    <>
      <Attribute attribute="Student ID" value={studentRole.id} />
      <Attribute attribute="Cohort Year" value={studentRole.cohortYear} />
      <Attribute attribute="NUSNET ID" value={studentRole.nusnetId} />
      <Attribute
        attribute="Matriculation Number"
        value={studentRole.matricNo}
      />
      <Attribute attribute="Project ID" value={studentRole.projectId} />
    </>
  );
};
export default StudentDetails;
