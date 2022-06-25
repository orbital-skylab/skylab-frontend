/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO:
import { Mutate } from "@/hooks/useFetch";
import { MentorRole } from "@/types/roles";
import { User } from "@/types/users";
import { Chip } from "@mui/material";
import { FC, useState } from "react";

type Props = { mentorRole: MentorRole; mutate: Mutate<User[]> };

const MentorTag: FC<Props> = ({ mentorRole }) => {
  const [isViewRole, setIsViewRoleOpen] = useState(false);

  const handleOpenViewRoleModal = () => {
    setIsViewRoleOpen(true);
  };

  return (
    <Chip
      label="Mentor"
      size="small"
      color="secondary"
      onClick={handleOpenViewRoleModal}
    />
  );
};
export default MentorTag;
