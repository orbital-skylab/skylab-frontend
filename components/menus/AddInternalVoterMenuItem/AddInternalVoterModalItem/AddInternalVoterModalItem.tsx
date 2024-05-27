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
    handleCloseMenu();
  };

  return (
    <>
      <AddInternalVoterModal
        voteEventId={voteEventId}
        open={isAddInternalVoterModalOpen}
        setOpen={setIsAddInternalVoterModalOpen}
        mutate={mutateInternalVoters}
      />
      <MenuItem onClick={handleOpenAddInternalVoterModal}>
        Add By Email
      </MenuItem>
    </>
  );
};
export default AddInternalVoterModalItem;
