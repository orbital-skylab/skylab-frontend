/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO:
import { Mutate } from "@/hooks/useFetch";
import { AdviserRole } from "@/types/roles";
import { User } from "@/types/users";
import { Chip } from "@mui/material";
import { FC, useState } from "react";

type Props = { adviserRole: AdviserRole; mutate: Mutate<User[]> };

const AdviserTag: FC<Props> = ({ adviserRole }) => {
  const [isViewRole, setIsViewRoleOpen] = useState(false);

  const handleOpenViewRoleModal = () => {
    setIsViewRoleOpen(true);
  };

  return (
    <Chip
      label="Adviser"
      size="small"
      color="info"
      onClick={handleOpenViewRoleModal}
    />
  );
};
export default AdviserTag;
