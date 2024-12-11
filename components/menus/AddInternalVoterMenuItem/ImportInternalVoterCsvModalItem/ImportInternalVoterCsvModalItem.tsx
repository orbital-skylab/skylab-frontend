import ImportInternalVoterCsvModal from "@/components/modals/ImportInternalVoterCsvModal";
import { Mutate } from "@/hooks/useFetch";
import { GetInternalVotersResponse } from "@/types/api";
import { MenuItem } from "@mui/material";
import { FC, useState } from "react";

type Props = {
  voteEventId: number;
  handleCloseMenu: () => void;
  mutateInternalVoters: Mutate<GetInternalVotersResponse>;
};

const ImportInternalVoterCsvModalItem: FC<Props> = ({
  voteEventId,
  handleCloseMenu,
  mutateInternalVoters,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <ImportInternalVoterCsvModal
        voteEventId={voteEventId}
        open={isModalOpen}
        handleCloseMenu={handleCloseMenu}
        setOpen={setIsModalOpen}
        mutate={mutateInternalVoters}
      />
      <MenuItem onClick={handleOpenModal}>Import CSV</MenuItem>
    </>
  );
};
export default ImportInternalVoterCsvModalItem;
