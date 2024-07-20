import AddCandidateModal from "@/components/modals/AddCandidateModal";
import { Mutate } from "@/hooks/useFetch";
import { GetCandidatesResponse } from "@/types/api";
import { MenuItem } from "@mui/material";
import { FC, useState } from "react";

type Props = {
  voteEventId: number;
  handleCloseMenu: () => void;
  mutateCandidates: Mutate<GetCandidatesResponse>;
};

const AddCandidateMenuItem: FC<Props> = ({
  voteEventId,
  handleCloseMenu,
  mutateCandidates,
}) => {
  const [isAddCandidateModalOpen, setIsAddCandidateModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsAddCandidateModalOpen(true);
  };

  return (
    <>
      <AddCandidateModal
        voteEventId={voteEventId}
        open={isAddCandidateModalOpen}
        setOpen={setIsAddCandidateModalOpen}
        handleCloseMenu={handleCloseMenu}
        mutate={mutateCandidates}
      />
      <MenuItem id="add-candidate-menu-item-button" onClick={handleOpenModal}>
        Add Candidate
      </MenuItem>
    </>
  );
};
export default AddCandidateMenuItem;
