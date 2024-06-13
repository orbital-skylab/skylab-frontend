import BatchAddCandidateModal from "@/components/modals/BatchAddCandidateModal";
import { Mutate } from "@/hooks/useFetch";
import { GetCandidatesResponse } from "@/types/api";
import { MenuItem } from "@mui/material";
import { FC, useState } from "react";

type Props = {
  voteEventId: number;
  handleCloseMenu: () => void;
  mutateCandidates: Mutate<GetCandidatesResponse>;
};

const BatchAddCandidateMenuItem: FC<Props> = ({
  voteEventId,
  handleCloseMenu,
  mutateCandidates,
}) => {
  const [isBatchAddCandidateModalOpen, setIsBatchAddCandidateModalOpen] =
    useState(false);

  const handleOpenModal = () => {
    setIsBatchAddCandidateModalOpen(true);
  };

  return (
    <>
      <BatchAddCandidateModal
        voteEventId={voteEventId}
        open={isBatchAddCandidateModalOpen}
        setOpen={setIsBatchAddCandidateModalOpen}
        handleCloseMenu={handleCloseMenu}
        mutate={mutateCandidates}
      />
      <MenuItem onClick={handleOpenModal}>Batch Add Candidates</MenuItem>
    </>
  );
};
export default BatchAddCandidateMenuItem;
