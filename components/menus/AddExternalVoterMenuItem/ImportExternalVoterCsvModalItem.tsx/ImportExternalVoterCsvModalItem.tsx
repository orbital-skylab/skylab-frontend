import ImportExternalVoterCsvModal from "@/components/modals/ImportExternalVoterCsvModal";
import { Mutate } from "@/hooks/useFetch";
import { GetExternalVotersResponse } from "@/types/api";
import { MenuItem } from "@mui/material";
import { FC, useState } from "react";

type Props = {
  voteEventId: number;
  handleCloseMenu: () => void;
  mutateExternalVoters: Mutate<GetExternalVotersResponse>;
};

const ImportExternalVoterCsvModalItem: FC<Props> = ({
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
      <ImportExternalVoterCsvModal
        voteEventId={voteEventId}
        open={isModalOpen}
        handleCloseMenu={handleCloseMenu}
        setOpen={setIsModalOpen}
        mutate={mutateExternalVoters}
      />
      <MenuItem onClick={handleOpenModal}>Import CSV</MenuItem>
    </>
  );
};
export default ImportExternalVoterCsvModalItem;
