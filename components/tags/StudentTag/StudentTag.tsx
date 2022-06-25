/* eslint-disable @typescript-eslint/no-unused-vars */
//TODO:
import { Mutate } from "@/hooks/useFetch";
import { StudentRole } from "@/types/roles";
import { User } from "@/types/users";
import { Chip } from "@mui/material";
import { FC, useState } from "react";

type Props = { studentRole: StudentRole; mutate: Mutate<User[]> };

const StudentTag: FC<Props> = ({ studentRole, mutate }) => {
  const [isViewRole, setIsViewRoleOpen] = useState(false);

  const handleOpenViewRoleModal = () => {
    setIsViewRoleOpen(true);
  };

  return (
    <Chip
      label="Student"
      size="small"
      color="primary"
      onClick={handleOpenViewRoleModal}
    />
  );
};
export default StudentTag;
