import ExternalVoterGenerationModal from "@/components/modals/ExternalVoterGenerationModal";
import { Mutate } from "@/hooks/useFetch";
import { GetExternalVotersResponse } from "@/types/api";
import { MenuItem } from "@mui/material";
import { FC, useState } from "react";

type Props = {
  voteEventId: number;
  handleCloseMenu: () => void;
  mutateExternalVoters: Mutate<GetExternalVotersResponse>;
};

const ExternalVoterGenerationModalItem: FC<Props> = ({
  voteEventId,
  handleCloseMenu,
  mutateExternalVoters,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    handleCloseMenu();
  };

  return (
    <>
      <ExternalVoterGenerationModal
        voteEventId={voteEventId}
        open={isModalOpen}
        setOpen={setIsModalOpen}
        mutate={mutateExternalVoters}
      />
      <MenuItem onClick={handleOpenModal}>Generate Voter IDs</MenuItem>
    </>
  );
};
export default ExternalVoterGenerationModalItem;
