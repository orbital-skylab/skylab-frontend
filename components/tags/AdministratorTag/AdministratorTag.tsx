/* eslint-disable @typescript-eslint/no-unused-vars */
//TODO:
import { Mutate } from "@/hooks/useFetch";
import { AdministatorRole } from "@/types/roles";
import { User } from "@/types/users";
import { Chip } from "@mui/material";
import { FC, useState } from "react";

type Props = { administratorRole: AdministatorRole; mutate: Mutate<User[]> };

const AdministratorTag: FC<Props> = ({ administratorRole, mutate }) => {
  const [isViewRole, setIsViewRoleOpen] = useState(false);

  const handleOpenViewRoleModal = () => {
    setIsViewRoleOpen(true);
  };

  return (
    <Chip
      label="Administrator"
      size="small"
      color="primary"
      onClick={handleOpenViewRoleModal}
    />
  );
};
export default AdministratorTag;
