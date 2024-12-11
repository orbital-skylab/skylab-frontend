import { AddInternalVoterMenuFactory } from "@/components/menus/AddInternalVoterMenu/AddInternalVoterMenuFactory";
import { Mutate } from "@/hooks/useFetch";
import { GetInternalVotersResponse, GetVoteEventResponse } from "@/types/api";
import { VoterManagement } from "@/types/voteEvents";
import { Add, KeyboardArrowDown } from "@mui/icons-material";
import { Button, Menu } from "@mui/material";
import { FC, MouseEvent, useState } from "react";

type Props = {
  voteEventId: number;
  voterManagement: VoterManagement;
  mutateInternalVoters: Mutate<GetInternalVotersResponse>;
  mutateVoteEvent: Mutate<GetVoteEventResponse>;
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
        <Add fontSize="small" sx={{ marginRight: "0.2rem" }} />
        Add Internal Voters
      </Button>
      <Menu
        id="add-internal-voter-menu"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {AddInternalVoterMenuFactory.generateItems({
          voteEventId,
          voterManagement,
          handleCloseMenu: handleClose,
          mutateInternalVoters,
          mutateVoteEvent,
        })}
      </Menu>
    </>
  );
};
export default AddInternalVoterMenu;
