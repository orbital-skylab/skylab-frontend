import AddExternalVoterModalItem from "@/components/menus/AddExternalVoterMenuItem/AddExternalVoterModalItem.tsx";
import ExternalVoterGenerationModalItem from "@/components/menus/AddExternalVoterMenuItem/ExternalVoterGenerationModalItem";
import ImportExternalVoterCsvModalItem from "@/components/menus/AddExternalVoterMenuItem/ImportExternalVoterCsvModalItem.tsx";
import { Mutate } from "@/hooks/useFetch";
import { GetExternalVotersResponse } from "@/types/api";
import { KeyboardArrowDown } from "@mui/icons-material";
import { Button, Menu } from "@mui/material";
import { FC, MouseEvent, useState } from "react";

type Props = {
  voteEventId: number;
  mutate: Mutate<GetExternalVotersResponse>;
};

const AddExternalVoterMenuFactory = {
  generateItems: (
    voteEventId: number,
    handleCloseMenu: () => void,
    mutateExternalVoters: Mutate<GetExternalVotersResponse>
  ) => {
    const menuItems = [
      <AddExternalVoterModalItem
        key={"add-external-voter-modal-item"}
        voteEventId={voteEventId}
        handleCloseMenu={handleCloseMenu}
        mutateExternalVoters={mutateExternalVoters}
      />,
      <ImportExternalVoterCsvModalItem
        key={"import-external-voter-csv-modal-item"}
        voteEventId={voteEventId}
        handleCloseMenu={handleCloseMenu}
        mutateExternalVoters={mutateExternalVoters}
      />,
      <ExternalVoterGenerationModalItem
        key={"external-voter-generation-modal-item"}
        voteEventId={voteEventId}
        handleCloseMenu={handleCloseMenu}
        mutateExternalVoters={mutateExternalVoters}
      />,
    ];

    return menuItems;
  },
};

const AddExternalVoterMenu: FC<Props> = ({ voteEventId, mutate }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="add-external-voter-button"
        variant="outlined"
        onClick={handleOpen}
        endIcon={<KeyboardArrowDown />}
      >
        Add Voters
      </Button>
      <Menu
        id="add-external-voter-menu"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        {AddExternalVoterMenuFactory.generateItems(
          voteEventId,
          handleClose,
          mutate
        )}
      </Menu>
    </>
  );
};
export default AddExternalVoterMenu;
