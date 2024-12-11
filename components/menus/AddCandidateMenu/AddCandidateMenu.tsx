import { AddCandidateMenuFactory } from "@/components/menus/AddCandidateMenu/AddCandidateMenuFactory";
import { Mutate } from "@/hooks/useFetch";
import { GetCandidatesResponse } from "@/types/api";
import { Add, KeyboardArrowDown } from "@mui/icons-material";
import { Button, Menu } from "@mui/material";
import { FC, MouseEvent, useState } from "react";

type Props = {
  voteEventId: number;
  mutate: Mutate<GetCandidatesResponse>;
};

const AddCandidateMenu: FC<Props> = ({ voteEventId, mutate }) => {
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
        id="add-candidate-menu-button"
        variant="outlined"
        onClick={handleOpen}
        endIcon={<KeyboardArrowDown />}
      >
        <Add fontSize="small" sx={{ marginRight: "0.2rem" }} />
        Add Candidates
      </Button>
      <Menu
        id="add-candidate-menu"
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
        {AddCandidateMenuFactory.generateItems({
          voteEventId,
          handleCloseMenu: handleClose,
          mutateCandidates: mutate,
        })}
      </Menu>
    </>
  );
};
export default AddCandidateMenu;
