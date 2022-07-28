import Attribute from "@/components/typography/Attribute";
import { MentorRole } from "@/types/roles";
import { FC } from "react";

type Props = { mentorRole: MentorRole };

const MentorDetails: FC<Props> = ({ mentorRole }) => {
  return (
    <>
      <Attribute attribute="Mentor ID" value={mentorRole.id} />
      <Attribute attribute="Cohort Year" value={mentorRole.cohortYear} />
      <Attribute attribute="Teams IDs" value={mentorRole.teamIds} />
    </>
  );
};
export default MentorDetails;
