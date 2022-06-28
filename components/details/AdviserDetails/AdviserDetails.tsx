import Attribute from "@/components/typography/Attribute";
import { AdviserRole } from "@/types/roles";
import { FC } from "react";

type Props = { adviserRole: AdviserRole };

const AdviserDetails: FC<Props> = ({ adviserRole }) => {
  return (
    <>
      <Attribute attribute="Adviser ID" value={adviserRole.id} />
      <Attribute attribute="Cohort Year" value={adviserRole.cohortYear} />
      <Attribute attribute="NUSNET ID" value={adviserRole.nusnetId} />
      <Attribute
        attribute="Matriculation Number"
        value={adviserRole.matricNo}
      />
      <Attribute attribute="Projects" value={adviserRole.projectIds} />
    </>
  );
};
export default AdviserDetails;
