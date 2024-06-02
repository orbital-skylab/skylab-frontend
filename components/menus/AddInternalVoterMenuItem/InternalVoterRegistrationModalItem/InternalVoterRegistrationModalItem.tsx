import InternalVoterRegistrationModal from "@/components/modals/InternalVoterRegistrationModal";
import { Mutate } from "@/hooks/useFetch";
import { GetVoteEventResponse } from "@/types/api";
import { MenuItem } from "@mui/material";
import { FC, useState } from "react";

type Props = {
  voteEventId: number;
  isRegistrationOpen: boolean;
  handleCloseMenu: () => void;
  mutateVoteEvent: Mutate<GetVoteEventResponse>;
};

const InternalVoterRegistrationModalItem: FC<Props> = ({
  voteEventId,
  isRegistrationOpen,
  handleCloseMenu,
  mutateVoteEvent,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <InternalVoterRegistrationModal
        voteEventId={voteEventId}
        isRegistrationOpen={isRegistrationOpen}
        open={isModalOpen}
        handleCloseMenu={handleCloseMenu}
        setOpen={setIsModalOpen}
        mutate={mutateVoteEvent}
      />
      <MenuItem onClick={handleOpenModal}>Registration</MenuItem>
    </>
  );
};
export default InternalVoterRegistrationModalItem;
