import AddExternalVoterModal from "@/components/modals/AddExternalVoterModal";
import { Mutate } from "@/hooks/useFetch";
import { GetExternalVotersResponse } from "@/types/api";
import { MenuItem } from "@mui/material";
import { FC, useState } from "react";

type Props = {
  voteEventId: number;
  handleCloseMenu: () => void;
  mutateExternalVoters: Mutate<GetExternalVotersResponse>;
};

const AddExternalVoterModalItem: FC<Props> = ({
  voteEventId,
  handleCloseMenu,
  mutateExternalVoters,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <AddExternalVoterModal
        voteEventId={voteEventId}
        open={isModalOpen}
        handleCloseMenu={handleCloseMenu}
        setOpen={setIsModalOpen}
        mutate={mutateExternalVoters}
      />
      <MenuItem onClick={handleOpenModal}>Add Voter ID</MenuItem>
    </>
  );
};
export default AddExternalVoterModalItem;
