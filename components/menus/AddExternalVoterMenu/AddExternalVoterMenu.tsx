import AddExternalVoterModalItem from "@/components/menus/AddExternalVoterMenuItem/AddExternalVoterModalItem.tsx";
import ExternalVoterGenerationModalItem from "@/components/menus/AddExternalVoterMenuItem/ExternalVoterGenerationModalItem";
import ImportExternalVoterCsvModalItem from "@/components/menus/AddExternalVoterMenuItem/ImportExternalVoterCsvModalItem.tsx";
import { Mutate } from "@/hooks/useFetch";
import { GetExternalVotersResponse } from "@/types/api";
import { VoterManagement } from "@/types/voteEvents";
import { KeyboardArrowDown } from "@mui/icons-material";
import { Button, Menu } from "@mui/material";
import { FC, MouseEvent, useState } from "react";

type Props = {
  voteEventId: number;
  voterManagement: VoterManagement;
  mutate: Mutate<GetExternalVotersResponse>;
};

const AddExternalVoterMenuFactory = {
  generateItems: (
    voteEventId: number,
    voterManagement: VoterManagement,
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
    ];
    const { hasExternalCsvImport, hasGeneration } = voterManagement;

    if (hasExternalCsvImport) {
      menuItems.push(
        <ImportExternalVoterCsvModalItem
          key={"import-external-voter-csv-modal-item"}
          voteEventId={voteEventId}
          handleCloseMenu={handleCloseMenu}
          mutateExternalVoters={mutateExternalVoters}
        />
      );
    }

    if (hasGeneration) {
      menuItems.push(
        <ExternalVoterGenerationModalItem
          key={"external-voter-generation-modal-item"}
          voteEventId={voteEventId}
          handleCloseMenu={handleCloseMenu}
          mutateExternalVoters={mutateExternalVoters}
        />
      );
    }

    return menuItems;
  },
};

const AddExternalVoterMenu: FC<Props> = ({
  voteEventId,
  voterManagement,
  mutate,
}) => {
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
        size="small"
        onClick={handleOpen}
        endIcon={<KeyboardArrowDown />}
      ></Button>
      <Menu
        id="add-external-voter-menu"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        // anchorOrigin={{
        //     vertical: 'top',
        //     horizontal: 'left',
        //   }}
        //   transformOrigin={{
        //     vertical: 'top',
        //     horizontal: 'left',
        //   }}
      >
        {AddExternalVoterMenuFactory.generateItems(
          voteEventId,
          voterManagement,
          handleClose,
          mutate
        )}
      </Menu>
    </>
  );
};
export default AddExternalVoterMenu;
