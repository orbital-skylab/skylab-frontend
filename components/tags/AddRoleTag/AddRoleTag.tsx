import AddRoleModal from "@/components/modals/AddRoleModal";
import { Mutate } from "@/hooks/useFetch";
import { User } from "@/types/users";
import { Chip } from "@mui/material";
import { FC, useState } from "react";

type Props = {
  user: User;
  mutate: Mutate<User[]>;
};

const AddRoleTag: FC<Props> = ({ user, mutate }) => {
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);

  const handleOpenAddRoleModal = () => {
    setIsAddRoleOpen(true);
  };

  return (
    <>
      <AddRoleModal
        open={isAddRoleOpen}
        setOpen={setIsAddRoleOpen}
        user={user}
        mutate={mutate}
      />
      <Chip
        label="+"
        size="small"
        variant="outlined"
        onClick={handleOpenAddRoleModal}
      />
    </>
  );
};
export default AddRoleTag;
