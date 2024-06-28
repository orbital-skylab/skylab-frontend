import AddInternalVoterModal from "@/components/modals/AddInternalVoterModal";
import { Mutate } from "@/hooks/useFetch";
import { GetInternalVotersResponse } from "@/types/api";
import { MenuItem } from "@mui/material";
import { FC, useState } from "react";

type Props = {
  voteEventId: number;
  handleCloseMenu: () => void;
  mutateInternalVoters: Mutate<GetInternalVotersResponse>;
};

const AddInternalVoterModalItem: FC<Props> = ({
  voteEventId,
  handleCloseMenu,
  mutateInternalVoters,
}) => {
  const [isAddInternalVoterModalOpen, setIsAddInternalVoterModalOpen] =
    useState(false);

  const handleOpenAddInternalVoterModal = () => {
    setIsAddInternalVoterModalOpen(true);
  };

  return (
    <div onKeyDown={(e) => e.stopPropagation()}>
      <AddInternalVoterModal
        voteEventId={voteEventId}
        open={isAddInternalVoterModalOpen}
        setOpen={setIsAddInternalVoterModalOpen}
        handleCloseMenu={handleCloseMenu}
        mutate={mutateInternalVoters}
      />
      <MenuItem onClick={handleOpenAddInternalVoterModal}>
        Add Internal Voter
      </MenuItem>
    </div>
  );
};
export default AddInternalVoterModalItem;
