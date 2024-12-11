import { AddExternalVoterMenuFactory } from "@/components/menus/AddExternalVoterMenu/AddExternalVoterMenuFactory";
import { Mutate } from "@/hooks/useFetch";
import { GetExternalVotersResponse } from "@/types/api";
import { Add, KeyboardArrowDown } from "@mui/icons-material";
import { Button, Menu } from "@mui/material";
import { FC, MouseEvent, useState } from "react";

type Props = {
  voteEventId: number;
  mutate: Mutate<GetExternalVotersResponse>;
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
        id="add-external-voter-menu-button"
        variant="outlined"
        onClick={handleOpen}
        endIcon={<KeyboardArrowDown />}
      >
        <Add fontSize="small" sx={{ marginRight: "0.2rem" }} />
        Add External Voters
      </Button>
      <Menu
        id="add-external-voter-menu"
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
        {AddExternalVoterMenuFactory.generateItems({
          voteEventId,
          handleCloseMenu: handleClose,
          mutateExternalVoters: mutate,
        })}
      </Menu>
    </>
  );
};
export default AddExternalVoterMenu;
