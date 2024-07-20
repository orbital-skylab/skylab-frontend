import AddInternalVoterModalItem from "@/components/menus/AddInternalVoterMenuItem/AddInternalVoterModalItem/AddInternalVoterModalItem";
import ImportInternalVoterCsvModalItem from "@/components/menus/AddInternalVoterMenuItem/ImportInternalVoterCsvModalItem";
import InternalVoterRegistrationModalItem from "@/components/menus/AddInternalVoterMenuItem/InternalVoterRegistrationModalItem";
import { Mutate } from "@/hooks/useFetch";
import { GetInternalVotersResponse, GetVoteEventResponse } from "@/types/api";
import { VoterManagement } from "@/types/voteEvents";
import { KeyboardArrowDown } from "@mui/icons-material";
import { Button, Menu } from "@mui/material";
import { FC, MouseEvent, useState } from "react";

type Props = {
  voteEventId: number;
  voterManagement: VoterManagement;
  mutateInternalVoters: Mutate<GetInternalVotersResponse>;
  mutateVoteEvent: Mutate<GetVoteEventResponse>;
};

const AddInternalVoterMenuFactory = {
  generateItems: (
    voteEventId: number,
    voterManagement: VoterManagement,
    handleCloseMenu: () => void,
    mutateInternalVoters: Mutate<GetInternalVotersResponse>,
    mutateVoteEvent: Mutate<GetVoteEventResponse>
  ) => {
    const { isRegistrationOpen } = voterManagement;

    const menuItems = [
      <AddInternalVoterModalItem
        key={"add-internal-voter-modal-item"}
        voteEventId={voteEventId}
        handleCloseMenu={handleCloseMenu}
        mutateInternalVoters={mutateInternalVoters}
      />,
      <ImportInternalVoterCsvModalItem
        key={"import-internal-voter-csv-modal-item"}
        voteEventId={voteEventId}
        handleCloseMenu={handleCloseMenu}
        mutateInternalVoters={mutateInternalVoters}
      />,
      <InternalVoterRegistrationModalItem
        key={"internal-voter-registration-modal-item"}
        voteEventId={voteEventId}
        isRegistrationOpen={isRegistrationOpen}
        handleCloseMenu={handleCloseMenu}
        mutateVoteEvent={mutateVoteEvent}
      />,
    ];

    return menuItems;
  },
};

const AddInternalVoterMenu: FC<Props> = ({
  voteEventId,
  voterManagement,
  mutateInternalVoters,
  mutateVoteEvent,
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
        id="add-internal-voter-menu-button"
        variant="outlined"
        onClick={handleOpen}
        endIcon={<KeyboardArrowDown />}
      >
        Add Voters
      </Button>
      <Menu
        id="add-internal-voter-menu"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        {AddInternalVoterMenuFactory.generateItems(
          voteEventId,
          voterManagement,
          handleClose,
          mutateInternalVoters,
          mutateVoteEvent
        )}
      </Menu>
    </>
  );
};
export default AddInternalVoterMenu;
