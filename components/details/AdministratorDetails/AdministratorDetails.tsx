import Attribute from "@/components/typography/Attribute";
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
import { AdministratorRole } from "@/types/roles";
import { FC } from "react";

type Props = { administratorRole: AdministratorRole };

const AdministratorDetails: FC<Props> = ({ administratorRole }) => {
  return (
    <>
      <Attribute attribute="Administrator ID" value={administratorRole.id} />
      <Attribute
        attribute="Start Date"
        value={isoDateToLocaleDateWithTime(administratorRole.startDate)}
      />
      <Attribute
        attribute="End Date"
        value={isoDateToLocaleDateWithTime(administratorRole.endDate)}
      />
    </>
  );
};
export default AdministratorDetails;
